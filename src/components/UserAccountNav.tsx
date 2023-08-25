"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import React from "react";
import { User } from "../../node_modules/next-auth/index";
import Link from "../../node_modules/next/link";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import UserAvatar from "./UserAvatar";

type Props = {
	user: Pick<User, "name" | "image" | "email">;
};

const UserAccountNav = ({ user }: Props) => {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger>
				{/* user profile picture */}
				<UserAvatar user={user} />
			</DropdownMenuTrigger>
			<DropdownMenuContent className='bg-white' align='end'>
				<div className='flex items-center justify-start gap-2 p-2'>
					<div className='flex flex-col space-y-1 leading-none'>
						{user.name && <p className='font-medium'>{user.name}</p>}
						{user.email && (
							<p className='w={200px} truncate text-sm text-zinc-700'>
								{user.email}
							</p>
						)}
					</div>
				</div>

				<DropdownMenuSeparator />
				<DropdownMenuItem asChild>
					<Link href='/'>Hello</Link>
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					onClick={(e: any) => {
						e.preventDefault();
						signOut().catch(console.error);
					}}
					className='text-red-600 cursor-pointer'
				>
					Sign Out
					<LogOut className='w-4 h-4 ml-2' />
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default UserAccountNav;
