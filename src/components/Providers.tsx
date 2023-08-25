"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";
import React from "react";

// https://next-auth.js.org/getting-started/client#sessionprovider

const Providers = ({ children, ...props }: ThemeProviderProps) => {
	return (
		<NextThemesProvider attribute='class' defaultTheme='system' enableSystem>
			<SessionProvider>{children}</SessionProvider>
		</NextThemesProvider>
	);
};

export default Providers;
