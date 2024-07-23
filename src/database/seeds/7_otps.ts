import { Knex } from 'knex';

const TABLE_NAME = 'otps';

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
          email: 'sagarprajapati9803@gmail.com',
          otp: '111111',
        }
      ]);
    });
}