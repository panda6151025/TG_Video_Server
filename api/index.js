const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const connectDB = require("./config/db"); // Import your db connection
const userRoutes = require("./routes/userRoutes");
const boatRoutes = require("./routes/VidoeRoutes");
const app = express();

app.use(cors());
app.use(bodyParser.json({ limit: "4gb" })); // Increase the limit for JSON requests
app.use(express.urlencoded({ extended: true, limit: "4gb" })); // Increase the limit for form data

connectDB();

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/users", userRoutes);
app.use("/api/video", boatRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
