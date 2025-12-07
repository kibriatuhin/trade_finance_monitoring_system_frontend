export interface ExpOrdBtbVolDetailsData{
    brnCode: number;
    btbRefNo: string;
    exOrRefNum: string;
    lcCustNum: string;
    lcCurrCode: string;
    lcAmount: string;
    lcEnAmt: string;
    lcRdAmt: string;
    lcTotalAmount: string;
    tranBatchNo: number;
    tranDate:  string | null;
    entdBy: string;
    entdOn: string | null;
}
/*
private Integer brnCode;
    private String btbRefNo;
    private String exOrRefNum;
    private String lcCustNum;
    private String lcCurrCode;
    private BigDecimal lcAmount;
    private BigDecimal lcEnAmt;
    private BigDecimal lcRdAmt;
    private BigDecimal lcTotalAmount;
    private Integer tranBatchNo;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy")
    private LocalDate tranDate;
    private String entdBy;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy hh:mm:ss a")
    private LocalDateTime entdOn;
*/