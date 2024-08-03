import { NotFoundError } from "../error/not_found_error";
import { StatementModel } from "../models/statement";
import HttpStatusCodes from "http-status-codes";

/**
 * Fetches the load fund transactions for a user.
 *
 * @param {string} userId - The ID of the user.
 * @return {Promise<{
 *   statusCode: number,
 *   message: string,
 *   transactions: Array<object>
 * }>} - The fetched load fund transactions.
 * @throws {NotFoundError} - If no load fund transactions are found for the user.
 */
export const fetchLoadFundTransactions = async (userId: string): Promise<{
  statusCode: number;
  message: string;
  transactions: Array<object>;
}> => {
  const transactions = await StatementModel.fetchLoadFundTransactions(userId);

  if (transactions.length === 0) {
    throw new NotFoundError("You are yet to load funds.");
  }
  return {
    statusCode: HttpStatusCodes.OK,
    message: "Load fund transactions fetched successfully.",
    transactions: transactions,
  };
};

/**
 * Fetches a load fund transaction by its ID for a user.
 *
 * @param {string} transactionId - The ID of the transaction.
 * @param {string} userId - The ID of the user.
 * @return {Promise<{
 *   statusCode: number,
 *   message: string,
 *   transaction: object
 * }>} - The fetched load fund transaction.
 * @throws {NotFoundError} - If the transaction is not found for the user.
 */
export const fetchLoadFundTransaction = async (transactionId: string, userId: string): Promise<{
  statusCode: number;
  message: string;
  transaction: object;
}> => {
  const transaction = await StatementModel.fetchLoadFundTransaction(
    transactionId, userId
  );

  if (!transaction) {
    throw new NotFoundError("Transaction not found.");
  }
  return {
    statusCode: HttpStatusCodes.OK,
    message: "Trasaction fetched successfully.",
    transaction: transaction,
  };
};

/**
 * Fetches balance transfer statements for a user.
 *
 * @param {string} userId - The ID of the user.
 * @param {number} page - The page number of the results.
 * @param {number} size - The number of results per page.
 * @param {string} cashFlow - The cash flow to filter the statements by (All, Debit, Credit).
 * @param {number} startDate - The start date to filter the statements by.
 * @param {number} endDate - The end date to filter the statements by.
 * @return {Promise<{
 *   statusCode: number,
 *   message: string,
 *   statements: object[],
 *   totalCount: number
 * }>} - The fetched balance transfer statements.
 */
export const getBalanceTransferStatements = async (
  userId: string,
  page: number,
  size: number,
  cashFlow: string,
  startDate: number,
  endDate: number
): Promise<{
    statusCode: number;
    message: string;
    statements: object[];
    totalCount: number;
  }> => {
  const resultObject = await StatementModel.getBalanceTransferStatements(
    userId,
    page,
    size,
    cashFlow,
    startDate,
    endDate
  );

  if (resultObject.statements.length === 0) {
    throw new NotFoundError("No statements found.");
  }

  return {
    statusCode: 200,
    message: "Statements fetched successfully.",
    statements: resultObject.statements,
    totalCount: resultObject.totalCount.count,
  };
};
