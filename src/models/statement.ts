import BaseModel from "./base";

export class StatementModel extends BaseModel {
  /**
   * Fetches load fund transactions for a user.
   *
   * @param {string} userId - The ID of the user.
   * @return {Promise<Array<Object>>} - A promise that resolves to an array of load fund transaction objects.
   */
  static fetchLoadFundTransactions = async (
    userId: string
  ): Promise<Array<object>> => {
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

  /**
   * Fetches a load fund transaction by its ID for a user.
   *
   * @param {string} transactionId - The ID of the load fund transaction.
   * @param {string} userId - The ID of the user.
   * @return {Promise<Object>} - A promise that resolves to the load fund transaction object.
   */
  static fetchLoadFundTransaction = async (
    transactionId: string,
    userId: string
  ): Promise<object> => {
    const loadFundTransaction = await this.queryBuilder()
      .select(
        "load_fund_transactions.*",
        "mock_banks.name",
        "mock_banks.location",
        "mock_banks.image_url"
      )
      .from("load_fund_transactions")
      .join(
        "bank_accounts",
        "load_fund_transactions.bank_account_id",
        "bank_accounts.id"
      )
      .join("mock_banks", "bank_accounts.bank_id", "mock_banks.id")
      .where("load_fund_transactions.id", transactionId)
      .where("load_fund_transactions.user_id", userId)
      .first();

    return loadFundTransaction;
  };

  /**
   * Fetches balance transfer statements for a user.
   *
   * @param {string} userId - The ID of the user.
   * @param {number} page - The page number of the results.
   * @param {number} size - The number of results per page.
   * @param {string} cashFlow - The cash flow filter (Debit, Credit or All).
   * @param {number} startDate - The start date of the statement period.
   * @param {number} endDate - The end date of the statement period.
   * @return {Promise<any>} - A promise that resolves to the balance transfer statements object.
   */
  static getBalanceTransferStatements = async (
    userId: string,
    page: number,
    size: number,
    cashFlow: string,
    startDate: number,
    endDate: number
  ): Promise<any> => {
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
      qb.where("created_at", ">=", startDate).andWhere(
        "created_at",
        "<=",
        endDate
      );

      if (cashFlow === "All") {
        qb.andWhere((qb: any) => {
          qb.where("sender_user_id", userId).orWhere(
            "receiver_user_id",
            userId
          );
        });
      } else if (cashFlow === "Debit") {
        qb.andWhere("receiver_user_id", userId);
      } else {
        qb.andWhere("sender_user_id", userId);
      }
    };

    applyFilters(query);
    applyFilters(countQuery);

    console.log(query.toSQL().toNative());
    console.log(countQuery.toSQL().toNative());

    const rawStatements = await query;
    const totalCount = await countQuery.first();
    console.log(totalCount);

    const statements = rawStatements.map((statement: any) => {
      statement.cashFlow =
        statement.senderUserId === userId ? "Credit" : "Debit";
      return statement;
    });

    console.log(statements);

    return { statements, totalCount };
  };
}
