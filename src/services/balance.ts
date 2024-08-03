import { NotFoundError } from "../error/not_found_error";
import { ITransferBalance } from "../interfaces/balance";
import { BalanceModel } from "../models/balance";
import HttpStatusCodes from "http-status-codes";
import UserModel from "../models/user";
import { BadRequestError } from "../error/bad_request_error";
import { TransactionLimitModel } from "../models/transaction_limit";
import { ITransactionLimit } from "../interfaces/transaction_limit";
import NotificationModel from "../models/notification";

/**
 * Loads balance into the user's bank account.
 *
 * @async
 * @function loadBalance
 * @param {string} userId - The ID of the user.
 * @param {string} bankAccountId - The ID of the bank account.
 * @param {number} amount - The amount to load.
 * @param {string} purpose - The purpose of loading the balance.
 * @param {string} remarks - Any additional remarks for the balance load.
 * @throws {NotFoundError} If user or bank account is not found.
 * @throws {BadRequestError} If balance limit is exceeded.
 * @returns {Promise<{statusCode: number, message: string}>} The result of the balance loading operation.
 */
export const loadBalance = async (
  userId: string,
  bankAccountId: string,
  amount: number,
  purpose: string,
  remarks: string
): Promise<{ statusCode: number; message: string }> => {
  await BalanceModel.loadBalance(
    userId,
    bankAccountId,
    amount,
    purpose,
    remarks
  ).then(async (data: any) => {
    
    /** 
     * Create basic notification and store to database
     */
    await NotificationModel.createBasicNotification(
      userId,
      `You've successfully loaded Rs.${amount}. from ${data.bankAccountDetails.name}.`,
      "Load Balance",
      data.transactionId.id
    );
  });
  return {
    statusCode: HttpStatusCodes.OK,
    message: `You've successfully loaded Rs.${amount}.`,
  };
};

/**
 * Transfers balance from sender's bank account to receiver's email.
 *
 * @async
 * @function transferBalance
 * @param {Object} balanceTransferArguments - The arguments for balance transfer.
 * @param {string} balanceTransferArguments.senderUserId - The ID of the sender's user.
 * @param {string} balanceTransferArguments.receiverEmail - The email of the receiver.
 * @param {number} balanceTransferArguments.amount - The amount to transfer.
 * @param {string} balanceTransferArguments.purpose - The purpose of transfer.
 * @param {string} balanceTransferArguments.remarks - Any additional remarks for the balance transfer.
 * @throws {Error} If sender's user or receiver's email is not found.
 * @throws {Error} If balance limit is exceeded.
 * @returns {Promise<{statusCode: number, message: string}>} The result of the balance transfer operation.
 */
export const transferBalance = async (
  balanceTransferArguments: ITransferBalance
): Promise<{ statusCode: number; message: string }> => {
  const senderUser = await UserModel.getUserById(
    balanceTransferArguments.senderUserId
  );

  let transactionLimit: ITransactionLimit | null;

  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const currentDate = `${year}-${month}`;

  if (!senderUser.isVerified) {
    transactionLimit = await TransactionLimitModel.fetchTransactionLimit(
      senderUser.id,
      currentDate
    );

    if (!transactionLimit) {
      await TransactionLimitModel.createTransactionLimit(
        senderUser.id,
        currentDate,
        10
      );
    } else {
      if (+transactionLimit.limit === 0) {
        throw new BadRequestError(
          "You have reached your transaction limit for this month."
        );
      }
    }
  }

  const receiverUser = await UserModel.getUserByEmail(
    balanceTransferArguments.receiverEmail
  ); 

  /**
   * Check if users exist.
   */
  if (!receiverUser || !senderUser) {
    throw new NotFoundError("No user found with associated email.");
  }

  /**
   * Check if user has enough balance to transfer.
   */
  if (+senderUser.balance < balanceTransferArguments.amount) {
    throw new BadRequestError("You do not have enough balance.");
  }

  /**
   * Check if the user's transfering balance to oneself.
   */
  if (receiverUser.id === senderUser.id) {
    throw new BadRequestError("You can't transfer funds to yourself.");
  }

  await BalanceModel.transferBalance(
    balanceTransferArguments,
    receiverUser,
    senderUser
  ).then(async () => {
    if (transactionLimit) {
      await TransactionLimitModel.updateTransactionLimit(
        senderUser.id,
        currentDate,
        +transactionLimit.limit - 1
      );
    }
  });

  return {
    statusCode: HttpStatusCodes.OK,
    message: "Balance transferred successfully.",
  };
};
