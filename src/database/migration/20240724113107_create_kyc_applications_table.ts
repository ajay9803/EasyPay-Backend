import { Knex } from "knex";

const TABLE_NAME = "kyc_applications";

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
      .inTable("users")
      .onDelete("cascade");
    table.string("citizenship_number", 100).notNullable();
    table.string("citizenship_issue_date", 100).notNullable();
    table.string("citizenship_photo_url", 500).notNullable();
    table.string("user_photo_url", 500).notNullable();

    table.timestamp("created_at").notNullable().defaultTo(knex.raw("now()"));
    table.boolean('is_verified').notNullable().defaultTo(false);

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
