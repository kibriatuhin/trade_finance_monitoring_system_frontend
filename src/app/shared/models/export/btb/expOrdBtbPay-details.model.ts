export interface ExpOrdBtbPayDetailsData {
    brnCode: number;
    billRefNo: string;
    paySerial: number;
    lcRefNo: string;
    exOrRefNum: string;
    custNum: string;
    billCurr: string;
    billPayAmt: string;
    tranBatchNo: number;
    tranDate: string | null;
    entdBy: string;
    entdOn: string | null;
}



/*
private Integer brnCode;
    private String billRefNo;
    private Integer paySerial;
    private String lcRefNo;
    private String exOrRefNum;
    private String custNum;
    private String billCurr;
    private BigDecimal billPayAmt;
    private Integer tranBatchNo;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy")
    private LocalDate tranDate;
    private String entdBy;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy hh:mm:ss a")
    private LocalDateTime entdOn;
*/