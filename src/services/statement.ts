import { NotFoundError } from "../error/not_found_error";
import { StatementModel } from "../models/statement";
import HttpStatusCodes from "http-status-codes";

export const fetchLoadFundTransactions = async (userId: string) => {
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

export const fetchLoadFundTransaction = async (transactionId: string, userId: string) => {
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

export const getBalanceTransferStatements = async (
  userId: string,
  page: number,
  size: number,
  cashFlow: string,
  startDate: number,
  endDate: number
) => {
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
