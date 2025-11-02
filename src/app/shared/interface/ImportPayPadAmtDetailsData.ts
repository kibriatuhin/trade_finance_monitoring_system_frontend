export interface ImportPayPadAmtDetailsData {
    lcBrnCode: number;
    billRefNo: string;
    billPaySl: number;
    billPartFinal: string;
    billCustNo: string;
    billCurr: string;
    billPayAmt: string;
    billPaybaseAmt: string;
    billPadAccNo: string;
    billPadAmt: string;
    tranDate: string;
    tranBatchNo: number;
    billEntdBy: string;
    billEntdOn: string | null;

}

/*
    private Integer lcBrnCode;
    private String billRefNo;
    private Integer billPaySl;
    private String billPartFinal;
    private String billCustNo;
    private String billCurr;
    private BigDecimal billPayAmt;
    private BigDecimal billPayBaseAmt;
    private String  billPadAccNo;
    private BigDecimal billPadAmt;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy")
    private LocalDate tranDate;
    private Integer tranBatchNo;
    private String  billEntdBy;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy hh:mm:ss a")
    private LocalDateTime billEntdOn ;
*/