export interface ExpOrdBTbBillDetailsData {
    brnCode: number;
    lcBillRefNo: string;
    lcRefNo: string;
    exOrRefNum: string;
    billCurr: string;
    billAmount: string;
    entdBy: string;
    entdOn:  string | null;
}

/*
private Integer brnCode;
    private String lcBillRefNo;
    private String lcRefNo;
    private String exOrRefNum;
    private String billCurr;
    private BigDecimal billAmount;
    private String entdBy;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy hh:mm:ss a")
    private LocalDateTime entdOn;
*/