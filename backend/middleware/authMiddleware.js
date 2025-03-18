const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Verify JWT Token
exports.protect = async (req, res, next) => {
    let token;
  
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1]; // Extract token
    }
  
    if (!token) {
      return res.status(401).json({ message: "Not Authorized, No Token" });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id);
  
      if (!req.user) {
        return res.status(401).json({ message: "User Not Found" });
      }
  
      next();
    } catch (error) {
      res.status(401).json({ message: "Invalid Token" });
    }
  };
  
// Restrict access based on user role
exports.authorize = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: "Access Denied" });
  }
  next();
};
