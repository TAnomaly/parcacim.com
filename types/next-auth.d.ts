import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    role?: string;
    shopId?: string;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      role?: string;
      shopId?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    shopId?: string;
  }
}
