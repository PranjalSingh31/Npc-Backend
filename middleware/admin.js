// middleware/admin.js

exports.isAdmin = (req, res, next) => {
  if (!req.user)
    return res.status(401).json({ error: "Not authorized" });

  // Accept both role:"admin" in DB AND isAdmin flag from JWT
  const isAdminUser =
    req.user.role === "admin" ||
    req.user.isAdmin === true ||
    req.user.isAdmin === "true";

  if (!isAdminUser)
    return res.status(403).json({ error: "Admin only" });

  next();
};
