import { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/login",
  },
  providers: [],
  callbacks: {
    async jwt({ token, user }) {
      //Get data from user and add to JWT
      if (user) {
        token.id = user.id || "";
        token.isAdmin = user.isAdmin || false;
        token.preferredLanguage = user.preferredLanguage || null;
      }
      return token;
    },
    async session({ session, token }) {
      //Get same data from JWT and add to session so it is accessible within app
      if (token) {
        session.user.id = token.id;
        session.user.isAdmin = token.isAdmin;
        session.user.preferredLanguage = token.preferredLanguage;
      }
      return session;
    },
    authorized({ auth, request }) {
      const user = auth?.user;

      const currentURL = request?.nextUrl?.pathname?.toString();

      //TODO: ADD conditions for only logged in users
      const isOnUserPage = currentURL.startsWith("/myPage");
      if (isOnUserPage && !user) {
        return false;
      }

      //TODO: ADD conditions for admisn
      const isOnAdminPage = currentURL.startsWith("/admin");
      if (isOnAdminPage && !user?.isAdmin) {
        //Returning false will redirect to login
        return false;
      }

      //Prevent logged in users from reaching the login or register pages
      //Also redirects logged in users above from login to home
      const isOnLoginPage = currentURL.startsWith("/login");
      const isOnRegisterPage = currentURL.startsWith("/register");
      if ((isOnLoginPage || isOnRegisterPage) && user) {
        return Response.redirect(new URL("/", request.nextUrl));
      }

      return true;
    },
  },
};
