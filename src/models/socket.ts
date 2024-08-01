import BaseModel from "./base";

export class SocketModel extends BaseModel {
  static fetchSocket = async (userId: number) => {
    const userSocket = await this.queryBuilder()
      .select()
      .from("user_sockets")
      .where("user_id", userId)
      .first();

    return userSocket;
  };

  static createSocket = async (
    socketId: string,
    userId: number
  ): Promise<void> => {
    await this.queryBuilder()
      .insert({
        socketId: socketId,
        userId: userId,
      })
      .table("user_sockets");
  };

  static updateSocket = async (
    socketId: string,
    userId: number
  ): Promise<void> => {
    await this.queryBuilder()
      .update({
        socketId: socketId,
      })
      .table("user_sockets")
      .where("user_id", userId);
  };

  static deleteSocket = async (userId: number): Promise<void> => {
    await this.queryBuilder()
      .delete()
      .table("user_sockets")
      .where("user_id", userId);
  };
}
