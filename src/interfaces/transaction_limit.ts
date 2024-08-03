// Transaction Limit interface - defines trasaction limit model in database
export interface ITransactionLimit {
  id: string;
  userId: string;
  date: string;
  limit: string;
  createdAt: string;
}
