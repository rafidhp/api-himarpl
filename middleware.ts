import { NextResponse } from "next/server";

export function middleware() {
  const response = NextResponse.next();

  response.headers.set("Access-Control-Allow-Origin", "http://localhost:5173");
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE"
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  return response;
}

export const config = {
  matcher: ["/api/:path*"], // Terapkan hanya ke API routes
};
