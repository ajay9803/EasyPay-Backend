import BaseModel from "./base";

export class SocketModel extends BaseModel {
  /**
   * Fetches a user socket from the database.
   *
   * @param {number} userId - The ID of the user.
   * @return {Promise<object | null>} A promise that resolves to the user
   * socket object if found, or null if not found.
   */
  static fetchSocket = async (userId: number) => {
    const userSocket = await this.queryBuilder()
      .select()
      .from("user_sockets")
      .where("user_id", userId)
      .first();

    return userSocket;
  };

  /**
   * Creates a socket for a user in the database.
   *
   * @param {string} socketId - The ID of the socket.
   * @param {number} userId - The ID of the user.
   * @return {Promise<void>} A promise that resolves when the socket is
   * successfully created.
   */
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

  /**
   * Updates a user socket in the database.
   *
   * @param {string} socketId - The ID of the socket.
   * @param {number} userId - The ID of the user.
   * @return {Promise<void>} A promise that resolves when the socket is
   * successfully updated.
   */
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

  /**
   * Deletes a user socket from the database.
   *
   * @param {number} userId - The ID of the user.
   * @return {Promise<void>} A promise that resolves when the socket is
   * successfully deleted.
   */
  static deleteSocket = async (userId: number): Promise<void> => {
    await this.queryBuilder()
      .delete()
      .table("user_sockets")
      .where("user_id", userId);
  };
}
