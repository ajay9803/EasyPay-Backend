import { NotFoundError } from "../error/not_found_error";
import { ITransferBalance } from "../interfaces/balance";
import { BalanceModel } from "../models/balance";
import HttpStatusCodes from "http-status-codes";
import UserModel from "../models/user";
import { BadRequestError } from "../error/bad_request_error";

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
  );
  return {
    statusCode: HttpStatusCodes.OK,
    message: `You've successfully loaded Rs.${amount}.`,
  };
};

export const transferBalance = async (
  balanceTransferArguments: ITransferBalance
) => {
  console.log(balanceTransferArguments);
  const receiverUser = await UserModel.getUserByEmail(
    balanceTransferArguments.receiverEmail
  );

  const senderUser = await UserModel.getUserById(
    balanceTransferArguments.senderUserId
  );

  if (receiverUser.id === senderUser.id) {
    throw new BadRequestError("You can't transfer funds to yourself.");
  }

  console.log("The sender user is: ", senderUser);
  console.log("The receiver user is: ", receiverUser);

  if (!receiverUser || !senderUser) {
    throw new NotFoundError("No user found with associated email.");
  }

  await BalanceModel.transferBalance(
    balanceTransferArguments,
    receiverUser,
    senderUser
  );

  return {
    statusCode: HttpStatusCodes.OK,
    message: "Balance transferred successfully.",
  };
};
