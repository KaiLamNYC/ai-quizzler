"use client";
import { useRouter } from "next/navigation";
import React from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../ui/card";
import WordCloud from "../WordCloud";

type Props = {};

const HotTopicsCard = (props: Props) => {
	const router = useRouter();
	return (
		<Card className='col-span-4'>
			<CardHeader>
				<CardTitle className='text-2xl font-bold'>Hot Topics</CardTitle>
				<CardDescription>Click on a topic to start a quiz!</CardDescription>
			</CardHeader>
			<CardContent className='pl-2'>
				<WordCloud />
			</CardContent>
		</Card>
	);
};

export default HotTopicsCard;
