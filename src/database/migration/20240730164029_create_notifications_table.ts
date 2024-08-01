import { Knex } from "knex";

const TABLE_NAME = "notifications";

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
      .bigInteger("user_id")
      .references("id")
      .inTable("users")
      .notNullable()
      .onDelete("cascade");
    table.string("message", 100).notNullable();
    table.string("type", 50).notNullable();
    table.bigInteger("data_id").notNullable();

    table.timestamp("created_at").notNullable().defaultTo(knex.raw("now()"));
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