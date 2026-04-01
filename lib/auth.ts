import { SignJWT, jwtVerify } from "jose";
import { compare } from "bcryptjs";
import { cookies } from "next/headers";

const COOKIE_NAME = "fdl-admin-token";
const JWT_EXPIRY = "7d";

function readRuntimeEnv(name: string) {
  return process.env[name] || "";
}

export type CredentialValidationResult = {
  submittedEmail: string;
  adminEmail: string;
  hasAdminEmail: boolean;
  hasPasswordHash: boolean;
  passwordHashLength: number;
  passwordCheckRan: boolean;
  emailMatches: boolean;
  passwordMatches: boolean;
  isValid: boolean;
};

function getSecret() {
  const secret = readRuntimeEnv("JWT_SECRET");
  if (!secret) throw new Error("JWT_SECRET is not set");
  return new TextEncoder().encode(secret);
}

export async function signToken(payload: { email: string }) {
  return new SignJWT({ ...payload, role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRY)
    .sign(getSecret());
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload as { email: string; role: string };
  } catch {
    return null;
  }
}

export async function validateCredentials(
  email: string,
  password: string,
): Promise<CredentialValidationResult> {
  const submittedEmail = email.trim().toLowerCase();
  const adminEmail = readRuntimeEnv("ADMIN_EMAIL").trim().toLowerCase();
  const passwordHash =
    readRuntimeEnv("ADMIN_PASSWORD_HASH_V2") ||
    readRuntimeEnv("ADMIN_PASSWORD_HASH");

  const hasAdminEmail = Boolean(adminEmail);
  const hasPasswordHash = Boolean(passwordHash);
  const passwordHashLength = passwordHash.length;
  const emailMatches = submittedEmail === adminEmail;
  const passwordCheckRan = hasPasswordHash;
  const passwordMatches = passwordHash
    ? await compare(password, passwordHash)
    : false;

  return {
    submittedEmail,
    adminEmail,
    hasAdminEmail,
    hasPasswordHash,
    passwordHashLength,
    passwordCheckRan,
    emailMatches,
    passwordMatches,
    isValid: emailMatches && passwordMatches,
  };
}

export function setAuthCookie(token: string) {
  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });
}

export function clearAuthCookie() {
  cookies().set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
}

export function getAuthCookie() {
  return cookies().get(COOKIE_NAME)?.value;
}

export async function getSession() {
  const token = getAuthCookie();
  if (!token) return null;
  return verifyToken(token);
}
