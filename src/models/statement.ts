import BaseModel from "./base";

export class StatementModel extends BaseModel {
  static fetchLoadFundTransactions = async (userId: string) => {
    const loadFundTransactions = await this.queryBuilder()
      .select()
      .from("load_fund_transactions")
      .join(
        "bank_accounts",
        "load_fund_transactions.bank_account_id",
        "bank_accounts.id"
      )
      .join("mock_banks", "bank_accounts.bank_id", "mock_banks.id")
      .where("load_fund_transactions.user_id", userId);

    return loadFundTransactions;
  };
  
  static getBalanceTransferStatements = async (
    userId: string,
    page: number,
    size: number
  ) => {
    console.log("The arguments are: ", userId, page, size);
    const rawStatements = await this.queryBuilder()
      .select()
      .from("balance_transfer_statements")
      .where("sender_user_id", userId)
      .orWhere("receiver_user_id", userId)
      .limit(size)
      .offset((page - 1) * size);

    const totalStatementsCount = await this.queryBuilder()
      .count()
      .from("balance_transfer_statements")
      .where("sender_user_id", userId)
      .orWhere("receiver_user_id", userId);

    let statements = rawStatements.map((statement) => {
      if (statement.senderUserId === userId) {
        statement.cashFlow = "Credit";
      } else {
        statement.cashFlow = "Debit";
      }
      return statement;
    });

    return { statements, totalCount: totalStatementsCount };
  };
}
