"use client";

import { signIn } from "next-auth/react";
import React from "react";
import { Button } from "./ui/button";

type Props = { text: string };

// https://next-auth.js.org/getting-started/client#signin
const SignInButton = ({ text }: Props) => {
	return (
		<Button
			onClick={() => {
				signIn("google").catch(console.error);
			}}
		>
			{text}
		</Button>
	);
};

export default SignInButton;
