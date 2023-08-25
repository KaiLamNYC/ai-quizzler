import { authOptions } from "@/lib/nextauth";
import NextAuth from "next-auth/next";

// https://next-auth.js.org/getting-started/typescript

//PASSING THE OPTIONS WE MADE IN LIB
const handler = NextAuth(authOptions);

//GET REQUEST AND POST REQUEST ARE BOTH HANDLER
export { handler as GET, handler as POST };
