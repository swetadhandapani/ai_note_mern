const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

// MongoDB connection
connectDB(process.env.MONGO_URI);

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));
app.use("/api/ai", require("./routes/ai"));

// Serve frontend in production
if (process.env.NODE_ENV === "production") {
  const __dirname1 = path.resolve(__dirname, "..");
  app.use(express.static(path.join(__dirname1, "frontend", "dist")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname1, "frontend", "dist", "index.html"))
  );
} else {
  app.get("/", (req, res) => res.send("API is running..."));
}

// Force HTTPS on Render
app.use((req, res, next) => {
  if (req.headers["x-forwarded-proto"] !== "https") {
    return res.redirect("https://" + req.headers.host + req.url);
  }
  next();
});


app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
