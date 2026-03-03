import type { NextAuthConfig } from 'next-auth';

/**
 * Edge-safe auth config (no Node.js imports).
 * Used by middleware. The full config with Credentials provider is in auth.ts.
 */
export const authConfig: NextAuthConfig = {
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/auth/login',
  },
  providers: [], // Credentials provider added in auth.ts
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isAuthenticated = !!auth?.user;
      const isDashboard = nextUrl.pathname.startsWith('/dashboard');
      const isAdmin = nextUrl.pathname.startsWith('/admin');

      if ((isDashboard || isAdmin) && !isAuthenticated) {
        return false; // Redirects to signIn page
      }

      // Admin pages require admin role
      if (isAdmin && isAuthenticated) {
        const role = (auth?.user as Record<string, unknown> | undefined)?.role;
        if (role !== 'admin') {
          return Response.redirect(new URL('/dashboard', nextUrl));
        }
      }

      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as Record<string, unknown>).role || 'user';
      }
      return token;
    },
    session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
        (session.user as unknown as Record<string, unknown>).role = token.role || 'user';
      }
      return session;
    },
  },
};
