const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoute = require("./routes/userRoute");
const blogRoute = require("./routes/blogRoute");
// For Firebase auth
const firebaseAdmin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");
// assert{type: json}

const dotenv = require("dotenv");
dotenv.config();
const cookieParser = require("cookie-parser");

const app = express();
app.use(express.json());
app.use(cookieParser());

// For Firebase
firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
});

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

app.use("/user", userRoute);
app.use("/blog", blogRoute);

// MongoDB Connection
mongoose.connect(process.env.MongoDB_CONN_STR, { autoIndex: true });

const port = 4000;

app.get("/test", (req, res) => {
  res.json("Server testing is running!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
