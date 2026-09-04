import jwt from "jsonwebtoken";

// Guards every admin write route. Two independent locks have to open:
// 1) the server itself must be running with ENABLE_ADMIN=true (never true
//    on a public deployment), and
// 2) the caller must present a valid, unexpired admin token.
export default function adminAuth(req, res, next) {
  if (process.env.ENABLE_ADMIN !== "true") {
    return res.status(404).json({ error: "Not found" });
  }

  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) {
    return res.status(401).json({ error: "Missing admin token" });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired admin token" });
  }
}
