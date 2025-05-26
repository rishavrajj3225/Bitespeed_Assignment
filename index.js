const express = require("express");
const app = express();
const identifyRoute = require("./routes/identify");
require("dotenv").config();
const PORT= process.env.PORT||3000;

app.use(express.json());
app.use("/identify", identifyRoute);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
