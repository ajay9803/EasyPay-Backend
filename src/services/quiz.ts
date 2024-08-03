import { ConflictError } from "../error/conflict_error";
import { QuizModel } from "../models/quiz";
import HttpStatusCodes from "http-status-codes";

/**
 * Creates the quiz data for a user.
 *
 * @async
 * @function createTheQuizData
 * @param {string} userId - The ID of the user.
 * @param {number} points - The points scored in the quiz.
 * @throws {ConflictError} If the user has already played the quiz today.
 * @returns {Promise<{statusCode: number, message: string}>} The status code and message indicating the result of the operation.
 */
export const createTheQuizData = async (
  userId: string,
  points: number
): Promise<{ statusCode: number; message: string }> => {
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

/**
 * Fetches the quiz data for a user.
 *
 * @async
 * @function fetchTheQuizData
 * @param {string} userId - The ID of the user.
 * @throws {ConflictError} If the user has already played the quiz today.
 * @returns {Promise<{statusCode: number, message: string}>} The status code and message indicating the result of the operation.
 */
export const fetchTheQuizData = async (
  userId: string
): Promise<{ statusCode: number; message: string }> => {
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
