import { prisma } from "@/lib/db";
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

const HotTopicsCard = async (props: Props) => {
	const topics = await prisma.topic_count.findMany({});
	//FORMATTING STUFF
	const formattedTopics = topics.map((topic) => {
		return {
			text: topic.topic,
			value: topic.count,
		};
	});
	return (
		<Card className='col-span-4'>
			<CardHeader>
				<CardTitle className='text-2xl font-bold'>Trending Topics</CardTitle>
				<CardDescription>Click on a topic to start a quiz!</CardDescription>
			</CardHeader>
			<CardContent className='pl-2'>
				<WordCloud formattedTopics={formattedTopics} />
			</CardContent>
		</Card>
	);
};

export default HotTopicsCard;
