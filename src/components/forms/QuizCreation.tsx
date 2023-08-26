"use client";

import { quizCreationSchema } from "@/schemas/form/quiz";
import { zodResolver } from "@hookform/resolvers/zod";
import { BookOpen, CopyCheck } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../ui/card";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";

type Props = {};

type Input = z.infer<typeof quizCreationSchema>;

const QuizCreation = (props: Props) => {
	const form = useForm<Input>({
		resolver: zodResolver(quizCreationSchema),
		defaultValues: {
			amount: 3,
			topic: "",
			type: "open_ended",
		},
	});
	const onSubmit = (input: Input) => {
		console.log(input);
	};

	//WATCHING THE FORM FOR CHANGES TO RERENDER
	form.watch();
	return (
		<div className='absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2'>
			<Card>
				<CardHeader>
					<CardTitle className='text-2xl font-bold'>Create Quiz</CardTitle>
					<CardDescription>Choose a topic</CardDescription>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
							<FormField
								control={form.control}
								name='topic'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Topic</FormLabel>
										<FormControl>
											<Input placeholder='Enter a topic' {...field} />
										</FormControl>
										<FormDescription>
											Choose the topic for the quiz
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='amount'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Number of Questions</FormLabel>
										<FormControl>
											<Input
												placeholder='How many questions?'
												type='number'
												{...field}
												onChange={(e) => {
													form.setValue("amount", parseInt(e.target.value));
												}}
												min={1}
												max={10}
											/>
										</FormControl>
										<FormDescription>
											Choose the length of the quiz
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							<div className='flex justify-between'>
								<Button
									variant={
										form.getValues("type") === "mcq" ? "default" : "secondary"
									}
									className='w-1/2 rounded-none rounded-l-lg'
									onClick={() => {
										form.setValue("type", "mcq");
									}}
									type='button'
								>
									<CopyCheck className='w-4 h-4 mr-2' /> Multiple Choice
								</Button>
								<Separator orientation='vertical' />
								<Button
									variant={
										form.getValues("type") === "open_ended"
											? "default"
											: "secondary"
									}
									className='w-1/2 rounded-none rounded-r-lg'
									onClick={() => form.setValue("type", "open_ended")}
									type='button'
								>
									<BookOpen className='w-4 h-4 mr-2' /> Open Ended
								</Button>
							</div>
							<Button type='submit'>Submit</Button>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
};

export default QuizCreation;
