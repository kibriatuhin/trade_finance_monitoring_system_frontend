
export interface ImportBillAmtDetailsData {
    brnCode: number;
    billRefNum: string;
    lcRefNo: string;
    lcCustNo: string;
    billCurr: string;
    billAmt: string;
    expiryDate: string | null;
    billEntdBy: string;
    billEntdOn: string | null;

}
/*
 private Integer brnCode;
    private String billRefNum;
    private String lcRefNo;
    private String lcCustNo;
    private String billCurr;
    private BigDecimal billAmt;
    private LocalDate expiryDate;
    private String billEntdBy;
    private LocalDateTime billEntdOn;
*/