"use client";

import { checkAnswerSchema } from "@/schemas/questions";
import { Game, Question } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { ChevronRight, Timer } from "lucide-react";
import React from "react";
import { z } from "zod";
import MCQCounter from "./MCQCounter";
import { Button } from "./ui/button";
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

	const { toast } = useToast();

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
		checkAnswer(undefined, {
			onSuccess: ({ isCorrect }) => {
				if (isCorrect) {
					toast({
						title: "Correct!",
						variant: "success",
					});
					setCorrectAnswers((prev) => prev + 1);
				} else {
					toast({
						title: "Wrong!",
						variant: "destructive",
					});
					setWrongAnswers((prev) => prev + 1);
				}
				//MOVING TO NEXT QUESTION
				setQuestionIndex((prev) => prev + 1);
			},
		});
	}, [checkAnswer, toast]);

	//GRABBING THE OPTIONS WHEN THE CURRENTQUESTION CHANGES
	const options = React.useMemo(() => {
		if (!currentQuestion) return [];
		if (!currentQuestion.options) return [];

		return JSON.parse(currentQuestion.options as string) as string[];
	}, [currentQuestion]);
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
						<span>00:00</span>
					</div>
				</div>
				<MCQCounter correctAnswers={3} wrongAnswers={4} />
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
					onClick={() => {
						handleNext();
					}}
				>
					Next <ChevronRight className='w-4 h-5 ml-2' />
				</Button>
			</div>
		</div>
	);
};

export default MCQ;
