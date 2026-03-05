import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "./lib/server/jwt";
import { getMongoDbInstance } from "./lib/server/mongodb";

const protectedRoutes = [
  '/library',
  '/library/add',
  '/api/protected'
];

async function withAuthMiddleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  const isProtectedRoute = protectedRoutes.some(route => 
    path === route || path.startsWith(route + '/')
  );
  
  await getMongoDbInstance()
  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  const user = await getCurrentUser();
  
  if (!user) {
    const loginUrl = new URL('/auth/register', request.url);
    return NextResponse.redirect(loginUrl);
  }

  const response = NextResponse.next();
  response.headers.set('x-user-id', user.userId);
  response.headers.set('x-user-email', user.email);
  
  return response;
}

export default async function proxy(request: NextRequest) {
  // Use custom JWT authentication middleware
  return await withAuthMiddleware(request);
}

// Read more: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
