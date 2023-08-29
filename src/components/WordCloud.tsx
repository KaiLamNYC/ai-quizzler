"use client";

import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import React from "react";
import D3WordCloud from "react-d3-cloud";

type Props = { formattedTopics: { text: string; value: number }[] };

//ENLARGING FONT SIZE BASED ON VALUE WITH RANDOM FORMULA
const enlargeFontSize = (word: { value: number }) =>
	Math.log2(word.value) * 5 + 16;

const WordCloud = ({ formattedTopics }: Props) => {
	const theme = useTheme();
	const router = useRouter();
	return (
		<>
			<D3WordCloud
				height={500}
				font='Times'
				fontSize={enlargeFontSize}
				rotate={0}
				padding={10}
				fill={theme.theme == "dark" ? "white" : "black"}
				data={formattedTopics}
				onWordClick={(event, word) => {
					router.push(`/quiz?topic=${word.text}`);
				}}
			/>
		</>
	);
};

export default WordCloud;
