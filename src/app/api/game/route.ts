import { prisma } from "@/lib/db";
import { getAuthSession } from "@/lib/nextauth";
import { quizCreationSchema } from "@/schemas/form/quiz";
import axios from "axios";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export async function POST(req: Request, res: Response) {
	try {
		const session = await getAuthSession();
		if (!session?.user) {
			return NextResponse.json(
				{
					error: "you muse be logged in",
				},
				{ status: 401 }
			);
		}

		const body = await req.json();
		const { amount, topic, type } = quizCreationSchema.parse(body);

		//CREATING THE GAME IN OUR SQL DB
		const game = await prisma.game.create({
			data: {
				gameType: type,
				timeStarted: new Date(),
				//COMING FROM NEXTAUTH GOOGLE SESSION
				userId: session.user.id,
				topic,
			},
		});

		//INCREMENTING TOPIC COUNT UPON GAME CREATION
		await prisma.topic_count.upsert({
			where: {
				topic,
			},
			create: {
				topic,
				count: 1,
			},
			update: {
				count: {
					increment: 1,
				},
			},
		});

		//MAKING CALL TO OUR ENDPOINT TO GEN QUESTIONS FROM GPT
		const { data } = await axios.post(`${process.env.API_URL}/api/questions`, {
			amount,
			topic,
			type,
		});

		if (type === "mcq") {
			type mcQuestion = {
				question: string;
				answer: string;
				option1: string;
				option2: string;
				option3: string;
			};
			//ARRAY OF GAMES TO CREATE IN DB
			let gptQuestions = data.questions.map((question: mcQuestion) => {
				//SHUFFLING OPTIONS
				let options = [
					question.answer,
					question.option1,
					question.option2,
					question.option3,
				];
				options = options.sort(() => Math.random() - 0.5);

				//MAPPING OVER GPT QUESTIONS AND RETURNING RESPONSE
				return {
					question: question.question,
					answer: question.answer,
					options: JSON.stringify(options),
					gameId: game.id,
					questionType: "mcq",
				};
			});
			//CREATING QUESTIONS WITH OPTIONS ABOVE
			await prisma.question.createMany({
				data: gptQuestions,
			});
		} else if (type === "open_ended") {
			type openQuestion = {
				question: string;
				answer: string;
			};

			let gptQuestions = data.questions.map((question: openQuestion) => {
				return {
					question: question.question,
					answer: question.answer,
					gameId: game.id,
					questionType: "open_ended",
				};
			});
			await prisma.question.createMany({
				data: gptQuestions,
			});
		}

		return NextResponse.json({
			gameId: game.id,
		});
	} catch (error) {
		if (error instanceof ZodError) {
			return NextResponse.json({ error: error.issues }, { status: 400 });
		}

		//MOST LIKELY ERROR WITH GPT REPONSE NOT BEING PROPER JSON
		return NextResponse.json(
			{
				error: "Something went wrong",
				payload: error,
			},
			{
				status: 500,
			}
		);
	}
}
