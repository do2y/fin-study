import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "finword_secret";

export function signToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: "24h" });
}

export function getAuthUser(request) {
  const authorization = request.headers.get("authorization") || "";
  const token = authorization.split(" ")[1];
  if (!token) return null;
  try {
    return jwt.verify(token, SECRET);
  } catch {
    return null;
  }
}
