import { BadRequestError } from "../error/bad_request_error";
import { NotFoundError } from "../error/not_found_error";
import { ITransferBalance } from "../interfaces/balance";
import { IUserById } from "../interfaces/user";
import BaseModel from "./base";
import UserModel from "./user";

export class BalanceModel extends BaseModel {
  static loadBalance = async (
    userId: string,
    bankAccountId: string,
    balance: number,
    purpose: string,
    remarks: string
  ) => {
    console.log("The purpose and remarks are: ", purpose, remarks);
    const bankAccount = await this.queryBuilder()
      .select("amount")
      .from("bank_accounts")
      .where("id", bankAccountId)
      .where("user_id", userId)
      .first();

    const userAccount = await UserModel.getUserById(userId);

    if (bankAccount && userAccount) {
      if (bankAccount.amount < balance) {
        throw new BadRequestError(
          "You don not have enough funds in your bank account."
        );
      }
      let newBankAccountAmount = +bankAccount.amount - balance;
      let newUserBalance = +userAccount.balance + balance;

      await this.queryBuilder()
        .update("amount", newBankAccountAmount)
        .from("bank_accounts")
        .where("id", bankAccountId)
        .where("user_id", userId);

      await this.queryBuilder()
        .update("balance", newUserBalance)
        .from("users")
        .where("id", userId);

      await this.queryBuilder()
        .insert({
          type: "Debit",
          user_id: userId,
          bank_account_id: bankAccountId,
          amount: balance,
          purpose,
          remarks,
        })
        .table("load_fund_transactions");
    } else {
      throw new NotFoundError("Your linked bank account was not found.");
    }
  };

  static transferBalance = async (
    balanceTransferArgs: ITransferBalance,
    receiverUser: IUserById,
    senderUser: any
  ) => {
    console.log("The users are: ", senderUser, receiverUser);
    await this.queryBuilder()
      .update("balance", +senderUser.balance - balanceTransferArgs.amount)
      .from("users")
      .where("id", senderUser.id);

    await this.queryBuilder()
      .update("balance", +receiverUser.balance + balanceTransferArgs.amount)
      .from("users")
      .where("id", receiverUser.id);

    await this.queryBuilder()
      .insert({
        senderUserId: balanceTransferArgs.senderUserId,
        receiverUserId: receiverUser.id,
        amount: balanceTransferArgs.amount,
        purpose: balanceTransferArgs.purpose,
        remarks: balanceTransferArgs.remarks,
        receiverUsername: receiverUser.username,
        senderUsername: senderUser.username,
      })
      .table("balance_transfer_statements");
  };
}
