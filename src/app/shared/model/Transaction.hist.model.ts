export interface TransactionHistory {
  rn: number;
  brnCode: number;
  referenceNo: string;
  custNum: number;
  tranBatchNo: number;
  tranDate: string;
  lcCategory: string;
  currCode: string;
  totalAmount: number;
  authBy: string | null;
  authOn: string | null;
  rejBy: string | null;
  rejOn: string | null;
  entdBy:string | null;
  entdOn: string | null;
}