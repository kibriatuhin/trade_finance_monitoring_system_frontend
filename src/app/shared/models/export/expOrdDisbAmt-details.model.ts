
export interface ExpOrdDisbAmtDetailsData {
    brnCode: number;
    exOrRefNum: string;
    billRefNo: string;
    billPaySl: number;
    custNum: string;
    billCurr: string;
    disbAmount: string;
    tranBatchNo: number;
    tranDate: string;
    entdBy: string;
    entdOn: string;
}
/*
private Integer brnCode;
    private String exOrRefNum;
    private String billRefNo;
    private Integer billPaySl;
    private String custNum;
    private String billCurr;
    private BigDecimal disbAmount;
    private Integer tranBatchNo;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy")
    private LocalDate tranDate;
    private String entdBy;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy hh:mm:ss a")
    private LocalDateTime entdOn;

*/