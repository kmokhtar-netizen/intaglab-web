import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
    const basicAuth = req.headers.get('authorization');
    const url = req.nextUrl;

    // Bypass basic auth for static files, API routes, or Firebase storage imagery if needed
    if (
        url.pathname.startsWith('/api') ||
        url.pathname.startsWith('/_next') ||
        url.pathname.includes('.')
    ) {
        return NextResponse.next();
    }

    if (basicAuth) {
        const authValue = basicAuth.split(' ')[1];
        // Base64 decoding
        const [user, pwd] = atob(authValue).split(':');

        // Hardcoded credentials for Beta Testing
        if (user === 'intaglab2026' && pwd === 'betauser') {
            return NextResponse.next();
        }
    }

    // If no auth header or wrong credentials, ask for them
    return new NextResponse('Auth required', {
        status: 401,
        headers: {
            'WWW-Authenticate': 'Basic realm="Secure Area"',
        },
    });
}

// Optionally, configure the matcher to only run on certain paths
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico, sitemap.xml, robots.txt (metadata files)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
    ],
};
