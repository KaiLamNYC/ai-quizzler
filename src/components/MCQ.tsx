"use client";

import { cn, formatTimeDelta } from "@/lib/utils";
import { checkAnswerSchema } from "@/schemas/questions";
import { Game, Question } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { differenceInSeconds } from "date-fns";
import { BarChart, ChevronRight, Loader2, Timer } from "lucide-react";
import Link from "next/link";
import React from "react";
import { z } from "zod";
import MCQCounter from "./MCQCounter";
import { Button, buttonVariants } from "./ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { useToast } from "./ui/use-toast";

type Props = {
	game: Game & { questions: Pick<Question, "id" | "options" | "question">[] };
};

const MCQ = ({ game }: Props) => {
	//KEEPING TRACK OF WHAT QUESTION THE USER IS CURRENTLY ON
	const [questionIndex, setQuestionIndex] = React.useState(0);

	const [selectedChoice, setSelectedChoice] = React.useState<number>(0);

	//FOR MCQ COUNTER
	const [correctAnswers, setCorrectAnswers] = React.useState<number>(0);
	const [wrongAnswers, setWrongAnswers] = React.useState<number>(0);

	//KEEPING TRACK OF WHEN THE GAME IS OVER
	const [hasEnded, setHasEnded] = React.useState<boolean>(false);

	const [now, setNow] = React.useState<Date>(new Date());

	const { toast } = useToast();

	//WILL RUN EVERY SECOND TO UPDATE THE NOW TIME IN ORDER TO COMPARE TO GAME TIME STARTED
	React.useEffect(() => {
		const interval = setInterval(() => {
			if (!hasEnded) {
				setNow(new Date());
			}
		}, 1000);

		return () => {
			clearInterval(interval);
		};
	});

	// https://react.dev/reference/react/useMemo
	//WHEN INDEX CHANGES THIS RUNS TO GET CURRENT QUESTION
	const currentQuestion = React.useMemo(() => {
		return game.questions[questionIndex];
	}, [questionIndex, game.questions]);

	//FUNCTION TO COMPARE THE USERS INPUT AND THE CORRECT ANSWER
	const { mutate: checkAnswer, isLoading: isChecking } = useMutation({
		mutationFn: async () => {
			const payload: z.infer<typeof checkAnswerSchema> = {
				questionId: currentQuestion.id,
				userInput: options[selectedChoice],
			};
			const response = await axios.post(`/api/checkAnswer`, payload);
			return response.data;
		},
	});

	//https://react.dev/reference/react/useCallback

	const handleNext = React.useCallback(() => {
		if (isChecking) return;
		checkAnswer(undefined, {
			onSuccess: ({ isCorrect }) => {
				if (isCorrect) {
					toast({
						title: "Correct!",
						description: "Correct answer",
						variant: "success",
					});
					setCorrectAnswers((prev) => prev + 1);
				} else {
					toast({
						title: "Incorrect!",
						description: "Incorrect answer",
						variant: "destructive",
					});
					setWrongAnswers((prev) => prev + 1);
				}
				//CHECKING IS THERE ARE ANY QUESTIONS LEFT
				if (questionIndex === game.questions.length - 1) {
					setHasEnded(true);
					return;
				}
				//MOVING TO NEXT QUESTION
				setQuestionIndex((prev) => prev + 1);
			},
		});
	}, [checkAnswer, toast, isChecking, questionIndex, game.questions.length]);

	//FOR KEYBOARD ACCESSABILITY
	React.useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key == "1") {
				setSelectedChoice(0);
			} else if (event.key == "2") {
				setSelectedChoice(1);
			} else if (event.key == "3") {
				setSelectedChoice(2);
			} else if (event.key == "4") {
				setSelectedChoice(3);
			} else if (event.key === "Enter") {
				handleNext();
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		//CLEAN UP FUNCTION
		return () => {
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [handleNext]);

	//GRABBING THE OPTIONS WHEN THE CURRENTQUESTION CHANGES
	const options = React.useMemo(() => {
		if (!currentQuestion) return [];
		if (!currentQuestion.options) return [];

		return JSON.parse(currentQuestion.options as string) as string[];
	}, [currentQuestion]);

	if (hasEnded) {
		return (
			<div className='absolute flex flex-col justify-center top-1/2 left-1/2 -translate-x-1/2 -teanslate-y-1/2'>
				<div className='px-4 mt-2 font-semibold text-white bg-green-500 rounded-md whitespace-nowrap'>
					You completed in{" "}
					{formatTimeDelta(differenceInSeconds(now, game.timeStarted))}
				</div>
				<Link
					href={`/statistics/${game.id}`}
					//FUNCTION TO COMBINE CLASSES
					className={cn(buttonVariants(), "mt-2")}
				>
					View Statistics
					<BarChart className='w-4 h-4 ml-2' />
				</Link>
			</div>
		);
	}

	return (
		<div className='absolute top-1/2 left-1/2  -translate-x-1/2 -translate-y-1/2 md:w-[80vw] max-w-4xl w-[90vw]'>
			<div className='flex flex-row justify-between'>
				{/* TOPIC */}
				<div className='flex flex-col'>
					<p>
						<span className='text-slate-400 mr-2'>Topic</span>
						<span className='px-2 py-1 text-white rounded-lg bg-slate-800'>
							{game.topic}
						</span>
					</p>
					<div className='flex self-start mt-3 text-slate-400'>
						<Timer className='mr-2' />
						{formatTimeDelta(differenceInSeconds(now, game.timeStarted))}
					</div>
				</div>
				<MCQCounter
					correctAnswers={correctAnswers}
					wrongAnswers={wrongAnswers}
				/>
			</div>
			<Card className='w-full mt-4'>
				<CardHeader className='flex flex-row items-center'>
					<CardTitle className='mr-5 text-center divide-y divide-zinc-600/50'>
						<div>{questionIndex + 1}</div>
						<div className='text-base text-slate-400'>
							{game.questions.length}
						</div>
					</CardTitle>
					<CardDescription className='flex-grow text-lg'>
						{currentQuestion.question}
					</CardDescription>
				</CardHeader>
			</Card>

			<div className='flex flex-col items-center justify-enter w-full mt-4'>
				{options.map((option, index) => {
					return (
						<Button
							key={index}
							className='justify-start w-full py-8 mb-4'
							//CHANGING COLOR DEPENDING ON WHICH BUTTON IS SELECTED
							variant={selectedChoice === index ? "default" : "secondary"}
							onClick={() => {
								setSelectedChoice(index);
							}}
						>
							<div className='flex items-center justify-start'>
								<div className='p-2 px-3 mr-5 border rounded-md'>
									{index + 1}
								</div>
								<div className='text-start'>{option}</div>
							</div>
						</Button>
					);
				})}
				<Button
					disabled={isChecking}
					onClick={() => {
						handleNext();
					}}
				>
					{isChecking && <Loader2 className='w-4 h-4 animate-spin' />}
					Next <ChevronRight className='w-4 h-5 ml-2' />
				</Button>
			</div>
		</div>
	);
};

export default MCQ;
