export interface ImportLcVatDetailsData {
    brnCode: number;
    refNum: string;
    opSl: number;
    custNum: string;
    lcCategory: string;
    vatGl1: string;
    lcVatAmt1: string;
    vatGl2: string;
    lcVatAmt2: string;
    tranBatchNo: string;
    tranDate: string | null;
    entdBy: string;
    entdOn: string | null;
}

/*
  brnCode;
  refNum;
 opSl;
 custNum;
 lcCategory;
 vatGl1;
 lcVatAmt1;
 vatGl2;
 lcVatAmt2;
 tranBatchNo;
 tranDate;
  entdBy;
 entdOn;
*/