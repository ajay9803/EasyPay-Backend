import BaseModel from "./base";

class BankAccountModel extends BaseModel {
  static createBankAccounts: (userId: number) => Promise<void> = async (
    userId: number
  ) => {
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
    await this.queryBuilder().insert(newBankAccounts).table("bank_accounts");
  };

  static getBankAccounts = async (userId: string) => {
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
