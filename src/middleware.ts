import { NextRequest, NextResponse } from 'next/server'

function unauthorized() {
  return new NextResponse('Unauthorized', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Admin"' },
  })
}

function checkAuth(request: NextRequest): boolean {
  const auth = request.headers.get('authorization')
  if (!auth || !auth.startsWith('Basic ')) return false

  const decoded = atob(auth.slice(6))
  const [username, password] = decoded.split(':')
  const validUser = process.env.ADMIN_USERNAME
  const validPass = process.env.ADMIN_PASSWORD

  return username === validUser && password === validPass
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protect admin pages — always require auth
  if (pathname.startsWith('/admin')) {
    if (!checkAuth(request)) return unauthorized()
  }

  // Protect mutating API routes — require auth
  if (pathname.startsWith('/api/articles') && request.method !== 'GET') {
    if (!checkAuth(request)) return unauthorized()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/articles/:path*'],
}
