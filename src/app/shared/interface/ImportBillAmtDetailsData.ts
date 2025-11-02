
export interface ImportBillAmtDetailsData {
    brnCode: number;
    billType: string;
    billYear: number;
    billSl: number;
    lcRefNo: string;
    lcCustNo: string;
    billCurr: string;
    billAmt: string;
    billEntdBy: string;
    billEntdOn: string | null;

}
/*
 private Integer brnCode;
    private String billType;
    private String billYear;
    private String billSl;
    private String lcRefNo;
    private String lcCustNo;
    private String billCurr;
    private BigDecimal billAmt;
    private String billEntdBy;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy hh:mm:ss a")
    private LocalDateTime billEntdOn;
*/