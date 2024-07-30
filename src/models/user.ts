import { BadRequestError } from "../error/bad_request_error";
import { NotFoundError } from "../error/not_found_error";
import { UnauthorizedError } from "../error/unauthorized_error";
import { User } from "../interfaces/user";
import { adminCheck } from "../utils/admin_check";
import BaseModel from "./base";

export class UserModel extends BaseModel {
  // create user
  static createUser = async (user: Omit<User, "id" | "permissions">) => {
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

  // fetch user by email
  static getUserByEmail = async (email: string) => {
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

  // fetch user by id
  static getUserById = async (id: string) => {
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
        "password"
      )
      .from("users")
      .where("id", id)
      .first();

    return user;
  };

  // update user by id
  static updateUserById = async (
    id: string,

    // omit id and permissions - use necessary data
    theUser: Omit<User, "id" | "permissions">
  ) => {
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

  // delete user by id
  static deleteUserById = async (id: string) => {
    // forbid admin from deleting itself
    if (adminCheck(id)) {
      throw new UnauthorizedError("Task forbidden.");
    }
    const existingUser = await this.queryBuilder()
      .select()
      .from("users")
      .where("id", id)
      .first();

    if (existingUser) {
      await this.queryBuilder().delete().from("users").where("id", id);
    }
  };

  // update password
  static updatePassword = async (id: string, newPassword: string) => {
    let updatedAt = new Date();

    await this.queryBuilder()
      .update({ password: newPassword, updatedAt: updatedAt })
      .from("users")
      .where("id", id);
  };

  // update email
  static updateEmail = async (id: string, email: string) => {
    let updatedAt = new Date();

    await this.queryBuilder()
      .update({ email: email, updatedAt: updatedAt })
      .from("users")
      .where("id", id);
  };

  // set new password
  static setNewPassword = async (id: string, newPassword: string) => {
    let updatedAt = new Date();

    await this.queryBuilder()
      .update({ password: newPassword, updatedAt: updatedAt })
      .from("users")
      .where("id", id);
  };
}

export default UserModel;
