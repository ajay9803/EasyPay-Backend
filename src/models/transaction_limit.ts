import { ITransactionLimit } from "../interfaces/transaction_limit";
import BaseModel from "./base";

export class TransactionLimitModel extends BaseModel {
  static createTransactionLimit = async (
    userId: number,
    date: string,
    limit: number
  ): Promise<void> => {
    await this.queryBuilder()
      .insert({
        userId: userId,
        date: date,
        limit: limit,
      })
      .table("transaction_limits");
  };

  static fetchTransactionLimit = async (userId: number, date: string): Promise<ITransactionLimit | null> => {
    const transactionLimit = await this.queryBuilder()
      .select()
      .from("transaction_limits")
      .where("user_id", userId)
      .where("date", date)
      .first();

    return transactionLimit;
  };

  static updateTransactionLimit = async (
    userId: string,
    date: string,
    limit: number
  ) => {
    await this.queryBuilder()
      .update({
        limit: limit,
      })
      .table("transaction_limits").where("user_id", userId).where("date", date);
  };
}
