import BaseModel from "./base";

class BankAccountModel extends BaseModel {
  static createBankAccounts: (userId: number) => Promise<void> = async (userId: number) => {
    let newBankAccounts = [
      {
        amount: 5000,
        bank_id: 1,
        user_id: userId,
      },
      {
        amount: 5000,
        bank_id: 2,
        user_id: userId
      },
    ];
    await this.queryBuilder().insert(newBankAccounts).table("bank_accounts");
  };
}

export default BankAccountModel;
