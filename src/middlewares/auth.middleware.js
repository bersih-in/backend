import jwt from 'jsonwebtoken';

const getTokenFromHeader = (req) => {
  const authorizationHeader = req.headers.authorization;
  if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
    return authorizationHeader.substring(7);
  }
  return null;
};

const authenticateUser = async (req, res, next) => {
  const token = getTokenFromHeader(req);
  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (err) {
    return res.status(403).json({ success: false, message: err.message });
  }
};

export default authenticateUser;
