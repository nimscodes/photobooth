import { cookies } from "next/headers";
import { createHmac, randomUUID, timingSafeEqual } from "crypto";

const COOKIE = "admin_session";

function getSecret(): string {
  return process.env.ADMIN_PASSWORD ?? "";
}

function sign(token: string, exp: number): string {
  return createHmac("sha256", getSecret())
    .update(`${token}:${exp}`)
    .digest("hex");
}

export function buildSessionToken(): string {
  const token = randomUUID();
  const exp = Math.floor(Date.now() / 1000) + 8 * 3600;
  return `${token}:${exp}:${sign(token, exp)}`;
}

export function verifySessionToken(value: string): boolean {
  try {
    const parts = value.split(":");
    if (parts.length !== 3) return false;
    const [token, expStr, sig] = parts;
    const exp = parseInt(expStr, 10);
    if (!Number.isInteger(exp) || Math.floor(Date.now() / 1000) > exp) return false;
    if (sig.length !== 64 || !/^[0-9a-f]+$/.test(sig)) return false;
    const expected = sign(token, exp);
    return timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(sig, "hex"));
  } catch {
    return false;
  }
}

export async function isAdminAuthenticated(): Promise<boolean> {
  try {
    const jar = await cookies();
    const value = jar.get(COOKIE)?.value;
    return !!value && verifySessionToken(value);
  } catch {
    return false;
  }
}
