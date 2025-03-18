const express = require("express");
const cors = require("cors");
// const bodyParser = require("body-parser");


const { connection, PORT } = require("./config/db");

const app = express();
app.use(express.json());
app.use(cors());


// app.use(express.json()); // Ensure JSON parsing
// app.use(bodyParser.json()); // Parses JSON request bodies
// app.use(bodyParser.urlencoded({ extended: true })); // Parses form data

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/employees", require("./routes/employeeRoutes"));

app.get("/", (req, res) => {
  res.json({ message: "Server is running!" });
});



app.listen(PORT, async () => {
  try {
    await connection;
    console.log("Connected to DataBase");
  } catch (error) {
    console.log(`${error} is giving while connecting`);
  }
  console.log(`Listening on PORT: ${PORT}`);
});