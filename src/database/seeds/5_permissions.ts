import { Knex } from "knex";
import { permission } from "process";

const TABLE_NAME = "permissions";

/**
 * Delete existing entries and seed values for table TABLE_NAME.
 *
 * @param   {Knex} knex
 * @returns {Promise}
 */
export function seed(knex: Knex): Promise<void> {
  return knex(TABLE_NAME)
    .del()
    .then(() => {
      return knex(TABLE_NAME).insert([
        {
          id: 1,
          permission_name: "users.create",
        },
        {
          id: 2,
          permission_name: "users.update",
        },
        {
          id: 3,
          permission_name: "users.delete",
        },
        {
          id: 4,
          permission_name: "users.fetch",
        },
        { id: 5, permission_name: "users.apply-for-kyc" },
        { id: 6, permission_name: "users.fetch-kyc-application" },
        { id: 7, permission_name: "users.load-balance" },
        { id: 8, permission_name: "users.fetch-linked-bank-accounts" },
        { id: 9, permission_name: "users.fetch-kyc-applications" },
        { id: 10, permission_name: "users.verify-kyc-application" },
        { id: 11, permission_name: "users.transfer-balance" },
        { id: 12, permission_name: "users.update-password" },
        { id: 13, permission_name: "users.set-new-password" },
        { id: 14, permission_name: "users.update-email" },
        { id: 15, permission_name: "users.send-new-password-link" },
        { id: 16, permission_name: "users.send-update-email-otp" },
        { id: 17, permission_name: "users.fetch-balance-transfer-statements" },
        { id: 18, permission_name: "users.fetch-notifications" },
      ]);
    });
}
