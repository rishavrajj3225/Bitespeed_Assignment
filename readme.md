# POST /identify Endpoint Documentation

## Description
The `POST /identify` endpoint is used to identify a user based on their email and/or phone number. It handles identity linkage and maintains consistency by associating multiple contacts as either primary or secondary based on their attributes.

---

## Request
### Method
`POST`

### Endpoint
`/identify`

### Request Headers
- `Content-Type: application/json`

### Request Body
The body should be in raw JSON format and include the user's email and/or phone number.

```json
{
    "email": "user@example.com",
    "phoneNumber": "9999999999"
}

// created by postman