// Minimal session auth for a single admin user. No signup, no user table —
// credentials live in env vars (see .env.example) and get checked in the
// login route. This uses Web Crypto (crypto.subtle) instead of a JWT library
// so the exact same code runs in both the Node route handler and the Edge
// middleware that guards /dashboard and /api/projects.

export const SESSION_COOKIE_NAME = "docket_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

const encoder = new TextEncoder();

function bufferToHex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function sign(value, secret) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(value));
  return bufferToHex(signature);
}

export async function createSessionToken() {
  const secret = process.env.JWT_SECRET;
  const expiresAt = Date.now() + SESSION_TTL_SECONDS * 1000;
  const payload = String(expiresAt);
  const signature = await sign(payload, secret);
  return `${payload}.${signature}`;
}

export async function verifySessionToken(token) {
  if (!token) return false;

  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;
  if (Number(payload) < Date.now()) return false;

  const secret = process.env.JWT_SECRET;
  if (!secret) return false;

  const expected = await sign(payload, secret);
  return expected === signature;
}
