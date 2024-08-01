import { Knex } from "knex";

const TABLE_NAME = "user_sockets";

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
      .notNullable()
      .references("id")
      .inTable("users").onDelete('cascade');
    table.string("socket_id", 100).notNullable();

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
