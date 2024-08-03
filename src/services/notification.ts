import NotificationModel from "../models/notification";
import { NotFoundError } from "../error/not_found_error";
import HttpStatusCodes from "http-status-codes";

/**
 * Fetches the notifications for the authenticated user.
 *
 * @async
 * @function fetchNotifications
 * @param {string} userId - The ID of the user.
 * @param {number} size - The number of results per page.
 * @param {number} page - The page number of the results.
 * @throws {NotFoundError} If no notifications are available.
 * @returns {Promise<any>} A promise that resolves when the notifications are successfully fetched.
 */
export const fetchNotifications = async (
  userId: string,
  size: number,
  page: number
): Promise<any> => {
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
