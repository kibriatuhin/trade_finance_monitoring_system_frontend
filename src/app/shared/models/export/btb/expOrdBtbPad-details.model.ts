
export interface ExpOrdBtbPadDetailsData {
    lcBrnCode: number;
    exOrRefNum: string;
    lcRefNo: string;
    billRefNo: string;
    billPaySl: number;
    billPartFinal: string;
    billCustNo: string;
    billCurr: string;
    billPayAmt: string;
    billPayBaseAmt: string;
    billPadAccNo: string;
    billPadAmt: string;
    tranDate: string; // Format: "dd-MM-yyyy"
    tranBatchNo: number;
    billEntdBy: string;
    billEntdOn: string; // Format: "dd-MM-yyyy hh:mm:ss a"
}

/*
     private Integer lcBrnCode;
    private String exOrRefNum;
    private String lcRefNo;
    private String billRefNo;
    private Integer billPaySl;
    private String billPartFinal;
    private String billCustNo;
    private String billCurr;
    private BigDecimal billPayAmt;
    private BigDecimal billPayBaseAmt;
    private String billPadAccNo;
    private BigDecimal billPadAmt;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy")
    private LocalDate tranDate;
    private Integer tranBatchNo;
    private String billEntdBy;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy hh:mm:ss a")
    private LocalDateTime billEntdOn;
*/