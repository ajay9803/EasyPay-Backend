import { NotFoundError } from "../error/not_found_error";
import { ITransferBalance } from "../interfaces/balance";
import { BalanceModel } from "../models/balance";
import HttpStatusCodes from "http-status-codes";
import UserModel from "../models/user";
import { BadRequestError } from "../error/bad_request_error";
import { TransactionLimitModel } from "../models/transaction_limit";
import { ITransactionLimit } from "../interfaces/transaction_limit";
import NotificationModel from "../models/notification";

export const loadBalance = async (
  userId: string,
  bankAccountId: string,
  amount: number,
  purpose: string,
  remarks: string
) => {
  await BalanceModel.loadBalance(
    userId,
    bankAccountId,
    amount,
    purpose,
    remarks
  ).then(async (data: any) => {
    console.log(data);
    await NotificationModel.createBasicNotification(
      userId,
      `You've successfully loaded Rs.${amount}. from ${data.bankAccountDetails.name}.`,
      "Load Balance",
      data.transactionId.id,
    );
  });
  return {
    statusCode: HttpStatusCodes.OK,
    message: `You've successfully loaded Rs.${amount}.`,
  };
};

export const transferBalance = async (
  balanceTransferArguments: ITransferBalance
) => {
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

  if (+senderUser.balance < balanceTransferArguments.amount) {
    throw new BadRequestError("You do not have enough balance.");
  }

  if (receiverUser.id === senderUser.id) {
    throw new BadRequestError("You can't transfer funds to yourself.");
  }

  if (!receiverUser || !senderUser) {
    throw new NotFoundError("No user found with associated email.");
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
