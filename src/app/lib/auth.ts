import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";
import type { NextAuthOptions } from "next-auth";

import KeycloakProvider, {
  KeycloakProfileToken,
} from "next-auth/providers/keycloak";
import { getServerSession } from "next-auth";

declare module "next-auth" {
  interface User {
    role?: string;
  }
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
  }
}

declare module "next-auth/providers/keycloak" {
  export interface KeycloakProfileToken extends KeycloakProfile {
    realm_access: { roles: [string] };
  }
}
function parseJwt(token: string) {
  return JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
}
// You'll need to import and pass this
// to `NextAuth` in `app/api/auth/[...nextauth]/route.ts`
export const config = {

  providers: [
    KeycloakProvider({
      profile(profile, tokens) {
        const tokenData: KeycloakProfileToken = parseJwt(
          tokens.access_token || ""
        );

        let theRole;

        if ("listsv2" in tokenData.resource_access) {
          theRole = tokenData.resource_access.listsv2.roles.find(
            (role: string) => role === "admin" || "user"
          );
        } else {
          theRole = "user";
        }

        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          role: theRole,
        };
      },
      clientId: process.env.KEYCLOAK_ID || "",
      clientSecret: process.env.KEYCLOAK_SECRET || "",
      issuer: process.env.KEYCLOAK_ISSUER,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = user.role;
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role;
        session.user.id = token.sub || "";
      }
      return session;
    },
  },
} satisfies NextAuthOptions;

// Use it in server contexts
export function auth(
  ...args:
    | [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]]
    | [NextApiRequest, NextApiResponse]
    | []
) {
  return getServerSession(...args, config);
}
