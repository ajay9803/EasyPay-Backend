import { Knex } from "knex";

const TABLE_NAME = "users";

/**
 * Create table TABLE_NAME.
 *
 * @param   {Knex} knex
 * @returns {Promise}
 */
export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(TABLE_NAME, (table) => {
    table.bigIncrements();
    table.string("username", 100).notNullable();
    table.string("email", 100).notNullable().unique();
    table.string("dob", 100).notNullable();
    table.string("gender", 10).notNullable();
    table.string("password", 100).notNullable();
    table.bigInteger("balance").notNullable();
    table
      .bigInteger("role_id")
      .notNullable()
      .references("id")
      .inTable("roles")
      .onDelete("cascade");
    table.boolean("is_verified").defaultTo(false);
    table.bigInteger("easy_pay_points").defaultTo(0);

    table.timestamp("created_at").notNullable().defaultTo(knex.raw("now()"));

    table.timestamp("updated_at").nullable();
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
