import { ITransactionLimit } from "../interfaces/transaction_limit";
import BaseModel from "./base";

export class TransactionLimitModel extends BaseModel {
  /**
   * Creates a transaction limit record in the database.
   *
   * @param {number} userId - The ID of the user.
   * @param {string} date - The date of the transaction limit.
   * @param {number} limit - The limit of the transaction.
   * @return {Promise<void>} A promise that resolves when the transaction
   * limit is created.
   */
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

  /**
   * Fetches a transaction limit record from the database.
   *
   * @param {number} userId - The ID of the user.
   * @param {string} date - The date of the transaction limit.
   * @return {Promise<ITransactionLimit | null>} A promise that resolves to the
   * transaction limit record if it exists, or null if it does not.
   */
  static fetchTransactionLimit = async (
    userId: number,
    date: string
  ): Promise<ITransactionLimit | null> => {
    const transactionLimit = await this.queryBuilder()
      .select()
      .from("transaction_limits")
      .where("user_id", userId)
      .where("date", date)
      .first();

    return transactionLimit;
  };

  /**
   * Updates a transaction limit record in the database.
   *
   * @param {number} userId - The ID of the user.
   * @param {string} date - The date of the transaction limit.
   * @param {number} limit - The new limit of the transaction.
   * @return {Promise<void>} A promise that resolves when the transaction
   * limit is updated.
   */
  static updateTransactionLimit = async (
    userId: string,
    date: string,
    limit: number
  ): Promise<void> => {
    await this.queryBuilder()
      .update({
        limit: limit,
      })
      .table("transaction_limits")
      .where("user_id", userId)
      .where("date", date);
  };
}
