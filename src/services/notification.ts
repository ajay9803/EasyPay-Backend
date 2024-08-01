import NotificationModel from "../models/notification";
import { NotFoundError } from "../error/not_found_error";
import HttpStatusCodes from "http-status-codes";

export const fetchNotifications = async (
  userId: string,
  size: number,
  page: number
) => {
  const resultObject = await NotificationModel.fetchNotifications(
    userId,
    size,
    page
  );

  if (resultObject.notifications.length === 0) {
    throw new NotFoundError("No available notifications.");
  }

  return {
    statusCode: HttpStatusCodes.OK,
    message: "Notifications fetched successfully.",
    notifications: resultObject.notifications,
    totalCount: resultObject.totalCount.count,
  };
};
