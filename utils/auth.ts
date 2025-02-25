import { create, verify, getNumericDate } from "https://deno.land/x/djwt@v2.9.1/mod.ts";
import { connectDB } from "./db.ts";
import { IUser, USERS_COLLECTION, validatePassword } from "../models/User.ts";
import { ObjectId } from "mongodb";

const JWT_SECRET = Deno.env.get("JWT_SECRET") || "atvault_jwt_secret_key_2024";

// Crear una clave criptográfica para firmar los tokens
const cryptoKey = await crypto.subtle.importKey(
  "raw",
  new TextEncoder().encode(JWT_SECRET),
  { name: "HMAC", hash: "SHA-256" },
  false,
  ["sign", "verify"]
);

export async function createAuthToken(userId: string): Promise<string> {
  const payload = {
    iss: "atvault",
    sub: userId,
    exp: getNumericDate(60 * 60 * 24), // 24 horas
    iat: getNumericDate(0)
  };

  return await create(
    { alg: "HS256", typ: "JWT" },
    payload,
    cryptoKey
  );
}

export async function verifyAuthToken(token: string) {
  try {
    return await verify(token, cryptoKey);
  } catch (error) {
    console.error("Error verificando token:", error);
    return null;
  }
}

export async function getUserFromRequest(req: Request): Promise<IUser | null> {
  try {
    // Obtener token del header Authorization o de las cookies
    const authHeader = req.headers.get("Authorization");
    const token = authHeader ? authHeader.split(" ")[1] : getCookieValue(req, "auth");

    if (!token) return null;

    const payload = await verifyAuthToken(token);
    if (!payload || !payload.sub) return null;

    const db = await connectDB();
    const user = await db.collection<IUser>(USERS_COLLECTION).findOne({
      _id: new ObjectId(payload.sub),
    });

    return user;
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    return null;
  }
}

export async function authenticateUser(email: string, password: string): Promise<IUser | null> {
  try {
    const db = await connectDB();
    const user = await db.collection<IUser>(USERS_COLLECTION).findOne({ email });

    if (!user) return null;

    const isValid = await validatePassword(password, user.password);
    if (!isValid) return null;

    return user;
  } catch (error) {
    console.error("Error en autenticación:", error);
    return null;
  }
}

export function setAuthCookie(res: Response, token: string) {
  res.headers.set(
    "Set-Cookie",
    `auth=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400`
  );
}

export function clearAuthCookie(res: Response) {
  res.headers.set(
    "Set-Cookie",
    `auth=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`
  );
}

function getCookieValue(req: Request, name: string): string | null {
  const cookies = req.headers.get("cookie");
  if (!cookies) return null;

  const match = cookies.match(new RegExp(`${name}=([^;]+)`));
  return match ? match[1] : null;
} 