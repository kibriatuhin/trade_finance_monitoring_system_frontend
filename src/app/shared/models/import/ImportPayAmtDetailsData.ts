export interface ImportPayAmtDetailsData {
    lcBrnCode: number;
    lcRefNum: string;
    billRefNo: string;
    billPaySl: number;
    billCustNo: string;
    billPartOrFinal: string;
    billCurr: string;
    billPayAmt: string;
    tranDate: string;
    tranBatchNo: number;
    billEntdBy: string;
    billEntdOn: string | null;

}
/*
private Integer lcBrnCode;
lcRefNum
    private String billRefNo;
    private Integer billPaySl;
    private String billCustNo;
    private String billPartOrFinal;
    private String billCurr;
    private BigDecimal billPayAmt;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy")
    private LocalDate tranDate;
    private Integer tranBatchNo;
    private String billEntdBy;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy hh:mm:ss a")
    private LocalDateTime billEntdOn;

*/