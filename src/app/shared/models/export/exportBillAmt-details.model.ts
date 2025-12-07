export interface ExpOrdBillAmtDetailsData {
    brnCode: number;
    billRefNo: string;
    custNo: string;
    exOrRefNum: string;
    billCurr: string;
    billAmount: string;
    billConvRate: string;
    billAmountBase: string;
    tranBatchNo: number;
    tranDate: string;
    entdBy: string;
    entdOn: string;
}
/*
 private Integer brnCode;
    private String billRefNo;
    private String custNo;
    private String exOrRefNum;
    private String billCurr;
    private BigDecimal billAmount;
    private BigDecimal billConvRate;
    private BigDecimal billAmountBase;
    private Integer tranBatchNo;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy")
    private LocalDate tranDate;
    private String entdBy;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy hh:mm:ss a")
    private LocalDateTime entdOn;
 */