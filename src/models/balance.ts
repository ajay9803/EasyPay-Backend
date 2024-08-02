import { BadRequestError } from "../error/bad_request_error";
import { NotFoundError } from "../error/not_found_error";
import { ITransferBalance } from "../interfaces/balance";
import { IUserById } from "../interfaces/user";
import BaseModel from "./base";
import NotificationModel from "./notification";
import UserModel from "./user";

export class BalanceModel extends BaseModel {
  /**
   * Loads balance from a user's bank account to their user account.
   * @param {string} userId - The ID of the user.
   * @param {string} bankAccountId - The ID of the user's bank account.
   * @param {number} balance - The amount to load.
   * @param {string} purpose - The purpose of the transaction.
   * @param {string} remarks - Additional remarks for the transaction.
   * @throws {BadRequestError} If the bank account has insufficient funds.
   * @throws {NotFoundError} If the bank account or user account is not found.
   * @returns {Promise<void>}
   */
  static loadBalance = async (
    userId: string,
    bankAccountId: string,
    balance: number,
    purpose: string,
    remarks: string
  ): Promise<any> => {
    // Fetch the bank account details
    const bankAccount = await this.queryBuilder()
      .select("amount")
      .from("bank_accounts")
      .where("id", bankAccountId)
      .where("user_id", userId)
      .first();

    // Fetch the user account details
    const userAccount = await UserModel.getUserById(userId);

    if (bankAccount && userAccount) {
      const bankAccountDetails = await this.queryBuilder()
        .select(
          "bank_accounts.*",
          "mock_banks.name",
          "mock_banks.location",
          "mock_banks.image_url",
          "mock_banks.est_date"
        )
        .from("bank_accounts")
        .join("mock_banks", "bank_accounts.bank_id", "mock_banks.id")
        .where("bank_accounts.id", bankAccountId)
        .first();

      // Check if the bank account has enough funds
      if (bankAccount.amount < balance) {
        throw new BadRequestError(
          "You do not have enough funds in your bank account."
        );
      }

      // Calculate the new balances
      let newBankAccountAmount = +bankAccount.amount - balance;
      let newUserBalance = +userAccount.balance + balance;

      // Update the bank account balance
      await this.queryBuilder()
        .update("amount", newBankAccountAmount)
        .from("bank_accounts")
        .where("id", bankAccountId)
        .where("user_id", userId);

      // Update the user account balance
      await this.queryBuilder()
        .update("balance", newUserBalance)
        .from("users")
        .where("id", userId);

      // Insert a record in the load fund transactions table
      const result = await this.queryBuilder()
        .insert({
          type: "Debit",
          user_id: userId,
          bank_account_id: bankAccountId,
          amount: balance,
          purpose,
          remarks,
        })
        .table("load_fund_transactions").returning('id');
      const transactionId = result[0];
      return { bankAccountDetails, transactionId };
    } else {
      throw new NotFoundError("Your linked bank account was not found.");
    }
  };

  /**
   * Transfers balance from one user to another.
   * @param {ITransferBalance} balanceTransferArgs - The arguments for the balance transfer.
   * @param {IUserById} receiverUser - The receiver user object.
   * @param {any} senderUser - The sender user object.
   * @returns {Promise<void>}
   */
  static transferBalance = async (
    balanceTransferArgs: ITransferBalance,
    receiverUser: IUserById,
    senderUser: any
  ): Promise<void> => {
    // Calculate the new balances for sender and receiver
    const senderTotalBalance = +senderUser.balance - balanceTransferArgs.amount;
    const receiverTotalBalance =
      +receiverUser.balance + balanceTransferArgs.amount;

    // Update the sender's balance
    await this.queryBuilder()
      .update("balance", senderTotalBalance)
      .from("users")
      .where("id", senderUser.id);

    // Update the receiver's balance
    await this.queryBuilder()
      .update("balance", receiverTotalBalance)
      .from("users")
      .where("id", receiverUser.id);

    // Insert a record in the balance transfer statements table
    const statement = await this.queryBuilder()
      .insert({
        senderUserId: balanceTransferArgs.senderUserId,
        receiverUserId: receiverUser.id,
        amount: balanceTransferArgs.amount,
        purpose: balanceTransferArgs.purpose,
        remarks: balanceTransferArgs.remarks,
        receiverUsername: receiverUser.username,
        senderUsername: senderUser.username,
        receiverTotalBalance: receiverTotalBalance,
        senderTotalBalance: senderTotalBalance,
        createdAt: new Date().getTime(),
      })
      .table("balance_transfer_statements")
      .returning("id");

    const statementId = statement[0].id;

    await NotificationModel.createBalanceTransferNotifications(
      balanceTransferArgs,
      receiverUser,
      senderUser,
      statementId
    );
  };
}
