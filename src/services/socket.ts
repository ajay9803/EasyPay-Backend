import { NotFoundError } from "../error/not_found_error";
import { SocketModel } from "../models/socket";
import HttpStatusCodes from "http-status-codes";

export const createSocket = async (socketId: string, userId: number) => {

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

export const deleteSocket = async (userId: number) => {
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
