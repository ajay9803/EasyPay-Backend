import { NotFoundError } from "../error/not_found_error";
import { SocketModel } from "../models/socket";
import HttpStatusCodes from "http-status-codes";

/**
 * Creates a socket for the given user.
 *
 * @param {string} socketId - The ID of the socket.
 * @param {number} userId - The ID of the user.
 * @return {Promise<{
 *     statusCode: number,
 *     message: string,
 * }>} - The result of the socket creation.
 * @throws {NotFoundError} - If the user socket does not exist.
 */
export const createSocket = async (
  socketId: string,
  userId: number
): Promise<{
  statusCode: number;
  message: string;
}> => {
  const userSocket = await SocketModel.fetchSocket(userId);

  if (!userSocket) {
    await SocketModel.createSocket(socketId, userId);
  } else {
    await SocketModel.updateSocket(socketId, userId);
  }

  return {
    statusCode: HttpStatusCodes.OK,
    message: "Socket created successfully.",
  };
};

/**
 * Deletes a socket for the given user.
 *
 * @param {number} userId - The ID of the user.
 * @return {Promise<{
 *     statusCode: number,
 *     message: string,
 * }>} - The result of the socket deletion.
 * @throws {NotFoundError} - If the user socket does not exist.
 */
export const deleteSocket = async (
  userId: number
): Promise<{
  statusCode: number;
  message: string;
}> => {
  const userSocket = await SocketModel.fetchSocket(userId);

  if (!userSocket) {
    throw new NotFoundError("No socket found.");
  } else {
    await SocketModel.deleteSocket(userId);
  }

  return {
    statusCode: HttpStatusCodes.OK,
    message: "Socket deleted successfully.",
  };
};
