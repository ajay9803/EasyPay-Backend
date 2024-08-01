import { ITransferBalance } from "../interfaces/balance";
import { IUserById } from "../interfaces/user";
import BaseModel from "./base";

class NotificationModel extends BaseModel {
  static createNotifications: (
    balanceTransferArgs: ITransferBalance,
    receiverUser: IUserById,
    senderUser: any,
    statementId: string
  ) => Promise<void> = async (
    balanceTransferArgs: ITransferBalance,
    receiverUser: IUserById,
    senderUser: any,
    statementId: string
  ) => {
    await this.queryBuilder()
      .insert({
        userId: balanceTransferArgs.senderUserId,
        message: `You sent Rs. ${balanceTransferArgs.amount} to ${receiverUser.username}.`,
        type: "Balance Transfer",
        dataId: statementId,
      })
      .table("notifications");

    await this.queryBuilder()
      .insert({
        userId: receiverUser.id,
        message: `You received Rs. ${balanceTransferArgs.amount} from ${senderUser.username}.`,
        type: "Balance Transfer",
        dataId: statementId,
      })
      .table("notifications");
  };

  static fetchNotifications = async (
    userId: string,
    size: number,
    page: number
  ) => {
    const totalCount = await this.queryBuilder()
      .count()
      .from("notifications")
      .where("user_id", userId).first();
    const notifications = await this.queryBuilder()
      .from("notifications")
      .where("user_id", userId)
      .limit(size)
      .offset((page - 1) * size).orderBy("created_at", "desc");
    return {totalCount, notifications};
  };
}

export default NotificationModel;
