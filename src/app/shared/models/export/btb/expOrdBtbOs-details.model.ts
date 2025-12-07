export interface ExpOrdBtbOsDetailsData {
    brnCode: number;
    btbRefNum: string;
    exOrRefNum: string;
    custNum: string;
    lcCurr: string;
    lcAmount: string;
    lcAmdEn: string;
    lcAmdRd: string;
    lcMnRv: string;
    lcCan: string;
    lcAccBill: string;
    lcPay: string;
    totalOsAmount: string;
    entdBy: string;
    entdOn: string | null;
}

/*
 private Integer brnCode;
    private String btbRefNum;
    private String exOrRefNum;
    private String custNum;
    private String lcCurr;
    private BigDecimal lcAmount;
    private BigDecimal lcAmdEn;
    private BigDecimal lcAmdRd;
    private BigDecimal lcMnRv;
    private BigDecimal lcCan;
    private BigDecimal lcAccBill;
    private BigDecimal lcPay;
    private BigDecimal totalOsAmount;
    private String entdBy;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy hh:mm:ss a")
    private LocalDateTime entdOn;
*/