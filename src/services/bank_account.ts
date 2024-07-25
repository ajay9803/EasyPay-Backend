import { NotFoundError } from "../error/not_found_error";
import BankAccountModel from "../models/bank_account";
import HttpStatusCodes from "http-status-codes";

export const fetchBankAccounts = async (userId: string) => {
  const bankAccounts = await BankAccountModel.getBankAccounts(userId);

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
