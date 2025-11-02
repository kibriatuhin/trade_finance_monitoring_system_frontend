export interface ImportBillAccAmtDetailsData {
    brnCode: number;
    billRefNo: string;
    customerNo: string;
    billCurr: String;
    billAmt: string;
    billChgCurr: string;
    accChgAmt: string;
    glCode: String;
    tranDate: String;
    tranBatchNo: number;
    entdBy: string;
    entdOn: string | null;

}

/*
private Integer brnCode;
    private String billRefNo;
    private String customerNo;
    private String billCurr;
    private BigDecimal billAmt;
    private String billChgCurr;
    private BigDecimal accChgAmt;
    private String glCode;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy")
    private LocalDate tranDate;
    private Integer tranBatchNo;
    private String entdBy;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy hh:mm:ss a")
    private LocalDateTime entdOn;
*/