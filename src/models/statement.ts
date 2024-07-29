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
    size: number,
    cashFlow: string,
    startDate: number,
    endDate: number
  ) => {
    console.log("The user id is: ", userId);
    const query = this.queryBuilder()
      .select()
      .from("balance_transfer_statements")
      .limit(size)
      .offset((page - 1) * size)
      .orderBy("created_at", "desc");

    const countQuery = this.queryBuilder()
      .count()
      .from("balance_transfer_statements");

    const applyFilters = (qb: any) => {
      qb.where("created_at", ">=", startDate).where(
        "created_at",
        "<=",
        endDate
      );
      if (cashFlow === "All") {
        qb.where("sender_user_id", userId).orWhere("receiver_user_id", userId);
      } else if (cashFlow === "Debit") {
        qb.where("receiver_user_id", userId);
      } else {
        qb.where("sender_user_id", userId);
      }
    };

    applyFilters(query);
    applyFilters(countQuery);

    const rawStatements = await query;
    const totalCount = await countQuery.first();

    const statements = rawStatements.map((statement: any) => {
      statement.cashFlow =
        statement.senderUserId === userId ? "Credit" : "Debit";
      return statement;
    });

    return { statements, totalCount };
  };
}
