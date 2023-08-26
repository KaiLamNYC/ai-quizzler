import React from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../ui/card";
type Props = {};

const RecentActivityCard = (props: Props) => {
	return (
		<Card className='col-span-4 lg:col-span-3'>
			<CardHeader>
				<CardTitle className='text-2xl font-bold'>Recent Activity</CardTitle>
				<CardDescription>You have taken a total of 8 quizzes</CardDescription>
			</CardHeader>
			<CardContent className='max-h-[580px] overflow-scroll'>
				History
			</CardContent>
		</Card>
	);
};

export default RecentActivityCard;
