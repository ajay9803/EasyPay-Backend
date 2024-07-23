import { Knex } from 'knex';

const TABLE_NAME = 'users';

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
          username: "Admin",
          email: "admin@gmail.com",
          dob: "2000-07-31",
          gender: "Male",
          password: "Test@9803",
          balance_id: 1,
          role_id: 1,
        },
        {
          id: 2,
          username: "Test 1",
          email: "test1@gmail.com",
          dob: "2000-07-31",
          gender: "Male",
          password: "Test@9803",
          balance_id: 2,
          role_id: 2,
        },
      ]);
    });
}