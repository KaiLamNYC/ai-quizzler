"use client";

import { useTheme } from "next-themes";
import React from "react";
import D3WordCloud from "react-d3-cloud";

type Props = {};

const data = [
	{
		text: "hey",
		value: 24,
	},
	{
		text: "there",
		value: 50,
	},
	{
		text: "bob",
		value: 3,
	},
];

//ENLARGING FONT SIZE BASED ON VALUE WITH RANDOM FORMULA
const enlargeFontSize = (word: { value: number }) => {
	return Math.log2(word.value) * 5 + 16;
};

const WordCloud = (props: Props) => {
	const theme = useTheme();
	return (
		<>
			<D3WordCloud
				height={500}
				font='Times'
				fontSize={enlargeFontSize}
				rotate={0}
				padding={10}
				fill={theme.theme == "dark" ? "white" : "black"}
				data={data}
			/>
		</>
	);
};

export default WordCloud;
