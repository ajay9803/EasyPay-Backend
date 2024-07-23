import { Knex } from "knex";

const TABLE_NAME = "mock_banks";

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
          name: "Muktinath Bikas Bank",
          location: "Kamalpokhari, Kathmandu, Nepal",
          image_url:
            "https://remit2nepal.com.np/wp-content/uploads/2021/09/Mbb.jpeg",
          est_date: 2019,
        },
        {
          id: 2,
          name: "Nabil Bank",
          location: "Putalisadak, Kathmandu, Nepal",
          image_url:
            "https://web.nepalnews.com/storage/story/1024/Nabil_Bank1623302604_1024.jpg",
          est_date: 2019,
        },
      ]);
    });
}
