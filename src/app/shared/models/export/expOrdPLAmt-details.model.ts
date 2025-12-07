
export interface ExpOrdPlLoanDetailsData {
    brnCode: number;
    exOrRefNum: string;
    billRefNo: string;
    custNum: string;
    plDisbSl: number;
    billCurr: string;
    loanAmount: string;
    loanBaseCurr: string;
    lnAccNumber: string;
    loanOsAmt: string;
    tranBatchNo: number;
    tranDate: string;
    entdBy: string;
    entdOn: string;
}
/*
private Integer brnCode;
    private String exOrRefNum;
    private String billRefNo;
    private String custNum;
    private Integer plDisbSl;
    private String billCurr;
    private BigDecimal loanAmount;
    private BigDecimal loanBaseCurr;
    private BigDecimal lnAccNumber;
    private BigDecimal loanOsAmt;
    private Integer tranBatchNo;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy")
    private LocalDate tranDate;
    private String entdBy;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy hh:mm:ss a")
    private LocalDateTime entdOn;
*/