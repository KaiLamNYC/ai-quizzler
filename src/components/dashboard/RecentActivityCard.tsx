import { prisma } from "@/lib/db";
import { getAuthSession } from "@/lib/nextauth";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import HistoryComponent from "../HistoryComponent";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../ui/card";
type Props = {};

const RecentActivityCard = async (props: Props) => {
	const session = await getAuthSession();
	if (!session?.user) {
		return redirect("/");
	}

	const gamesCount = await prisma.game.count({
		where: {
			userId: session.user.id,
		},
	});

	return (
		<Card className='col-span-4 lg:col-span-3'>
			<CardHeader>
				<CardTitle className='text-2xl font-bold'>
					<Link href='/history'>Recent Activity</Link>
				</CardTitle>
				<CardDescription>
					You have taken a total of {gamesCount} quizzes
				</CardDescription>
			</CardHeader>
			<CardContent className='max-h-[580px] overflow-scroll'>
				{/* KNOWN TS ERROR JUST HAVE TO UPDATE TO LATEST TS */}
				<HistoryComponent limit={10} userId={session.user.id} />
			</CardContent>
		</Card>
	);
};

export default RecentActivityCard;
