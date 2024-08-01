import BaseModel from "./base";

export class QuizModel extends BaseModel {
  static createQuizData = async (
    userId: string,
    date: string,
    points: number
  ) => {
    await this.queryBuilder()
      .insert({
        userId: userId,
        date: date,
        points: points,
      })
      .table("quiz_data");
  };

  static fetchQuizData = async (userId: string) => {
    const quizData = await this.queryBuilder()
      .select()
      .where("user_id", userId)
      .table("quiz_data")
      .first();

    return quizData;
  };
}
