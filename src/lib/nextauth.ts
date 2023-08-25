import { PrismaAdapter } from "../../node_modules/@next-auth/prisma-adapter/dist/index";
import {
	DefaultSession,
	NextAuthOptions,
} from "../../node_modules/next-auth/index";
// import { StringLiteralLike } from "../../node_modules/typescript/lib/typescript";
import { getServerSession } from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "./db";

//DECLARING SESSION INTERFACE
// https://next-auth.js.org/getting-started/typescript#extend-default-interface-properties
declare module "next-auth" {
	interface Session extends DefaultSession {
		user: {
			id: string;
		} & DefaultSession["user"];
	}
}

//DECLARING JWT INTERFACE
declare module "next-auth/jwt" {
	interface JWT {
		id: string;
	}
}

//https://next-auth.js.org/configuration/options
export const authOptions: NextAuthOptions = {
	session: {
		strategy: "jwt",
	},
	callbacks: {
		//FINDING USER BY EMAIL IN PLANET DB
		jwt: async ({ token }) => {
			const db_user = await prisma.user.findFirst({
				where: {
					email: token?.email,
				},
			});
			//PASSING USER ID TO JWT TOKEN
			if (db_user) {
				token.id = db_user.id;
			}
			return token;
		},
		session: ({ session, token }) => {
			if (token) {
				//TAKING USER INFO FROM DATABASE AND PASSING IT TO TOKEN
				session.user.id = token.id;
				session.user.name = token.name;
				session.user.email = token.email;
				session.user.image = token.picture;
			}
			return session;
		},
	},
	secret: process.env.NEXTAUTH_SECRET,
	//https://next-auth.js.org/v3/adapters/prisma
	adapter: PrismaAdapter(prisma),
	// https://next-auth.js.org/providers/google#options
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
		}),
	],
};

//https://next-auth.js.org/configuration/nextjs#getserversession
export const getAuthSession = () => {
	return getServerSession(authOptions);
};
