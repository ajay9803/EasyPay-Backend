import { NotFoundError } from "../error/not_found_error";
import BankAccountModel from "../models/bank_account";
import HttpStatusCodes from "http-status-codes";

/**
 * Fetches bank accounts linked to a user.
 *
 * @param {string} userId - The ID of the user.
 * @returns {Promise<{statusCode: number, message: string, accounts: Array<object>}>} -
 * The fetched bank accounts.
 * @throws {NotFoundError} - If no linked bank accounts are found.
 */
export const fetchBankAccounts = async (userId: string): Promise<{ statusCode: number; message: string; accounts: Array<object>; }> => {
  const bankAccounts = await BankAccountModel.getBankAccounts(userId);

  /**
   * Check if user has linked accounts.
   */
  if (bankAccounts.length === 0) {
    throw new NotFoundError("Not linked bank accounts found.");
  } else {
    return {
      statusCode: HttpStatusCodes.OK,
      message: "Linked accounts fetched successfully.",
      accounts: bankAccounts,
    };
  }
};
