// ✅ src/app/shared/model/TranHistory.ts

export interface TranHistory {
  rn: number;
  brnCode: number;
  postTranBatchNum: number;
  custNum: number;
  importType: string;
  lcCurrCode: string;
  lcAmount: number;
  authBy: string;
  authOn: string;
  rejBy: string | null;
  rejOn: string | null;
  entdOn: string;
}
