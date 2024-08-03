import { BadRequestError } from "../error/bad_request_error";
import { NotFoundError } from "../error/not_found_error";
import { UnauthorizedError } from "../error/unauthorized_error";
import { User } from "../interfaces/user";
import { adminCheck } from "../utils/admin_check";
import BaseModel from "./base";

export class UserModel extends BaseModel {
  /**
   * Creates a new user in the database.
   *
   * @param {Omit<User, "id" | "permissions" | "isVerified">} user - The user object containing the user's information.
   * @return {Promise<number>} The ID of the newly created user.
   * @throws {BadRequestError} If the user already exists.
   */
  static createUser = async (
    user: Omit<User, "id" | "permissions" | "isVerified">
  ): Promise<number> => {
    const userToCreate = {
      username: user.username,
      email: user.email,
      password: user.password,
      dob: user.dob,
      gender: user.gender,
      role_id: 2,
      balance: 0,
    };

    const createdUser = await this.queryBuilder()
      .insert(userToCreate)
      .table("users")
      .returning("id");
    return createdUser[0].id;
  };

  /**
   * Fetches users from the database.
   *
   * @param {number} page - The page number of the results.
   * @param {number} size - The number of results per page.
   * @return {Promise<{users: User[], totalCount: {count: string}}>} An object containing the fetched users and the total count of users.
   * @throws {NotFoundError} If no users are found.
   */
  static fetchUsers = async (
    page: number,
    size: number
  ): Promise<{ users: User[]; totalCount: { count: string } }> => {
    const totalCount = await this.queryBuilder()
      .count()
      .select()
      .from("users")
      .first();
    const users = await this.queryBuilder()
      .select(
        "id",
        "username",
        "email",
        "dob",
        "gender",
        "balance",
        "role_id",
        "is_verified",
        "created_at",
        "updated_at",
        "easy_pay_points"
      )
      .from("users")
      .limit(size)
      .offset((page - 1) * size)
      .orderBy("created_at", "desc");

    return { totalCount, users };
  };

  /**
   * Fetches a user from the database based on the provided email.
   *
   * @param {string} email - The email of the user to fetch.
   * @return {Promise<User | null>} The user object if found, null otherwise.
   */
  static getUserByEmail = async (email: string): Promise<any> => {
    const user = await this.queryBuilder()
      .select()
      .from("users")
      .where("email", email)
      .first();

    if (user) {
      const permissions = await this.queryBuilder()
        .join(
          "permissions",
          "permissions.id",
          "roles_and_permissions.permission_id"
        )
        .table("roles_and_permissions")
        .select("permissions.permission_name")
        .where("role_id", user.roleId);

      let userPermissions: string[] = permissions.map((permission) => {
        return permission.permissionName;
      });

      return { ...user, permissions: userPermissions };
    }

    return user;
  };

  /**
   * Fetches a user from the database based on the provided ID.
   *
   * @param {string} id - The ID of the user to fetch.
   * @return {Promise<any>} The user object if found, null otherwise.
   */
  static getUserById = async (id: string): Promise<any> => {
    const user = await this.queryBuilder()
      .select(
        "id",
        "username",
        "email",
        "dob",
        "gender",
        "balance",
        "role_id",
        "is_verified",
        "created_at",
        "updated_at",
        "easy_pay_points",
        "password"
      )
      .from("users")
      .where("id", id)
      .first();

    return user;
  };

  /**
   * Updates a user in the database based on the provided ID.
   *
   * @param {string} id - The ID of the user to update.
   * @param {Omit<User, "id" | "permissions" | "isVerified">} theUser - The user object with the updated data.
   * @return {Promise<User | null>} The updated user object if successful, null otherwise.
   */
  static updateUserById = async (
    id: string,

    // Omit id and permissions - use necessary data
    theUser: Omit<User, "id" | "permissions" | "isVerified">
  ): Promise<User | null> => {
    let updatedAt = new Date();

    const user = await this.queryBuilder()
      .select()
      .from("users")
      .where("id", id)
      .first();

    if (user) {
      await this.queryBuilder()
        .update({ ...theUser, updated_at: updatedAt })
        .from("users")
        .where("id", id);
      return { ...user, ...theUser, updated_at: updatedAt };
    }

    return user;
  };

  /**
   * Deletes a user from the database based on the provided ID.
   *
   * @param {string} id - The ID of the user to delete.
   * @return {Promise<void>} A promise that resolves when the deletion is complete.
   */
  static deleteUserById = async (id: string): Promise<void> => {
    await this.queryBuilder().delete().from("users").where("id", id);
  };

  /**
   * Updates the password of a user in the database.
   *
   * @param {string} id - The ID of the user whose password is being updated.
   * @param {string} newPassword - The new password for the user.
   * @return {Promise<void>} A Promise that resolves when the password update is complete.
   */
  static updatePassword = async (
    id: string,
    newPassword: string
  ): Promise<void> => {
    let updatedAt = new Date();

    await this.queryBuilder()
      .update({ password: newPassword, updatedAt: updatedAt })
      .from("users")
      .where("id", id);
  };

  // update email
  /**
   * Updates the email of a user in the database.
   *
   * @param {string} id - The ID of the user whose email is being updated.
   * @param {string} email - The new email for the user.
   * @return {Promise<void>} A Promise that resolves when the email update is complete.
   */
  static updateEmail = async (id: string, email: string): Promise<void> => {
    let updatedAt = new Date();

    await this.queryBuilder()
      .update({ email: email, updatedAt: updatedAt })
      .from("users")
      .where("id", id);
  };

  /**
   * Updates the password of a user in the database.
   *
   * @param {string} id - The ID of the user whose password is being updated.
   * @param {string} newPassword - The new password for the user.
   * @return {Promise<void>} A Promise that resolves when the password update is complete.
   */
  static setNewPassword = async (
    id: string,
    newPassword: string
  ): Promise<void> => {
    let updatedAt = new Date();

    await this.queryBuilder()
      .update({ password: newPassword, updatedAt: updatedAt })
      .from("users")
      .where("id", id);
  };

  /**
   * Updates the balance of a user in the database.
   *
   * @param {string} id - The ID of the user whose balance is being updated.
   * @param {number} newBalance - The new balance for the user.
   * @return {Promise<void>} A Promise that resolves when the balance update is complete.
   */
  static updateBalance = async (
    id: string,
    newBalance: number
  ): Promise<void> => {
    let updatedAt = new Date();

    await this.queryBuilder()
      .update({ balance: newBalance, updatedAt: updatedAt })
      .from("users")
      .where("id", id);
  };
}

export default UserModel;
