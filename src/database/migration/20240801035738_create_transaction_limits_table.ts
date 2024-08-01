import { Knex } from "knex";

const TABLE_NAME = "transaction_limits";

/**
 * Create table TABLE_NAME.
 *
 * @param   {Knex} knex
 * @returns {Promise}
 */
export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(TABLE_NAME, (table) => {
    table.bigIncrements();
    table.bigInteger("user_id").references("id").inTable("users");
    table.string("date", 10).notNullable();
    table.bigInteger("limit").notNullable();

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
