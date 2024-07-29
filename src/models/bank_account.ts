import BaseModel from "./base";

class BankAccountModel extends BaseModel {
  /**
   * Creates bank accounts for a user.
   * @param {number} userId - The ID of the user.
   * @returns {Promise<void>}
   */
  static createBankAccounts: (userId: number) => Promise<void> = async (
    userId: number
  ): Promise<void> => {
    // Define new bank accounts with initial amounts and bank IDs
    let newBankAccounts = [
      {
        amount: 5000,
        bank_id: 1,
        user_id: userId,
      },
      {
        amount: 5000,
        bank_id: 2,
        user_id: userId,
      },
    ];

    // Insert new bank accounts into the "bank_accounts" table
    await this.queryBuilder().insert(newBankAccounts).table("bank_accounts");
  };

  /**
   * Retrieves all bank accounts for a user along with associated bank details.
   * @param {string} userId - The ID of the user.
   * @returns {Promise<Array<Object>>} A promise that resolves to an array of bank account objects.
   */
  static getBankAccounts = async (userId: string): Promise<Array<object>> => {
    // Query the database to get bank accounts and associated bank details for the user
    return await this.queryBuilder()
      .select(
        "bank_accounts.*",
        "mock_banks.name",
        "mock_banks.location",
        "mock_banks.image_url",
        "mock_banks.est_date"
      )
      .from("bank_accounts")
      .join("mock_banks", "bank_accounts.bank_id", "mock_banks.id")
      .where("bank_accounts.user_id", userId);
  };
}

export default BankAccountModel;
