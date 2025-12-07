
export interface ExpOrdPcAmtDetailsData {
    brnCode: number;
    pcRefNmber: string;
    custNum: string;
    exOrRefNum: string;
    lnAccNumber: string;
    pcCurrency: string;
    pcAmount: string;
    pcRate: string;
    pcBaseAmount: string;
    tranBatchNo: number;
    tranDate: string;
    entdBy: string;
    entdOn: string;
}
/*
private Integer brnCode;
    private String pcRefNmber;
    private String custNum;
    private String exOrRefNum;
    private String lnAccNumber;
    private String pcCurrency;
    private BigDecimal pcAmount;
    private BigDecimal pcRate;
    private BigDecimal pcBaseAmount;
    private Integer tranBatchNo;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy")
    private LocalDate tranDate;
    private String entdBy;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy hh:mm:ss a")
    private LocalDateTime entdOn;
*/