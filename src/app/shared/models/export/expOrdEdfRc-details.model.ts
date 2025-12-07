export interface ExpOrdEdfRcDetailsData {
    brnCode: number;
    custNum: string;
    edfRcDate: string; // ISO date string
    rcDaySl: number;
    billRefNo: string;
    paySl: number;
    lcRefNo: string;
    edfRcAmtCurr: string;
    edfRcAmt: string; // Formatted amount string
    edfOsAmt: string; // Formatted amount string
    tranBatchNo: number;
    tranDate: string; // ISO date string
    entdBy: string;
    entdOn: string; // ISO date-time string
}
/*
private Integer brnCode;
    private String custNum;
    private LocalDate edfRcDate;
    private Integer rcDaySl;
    private String billRefNo;
    private Integer paySl;
    private String lcRefNo;
    private String edfRcAmtCurr;
    private BigDecimal edfRcAmt;
    private BigDecimal edfOsAmt;
    private Integer tranBatchNo;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy")
    private LocalDate tranDate;
    private String entdBy;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy hh:mm:ss a")
    private LocalDateTime entdOn;
*/