import { NextResponse } from 'next/server';

// Notice the empty parentheses () here! 
export function middleware() {
  // Bypasses all authentication and lets the user through
  return NextResponse.next(); 
}

export const config = {
  matcher: [], // Matches nothing, completely disabling route protection
};