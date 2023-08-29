"use client";
import Image from "next/image";
import React from "react";
import { Progress } from "./ui/progress";

type Props = {
	finished: boolean;
};

const loadingPhrases = [
	"Unleashing the AI quiz wizardry...✨",
	"Brewing a cup of knowledge, one question at a time...",
	"Our AI is working its magic in the question cauldron...",
	"Prepare for liftoff! Your quiz adventure is in progress...",
	"🚀 Commence countdown! Quiz generation in progress... ",
];

const LoadingQuestions = ({ finished }: Props) => {
	const [progress, setProgress] = React.useState(0);
	const [loadingText, setLoadingText] = React.useState(loadingPhrases[0]);

	//CYLCING THROUGH PHRASES WHILE LOADING
	React.useEffect(() => {
		const interval = setInterval(() => {
			const randomIndex = Math.floor(Math.random() * loadingPhrases.length);
			setLoadingText(loadingPhrases[randomIndex]);
		}, 2000);
		return () => clearInterval(interval);
	}, []);

	//SIMULATING PROGRESS BAR
	React.useEffect(() => {
		const interval = setInterval(() => {
			setProgress((prev) => {
				if (finished) return 100;
				if (prev === 100) {
					return 0;
				}
				if (Math.random() < 0.1) {
					return prev + 2;
				}
				return prev + 0.5;
			});
		}, 100);

		return () => clearInterval(interval);
	}, [finished]);
	return (
		<div className='absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-[70vw] md:w-[60vw] flex flex-col items-center'>
			<Image
				src={"/loading.gif"}
				width={500}
				height={500}
				alt='loading animation'
			/>
			<Progress value={progress} className='w-full mt-4' />
			<h1 className='mt-2 text-xl'>{loadingText}</h1>
		</div>
	);
};

export default LoadingQuestions;
