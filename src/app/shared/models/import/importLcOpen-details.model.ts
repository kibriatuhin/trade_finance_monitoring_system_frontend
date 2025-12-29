export interface ImportLcOpenDetailsModel {
    brnCode: number;
    lcRefNum: string; // new
    custNum: string;
    lcCurr: string;
    lcAmt: string;
    lcConvRate: string;
    lcBaseAmt: string;
    expiryDate: string;//new
    tranBatchNo: number; // new
    tranDate: string;//new
    authBy: string;
    authOn: string;
}

/*
 Integer brnCode;
 String lcRefNum; // new
 String custNum;
  String lcCurr;
 BigDecimal lcAmt;
 BigDecimal lcConvRate;
 BigDecimal lcBaseAmt;
 LocalDate expiryDate;//new
 Integer tranBatchNo; // new

 LocalDate tranDate;//new
  String authBy;
 LocalDateTime authOn;
*/