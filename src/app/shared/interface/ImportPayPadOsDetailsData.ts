export interface ImportPayPadOsDetailsData {
    lcBrnCode: number;
    billRef: string;
    billPaySl: number;
    billCustNo: string;
    billCurr: string;
    billPayAmt: string;
    billPayBaseAmt: string;
    billPadAcc: string;
    billPadAmt: string;
    billPadOsAmt:string;
    tranDate: string;
    tranBatchNo: number;
    billEntdBy: string;
    billEntdOn: string | null;

}

/*
 private Integer lcBrnCode;
    private String billRef;
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
    private String billEntdBy;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy hh:mm:ss a")
    private LocalDateTime billEntdOn;
*/