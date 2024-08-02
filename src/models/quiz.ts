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

  static fetchQuizData = async (userId: string, date: string) => {
    const quizData = await this.queryBuilder()
      .select()
      .from("quiz_data")
      .where("user_id", userId).where("date", date)
      
      .first();

    return quizData;
  };
}
