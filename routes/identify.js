const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// POST endpoint define kar rahe hain
router.post("/", async (req, res) => {
  const { email, phoneNumber } = req.body;

  // Agar email aur phone number dono nahi diye gaye hain to error bhej do
  if (!email && !phoneNumber) {
    return res.status(400).json({ error: "Email or phoneNumber is required." });
  }

  // Step 1: Email ya phoneNumber se match hone wale contacts database se nikaal rahe hain
  const matchedContacts = await prisma.contact.findMany({
    where: {
      OR: [
        email ? { email } : undefined,
        phoneNumber ? { phoneNumber } : undefined,
      ].filter(Boolean), // Undefined values hata rahe hain
    },
  });

  let allContacts = [...matchedContacts]; // Start mein matched contacts store kar rahe hain
  const seenIds = new Set(allContacts.map((c) => c.id)); // Duplicate avoid karne ke liye Set bana rahe hain
  const queue = [...matchedContacts]; // BFS jaise traverse ke liye queue bana rahe hain

  // Step 2: Har matched contact ke linked contacts nikaal rahe hain (graph traversal jaise)
  while (queue.length > 0) {
    const contact = queue.pop();
    if (!contact) continue;

    // Us contact ke linked contacts find kar rahe hain (both direction)
    const linked = await prisma.contact.findMany({
      where: {
        OR: [
          { linkedId: contact.id },
          contact.linkedId ? { id: contact.linkedId } : undefined,
        ].filter(Boolean),
      },
    });

    // Linked contacts ko allContacts mein add kar rahe hain agar wo naye hain
    for (const link of linked) {
      if (!seenIds.has(link.id)) {
        seenIds.add(link.id);
        allContacts.push(link);
        queue.push(link);
      }
    }
  }

  // Step 3: Agar koi bhi contact nahi mila to naya primary contact banana hai
  if (allContacts.length === 0) {
    const newContact = await prisma.contact.create({
      data: {
        email,
        phoneNumber,
        linkPrecedence: "primary",
      },
    });

    // Response mein naya primary contact ki details bhejna hai
    return res.status(200).json({
      contact: {
        primaryContatctId: newContact.id,
        emails: [newContact.email].filter(Boolean),
        phoneNumbers: [newContact.phoneNumber].filter(Boolean),
        secondaryContactIds: [],
      },
    });
  }

  // Step 4: Sabse purana primary contact identify kar rahe hain (createdAt ke basis pe)
  const primaryContact = allContacts.reduce((acc, curr) => {
    if (curr.linkPrecedence === "primary") {
      if (!acc || curr.createdAt < acc.createdAt) {
        return curr;
      }
    }
    return acc;
  }, null);

  // Step 5: Agar diya gaya email/phone pehle se exist nahi karta to secondary contact create krna hai
  const isExisting = allContacts.some(
    (c) => c.email === email && c.phoneNumber === phoneNumber
  );

  if (!isExisting && (email || phoneNumber)) {
    await prisma.contact.create({
      data: {
        email,
        phoneNumber,
        linkPrecedence: "secondary",
        linkedId: primaryContact.id,
      },
    });
  }

  // Secondary contacts ko filter (jo primary nahi hain)
  const secondaryContacts = allContacts.filter(
    (c) => c.id !== primaryContact.id
  );

  // Step 6: Final response - unique emails, phone numbers aur secondary IDs ke saath
  const emails = [
    ...new Set(
      [primaryContact.email, ...secondaryContacts.map((c) => c.email)].filter(
        Boolean
      )
    ),
  ];
  const phoneNumbers = [
    ...new Set(
      [
        primaryContact.phoneNumber,
        ...secondaryContacts.map((c) => c.phoneNumber),
      ].filter(Boolean)
    ),
  ];
  const secondaryContactIds = secondaryContacts.map((c) => c.id);

  // Response 
  return res.status(200).json({
    contact: {
      primaryContatctId: primaryContact.id,
      emails,
      phoneNumbers,
      secondaryContactIds,
    },
  });
});

module.exports = router; 
