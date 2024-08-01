// Transfer-balance-interface - defines request body to transfer balance
export interface ITransferBalance {
  senderUserId: string;
  receiverEmail: string;
  amount: number;
  purpose: string;
  remarks: string;
}
