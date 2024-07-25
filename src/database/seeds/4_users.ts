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
          password:
            "$2b$10$o5MRWBziSxr69KFmDaylReXUDhRQ7B9tLYa.M.iWSTxDoZ99zdJxq",
          balance: 0,
          role_id: 1,
        },
        {
          id: 2,
          username: "Test 1",
          email: "test1@gmail.com",
          dob: "2000-07-31",
          gender: "Male",
          password:
            "$2b$10$o5MRWBziSxr69KFmDaylReXUDhRQ7B9tLYa.M.iWSTxDoZ99zdJxq",
          balance: 0,
          role_id: 2,
        },
      ]);
    });
}