import { NextRequest, NextResponse } from "next/server";
import { validateCredentials, signToken, setAuthCookie } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (typeof email !== "string" || typeof password !== "string" || !email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const validation = await validateCredentials(email, password);

    if (!validation.isValid) {
      console.warn("[auth/login] invalid credentials", {
        hasAdminEmail: validation.hasAdminEmail,
        hasPasswordHash: validation.hasPasswordHash,
        emailMatches: validation.emailMatches,
        passwordHashLength: validation.passwordHashLength,
        passwordCheckRan: validation.passwordCheckRan,
        passwordMatches: validation.passwordMatches,
      });

      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const token = await signToken({ email: validation.submittedEmail });
    setAuthCookie(token);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[auth/login] unexpected error", error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
