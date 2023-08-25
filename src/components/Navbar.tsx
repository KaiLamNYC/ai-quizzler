import { getAuthSession } from "@/lib/nextauth";
import React from "react";
import Image from "../../node_modules/next/image";
import Link from "../../node_modules/next/link";
import SignInButton from "./SignInButton";
import { ThemeToggle } from "./ThemeToggle";
import UserAccountNav from "./UserAccountNav";

type Props = {};

const Navbar = async (props: Props) => {
	const session = await getAuthSession();
	// if (session?.user) {
	// 	return <pre>{JSON.stringify(session.user, null, 2)}</pre>;
	// } else {
	// 	return <div>Not signed in</div>;
	// }

	return (
		<div className='fixed inset-x-0 top-0 bg-white dark:bg-gray-950 z-[10] h-fit border-b border-zinc-300  py-2 '>
			<div className='flex items-center justify-between h-full gap-2 px-8 mx-auto max-w-7xl'>
				{/* LOGO BELOW */}
				{/* <Image
					src={"/ai-quizzler/public/assets/logo.jpg"}
					alt='Logo'
					width={10}
					height={10}
				/> */}
				<Link href={"/"} className='flex items-center gap-2'>
					<p className='rounded-lg border-2 border-b-4 border-r-4 border-black px-2 py-1 text-xl font-bold transition-all hover:-translate-y-[2px] md:block dark:border-white'>
						AI Quizzler
					</p>
				</Link>
				<div className='flex items-center'>
					<ThemeToggle className='mr-3' />
					<div className='flex items-center'>
						{session?.user ? (
							<UserAccountNav user={session.user} />
						) : (
							<SignInButton text='Sign In'></SignInButton>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Navbar;
