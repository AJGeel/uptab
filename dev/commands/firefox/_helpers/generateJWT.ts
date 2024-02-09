import jwt from "jsonwebtoken";

export const generateJWT = () => {
  const issuedAt = Math.floor(Date.now() / 1000);

  const payload = {
    iss: process.env.FIREFOX_JWT_ISSUER ?? "",
    jti: Math.random().toString(),
    iat: issuedAt,
    exp: issuedAt + 5 * 60, // 5 minutes after iat
  };

  const token = jwt.sign(payload, process.env.FIREFOX_JWT_SECRET ?? "");

  return token;
};
