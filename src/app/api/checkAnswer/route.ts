//FUNCTION TO CHECK IF THE USERS ANSWER IS CORRECT
import { prisma } from "@/lib/db";
import { checkAnswerSchema } from "@/schemas/questions";
import { NextResponse } from "next/server";
import { compareTwoStrings } from "string-similarity";
import { ZodError } from "zod";

export async function POST(req: Request, res: Response) {
	try {
		const body = await req.json();
		const { questionId, userInput } = checkAnswerSchema.parse(body);
		//FINDING QUESTION TO CHECK ANSWER
		const question = await prisma.question.findUnique({
			where: {
				id: questionId,
			},
		});

		if (!question) {
			return NextResponse.json(
				{
					error: "Question not found",
				},
				{
					status: 404,
				}
			);
		}

		await prisma.question.update({
			where: {
				id: questionId,
			},
			data: {
				userAnswer: userInput,
			},
		});

		if (question.questionType === "mcq") {
			//COMPARING ANSWERS
			const isCorrect =
				question.answer.toLowerCase().trim() === userInput.toLowerCase().trim();
			//ADDING IT TO OUR QUESTION DB FOR STATISTICS LATER
			await prisma.question.update({
				where: {
					id: questionId,
				},
				data: {
					isCorrect,
				},
			});
			//PASSING BACK THE BOOLEAN TO FRONTEND
			return NextResponse.json(
				{
					isCorrect,
				},
				{
					status: 200,
				}
			);
		} else if (question.questionType === "open_ended") {
			let percentageSimilar = compareTwoStrings(
				userInput.toLowerCase().trim(),
				question.answer.toLowerCase().trim()
			);

			percentageSimilar = Math.round(percentageSimilar * 100);

			await prisma.question.update({
				where: {
					id: questionId,
				},
				data: {
					percentageCorrect: percentageSimilar,
				},
			});

			return NextResponse.json(
				{
					percentageSimilar,
				},
				{ status: 200 }
			);
		}
	} catch (err) {
		if (err instanceof ZodError) {
			return NextResponse.json(
				{
					message: "Error checking answer",
					error: err.issues,
				},
				{
					status: 400,
				}
			);
		}
	}
}
