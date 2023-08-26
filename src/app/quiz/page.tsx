import QuizCreation from "@/components/forms/QuizCreation";
import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";
import React from "react";

type Props = {};

export const metadata = {
	title: "Quiz | AI Quizzler",
};

const QuizPage = async (props: Props) => {
	const session = await getAuthSession();
	if (!session?.user) {
		return redirect("/");
	}
	return <QuizCreation />;
};

export default QuizPage;
