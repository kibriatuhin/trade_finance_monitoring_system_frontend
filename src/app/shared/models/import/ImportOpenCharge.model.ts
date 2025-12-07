
export interface ImportOpenCharge{
    brnCode: number;
    lcRefNo: string;
    lcOpSl: number;
    custNum: string;
    lcCategory: string;
    commGlAcc: string;
    commChgAmt: string;
    swfGlAcc: string;
    swfChgAmt: string;
    tranBatchNo: string;
    tranDate: string;
    entdBy: string;
    entdOn: string | null;
}


/*
 brnCode,
 lcRefNo,
 lcOpSl,
 custNum,
 lcCategory,
 commGlAcc,
 commChgAmt,
 swfGlAcc,
 swfChgAmt,
 tranBatchNo,
 tranDate,
 entdBy,
 entdOn
*/