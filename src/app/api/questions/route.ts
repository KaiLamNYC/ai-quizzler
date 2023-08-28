import { strict_output } from "@/lib/gpt";
import { getAuthSession } from "@/lib/nextauth";
import { quizCreationSchema } from "@/schemas/form/quiz";
import { ZodError } from "zod";

// https://nextjs.org/docs/app/api-reference/functions/next-response
import { NextResponse } from "../../../../node_modules/next/server";

export const POST = async (req: Request, res: Response) => {
	try {
		//PROTECTING ENDPOINT FROM UNAUTHORIZED USERS
		const session = await getAuthSession();
		if (!session?.user) {
			return NextResponse.json(
				{ error: "You must be logged in to create a quiz" },
				{ status: 401 }
			);
		}

		const body = await req.json();

		//USING ZOD SCHEMA AND GIVEN PARSE FUNCTION TO CHECK TYPE
		const { amount, topic, type } = quizCreationSchema.parse(body);
		//DECLARING FOR LATER
		let questions: any;
		if (type === "open_ended") {
			//SYSTEM PROMPT, USER PROMPT(ARRAY OF QUESTIONS), OUTPUT FORMAT
			//WILL KEEP RECURSIVELY CALLING UNTIL RECEIVES VALID RESPONSE
			questions = await strict_output(
				"You are a helpful AI that is able to generate a pair of questions and answers, the length of the answer should not exceed 15 words, store all the pairs of answers and questions in a JSON array",
				//CREATING AN ARRAY BASED ON THE AMOUNT PASSED AND FILLING THEM WITH SAME VALUE
				new Array(amount).fill(
					`You are to generate a random hard open-ended question about the ${topic}`
				),

				{
					question: "question",
					answer: "answer with max length of 15 words",
				}
			);
			return NextResponse.json(
				{
					questions,
				},
				{
					status: 200,
				}
			);
		} else if (type === "mcq") {
			questions = await strict_output(
				"You are a helpful AI that is able to generate mcq questions and answers, the length of each answer should not exceed 15 words.",
				//CREATING AN ARRAY BASED ON THE AMOUNT PASSED AND FILLING THEM WITH SAME VALUE
				new Array(amount).fill(
					`You are to generate a random mcq question about the ${topic}`
				),

				{
					question: "question",
					answer: "answer with max length of 15 words",
					option1: "1st option with max length of 15 words",
					option2: "2nd option with max length of 15 words",
					option3: "3rd option with max length of 15 words",
				}
			);
			return NextResponse.json(
				{
					questions,
				},
				{
					status: 200,
				}
			);
		}
	} catch (error: any) {
		//IF INCOMING REQ IS WRONG TYPE
		if (error instanceof ZodError) {
			return NextResponse.json(
				{
					error: error.issues,
				},
				{
					status: 400,
				}
			);
		}
	}
};
