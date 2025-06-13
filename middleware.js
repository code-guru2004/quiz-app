import { NextRequest, NextResponse } from "next/server";
import { isValidPassword } from "./lib/isValidPassword";
import jwt from 'jsonwebtoken';

// ✅ Move these to the top so all functions can access
function unauthorizedResponse() {
  return new NextResponse("Unauthorized", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Admin Area", charset="UTF-8"' },
  });
}

function enforceAuthOnEveryRequest() {
  return NextResponse.next({
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
  });
}

// ✅ JWT Middleware for /api/protected/*
async function jwtMiddleware(req) {
  const authHeader = req.headers.get("authorization") || req.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return unauthorizedResponse();
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Optional for future use
    return NextResponse.next();
  } catch (err) {
    return unauthorizedResponse();
  }
}

// ✅ Main middleware function
export async function middleware(req) {
  const url = req.nextUrl.pathname;

  // --- Admin Basic Auth
  if (url.startsWith("/admin")) {
    const authHeader =
      req.headers.get("authorization") || req.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Basic ")) {
      return unauthorizedResponse();
    }

    const base64Credentials = authHeader.split(" ")[1];
    let credentials;

    try {
      credentials = Buffer.from(base64Credentials, "base64").toString().split(":");
    } catch (error) {
      return unauthorizedResponse();
    }

    if (credentials.length !== 2) return unauthorizedResponse();

    const [username, password] = credentials;

    if (!process.env.ADMIN_USERNAME || !process.env.HASHED_ADMIN_PASSWORD) {
      console.error("Missing ADMIN_USERNAME or HASHED_ADMIN_PASSWORD in .env");
      return unauthorizedResponse();
    }

    const isAuthenticated =
      username === process.env.ADMIN_USERNAME &&
      (await isValidPassword(password, process.env.HASHED_ADMIN_PASSWORD));

    return isAuthenticated ? enforceAuthOnEveryRequest() : unauthorizedResponse();
  }

  // --- JWT Protected Routes
  if (url.startsWith("/api/protected")) {
    return jwtMiddleware(req);
  }

  return NextResponse.next(); // Unprotected route
}

export const config = {
  matcher: ["/admin/:path*", "/api/protected/:path*"],
};
