import BaseModel from "./base";

export class QuizModel extends BaseModel {
  /**
   * Creates a new quiz data entry in the database.
   *
   * @async
   * @function
   * @name createQuizData
   * @param {string} userId - The ID of the user who created the quiz data.
   * @param {string} date - The date the quiz data was created.
   * @param {number} points - The number of points the user scored in the quiz.
   * @return {Promise<void>} A promise that resolves when the quiz data is created.
   */
  static createQuizData = async (
    userId: string,
    date: string,
    points: number
  ): Promise<void> => {
    await this.queryBuilder()
      .insert({
        userId: userId,
        date: date,
        points: points,
      })
      .table("quiz_data");
  };

  /**
   * Fetches quiz data from the database for a specific user and date.
   *
   * @async
   * @function
   * @name fetchQuizData
   * @param {string} userId - The ID of the user.
   * @param {string} date - The date of the quiz data.
   * @return {Promise<any>} A promise that resolves with the quiz data or null if not found.
   */
  static fetchQuizData = async (userId: string, date: string): Promise<any> => {
    const quizData = await this.queryBuilder()
      .select()
      .from("quiz_data")
      .where("user_id", userId)
      .where("date", date)

      .first();

    return quizData;
  };
}
