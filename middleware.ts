import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Passa direto sem bloquear a rota e sem exigir Cookies
  return NextResponse.next();
}

// Limpa o matcher para não interceptar nada
export const config = {
  matcher: [],
};