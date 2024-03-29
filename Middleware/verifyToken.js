const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  // console.log(token);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Access token is invalid" });
    }

    req.user = user.id;
    // console.log("User ID:", req.user);

    next();
  });
};

module.exports = verifyToken;
