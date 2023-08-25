import Navbar from "@/components/Navbar";
import Providers from "@/components/Providers";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "AI Quizzler",
	description: "AI Quiz Site",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang='en'>
			{/* SHADCN FUNCTION TO MERGE CLASSNAMES */}
			<body className={cn(inter.className, "antialiased min-h-screen pt-16")}>
				<Providers>
					<Navbar />
					{children}
				</Providers>
			</body>
		</html>
	);
}
