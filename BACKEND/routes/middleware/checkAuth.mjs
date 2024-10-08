import jwt from 'jsonwebtoken';

// Middleware to check for valid JWT tokens
function checkAuth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;  // Attach user info to the request object
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token' });
  }
}

export default checkAuth;
