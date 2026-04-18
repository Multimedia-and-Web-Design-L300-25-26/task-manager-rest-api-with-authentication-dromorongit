import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
  try {
    // 1. Extract token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Attach user id to req.user
    req.user = { _id: decoded.userId };

    // 4. Call next()
    next();
  } catch (error) {
    // If invalid → return 401
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default authMiddleware;