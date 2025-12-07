export interface ExpOrdBtbPadOsDetailsData{
    lcBrnCode: number;
    exOrRefNum: string;
    lcRefNo:  string;
    billRefNo: string;
    billPaySl: number;
    billCustNo: string;
    billCurr: string;
    billPayAmt: string;
    billPayBaseAmt: string;
    billPadAcc: string;
    billPadAmt: string;
    billPadOsAmt: string;
    tranDate: string;
    tranBatchNo: number;
    entdBy: string;
    entdOn: string;
}
/*
private Integer lcBrnCode;
    private String exOrRefNum;
    private String lcRefNo;
    private String billRefNo;
    private Integer billPaySl;
    private String billCustNo;
    private String billCurr;
    private BigDecimal billPayAmt;
    private BigDecimal billPayBaseAmt;
    private String billPadAcc;
    private BigDecimal billPadAmt;
    private BigDecimal billPadOsAmt;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy")
    private LocalDate tranDate;
    private Integer tranBatchNo;
    private String entdBy;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy hh:mm:ss a")
    private LocalDateTime entdOn;
*/