import { ITransferBalance } from "../interfaces/balance";
import { IUserById } from "../interfaces/user";
import BaseModel from "./base";

class NotificationModel extends BaseModel {
  /**
   * Creates notification for balance transfer.
   *
   * @param {ITransferBalance} balanceTransferArgs - The balance transfer arguments.
   * @param {IUserById} receiverUser - The receiver user.
   * @param {any} senderUser - The sender user.
   * @param {string} statementId - The statement ID.
   * @return {Promise<void>} Promise that resolves when notifications are created.
   */
  static createBalanceTransferNotifications: (
    balanceTransferArgs: ITransferBalance,
    receiverUser: IUserById,
    senderUser: any,
    statementId: string
  ) => Promise<void> = async (
    balanceTransferArgs: ITransferBalance,
    receiverUser: IUserById,
    senderUser: any,
    statementId: string
  ): Promise<void> => {
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

  /**
   * Creates a basic notification.
   *
   * @param {string} userId - The ID of the user.
   * @param {string} message - The message of the notification.
   * @param {string} type - The type of the notification.
   * @param {string} dataId - The ID of the data associated with the notification.
   * @return {Promise<void>} Promise that resolves when the notification is created.
   */
  static createBasicNotification = async (
    userId: string,
    message: string,
    type: string,
    dataId: string
  ): Promise<void> => {
    await this.queryBuilder()
      .insert({
        userId: userId,
        message: message,
        type: type,
        dataId: dataId,
      })
      .table("notifications");
  };

  /**
   * Fetches the notifications for a user.
   *
   * @param {string} userId - The ID of the user.
   * @param {number} size - The number of notifications to fetch per page.
   * @param {number} page - The page number of the notifications to fetch.
   * @returns {Promise<{ notifications: any[], totalCount: number }>} A promise that resolves to an object containing the fetched notifications and the total count of notifications for the user.
   */
  static fetchNotifications = async (
    userId: string,
    size: number,
    page: number
  ): Promise<{ notifications: any[]; totalCount: any }> => {
    const totalCount = await this.queryBuilder()
      .count()
      .from("notifications")
      .where("user_id", userId)
      .first();
    const notifications = await this.queryBuilder()
      .from("notifications")
      .where("user_id", userId)
      .limit(size)
      .offset((page - 1) * size)
      .orderBy("created_at", "desc");
    return { totalCount, notifications };
  };
}

export default NotificationModel;
