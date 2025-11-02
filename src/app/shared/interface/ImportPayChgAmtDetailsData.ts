export interface ImportPayChgAmtDetailsData {
    brnCode: number;
    billRefNo: string;
    paySl: number;
    billCurr: string;
    customerNo: string;
    chrgGlCode1: string;
    chrgAmt1: string;
    chrgGlCode2: string;
    chrgeAmt2: string;
    chrgGlCode3: string;
    chrgAmt3: string;
    totalCharges: string;
    tranDate: string;
    tranBatchNo: number;
    entdBy: string;
    entdOn: string | null;

}

/*
       brnCode,
        billRefNo,
        paySl,
        billCurr,
        customerNo,
        chrgGlCode1,
        chrgAmt1,
       chrgGlCode2,
        chrgeAmt2,
        chrgGlCode3,
        chrgAmt3,
        totalCharges,
        tranBatchNo,
        tranDate,
        entdBy,
        entdOn
 */