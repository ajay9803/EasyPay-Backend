import { ConflictError } from "../error/conflict_error";
import { QuizModel } from "../models/quiz";
import HttpStatusCodes from "http-status-codes";

export const createTheQuizData = async (userId: string, points: number) => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;
  const quizData = await QuizModel.fetchQuizData(userId, formattedDate);

  if (quizData) {
    throw new ConflictError("You have already played the quiz today.");
  }

  await QuizModel.createQuizData(userId, formattedDate, points);

  return {
    statusCode: HttpStatusCodes.OK,
    message: `You have scored ${points} points today.`,
  };
};

export const fetchTheQuizData = async (userId: string) => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;

  const quizData = await QuizModel.fetchQuizData(userId, formattedDate);

  if (quizData) {
    throw new ConflictError("You have already played the quiz today.");
  }
  return {
    statusCode: HttpStatusCodes.OK,
    message: "Please proceed to play the quiz.",
  };
};
