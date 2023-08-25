import { SessionProvider } from "next-auth/react";
import React from "react";

type Props = {
	children: React.ReactNode;
};

// https://next-auth.js.org/getting-started/client#sessionprovider

const Providers = ({ children }: Props) => {
	return <SessionProvider>{children}</SessionProvider>;
};

export default Providers;
