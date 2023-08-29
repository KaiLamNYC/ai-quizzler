import keyword_extractor from "keyword-extractor";
import React from "react";

type Props = {
	answer: string;
	setBlankAnswer: React.Dispatch<React.SetStateAction<string>>;
};

const BLANKS = "_____";

const BlankAnswerInput = ({ answer, setBlankAnswer }: Props) => {
	const keywords = React.useMemo(() => {
		//EXTRACTING KEYWORDS FROM ANSWER TO PROVIDE BLANK INPUT FOR USER LATER
		const words = keyword_extractor.extract(answer, {
			language: "english",
			remove_digits: true,
			return_changed_case: false,
			remove_duplicates: false,
		});
		//SHUFFLING KEYWORDS TO SELECT 2 TO REMOVE FROM ANSWER
		const shuffled = words.sort(() => Math.random() - 0.5);
		return shuffled.slice(0, 2);
	}, [answer]);
	const answerWithBlanks = React.useMemo(() => {
		//MAPPING OVER KEYWORDS AND REPLACING THE SELECTED KEYWORDS WITH BLANKS
		const answerWithBlanks = keywords.reduce((acc, keyword) => {
			return acc.replace(keyword, BLANKS);
		}, answer);
		setBlankAnswer(answerWithBlanks);
		return answerWithBlanks;
	}, [keywords, answer, setBlankAnswer]);

	return (
		<div className='flex justify-start w-full mt-4 '>
			<h1 className='text-xl font-semibold'>
				{/* SPLITTING THE ANSWER INTO AN ARRAY SEPARATED BY BLANK SPACES */}
				{/* THIS ARRAY IS ONLY THE FILLED IN WORDS NO ACTUAL BLANKS */}
				{/* EXAMPLE: IMPROVED PERFORMACE AND BETTER BATTERY LIFE = IMPROVED, AND, BATTERY LIFE */}
				{/* THEN PLACING AN INPUT IN BETWEEN THE WORDS WHERE THE BLANKS WOULD HAVE BEEN */}
				{answerWithBlanks.split(BLANKS).map((part, index) => {
					return (
						<>
							{part}
							{index === answerWithBlanks.split(BLANKS).length - 1 ? null : (
								<input
									type='text'
									id='user-blank-input'
									className='text-center border-b-2 border-black dark:border-white w-28 focus:border-2 focus:border-b-4 focus:outline-none'
								/>
							)}
						</>
					);
				})}
			</h1>
		</div>
	);
};

export default BlankAnswerInput;
