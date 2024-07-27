import { Knex } from "knex";

const TABLE_NAME = "balance_transfer_statements";

/**
 * Create table TABLE_NAME.
 *
 * @param   {Knex} knex
 * @returns {Promise}
 */
export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(TABLE_NAME, (table) => {
    table.bigIncrements();
    table
      .bigInteger("sender_user_id")
      .notNullable()
      .references("id")
      .inTable("users");
    table
      .bigInteger("receiver_user_id")
      .notNullable()
      .references("id")
      .inTable("users");
    table.bigInteger("amount").notNullable();
    table.string("remarks", 50).notNullable();
    table.string("purpose", 50).notNullable();
    table.string("sender_username", 100).notNullable();
    table.string("receiver_username", 100).notNullable();

    table.timestamp("created_at").notNullable().defaultTo(knex.raw("now()"));

    table
      .bigInteger("created_by")
      .unsigned()
      .nullable()
      .references("id")
      .inTable("users");

    table.timestamp("updated_at").nullable();

    table
      .bigInteger("updated_by")
      .unsigned()
      .references("id")
      .inTable(TABLE_NAME)
      .nullable();
  });
}

/**
 * Drop table TABLE_NAME.
 *
 * @param   {Knex} knex
 * @returns {Promise}
 */
export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(TABLE_NAME);
}
