import { Knex } from "knex";

const TABLE_NAME = "mock_banks";

/**
 * Create table TABLE_NAME.
 *
 * @param   {Knex} knex
 * @returns {Promise}
 */
export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(TABLE_NAME, (table) => {
    table.bigIncrements();

    table.timestamp("created_at").notNullable().defaultTo(knex.raw("now()"));
    table.string("name", 100).notNullable();
    table.string("location", 100).notNullable();
    table.string("image_url", 100).notNullable();
    table.string('est_date', 100).notNullable();
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
