import React from "react";
import { User } from "../../node_modules/next-auth/index";
import Image from "../../node_modules/next/image";
import { Avatar, AvatarFallback } from "./ui/avatar";

type Props = {
	user: Pick<User, "name" | "image">;
};

const UserAvatar = ({ user }: Props) => {
	return (
		<Avatar>
			{user.image ? (
				<div className='relative w-full h-full aspect-square'>
					<Image
						src={user.image}
						alt='profile picture'
						referrerPolicy='no-referrer'
						height={90}
						width={90}
					/>
				</div>
			) : (
				<AvatarFallback className='sr-only'>{user?.name}</AvatarFallback>
			)}
		</Avatar>
	);
};

export default UserAvatar;
