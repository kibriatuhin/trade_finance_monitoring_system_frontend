
export interface ImportLcOsAmtDetailsData {
    lcBrnCode: number;
    lcRefNo: string;
    lcCustNum: string;
    lcCurr: string;
    lcAmount: string;
    lcAmdEn: string;
    lcAmdRd: string;
    lcMnRev: string;
    lcAccBill: string;
    lcPay: string;
    lcTotalOsAmount: string;
    lcEntdBy: string;
    lcEntOn: string | null;
}

/*
private Integer lcBrnCode;
    private String lcRefNo;
    private String lcCustNum;
    private String lcCurr;
    private BigDecimal lcAmount;
    private BigDecimal lcAmdEn;
    private BigDecimal lcAmdRd;
    private BigDecimal lcMnRev;
    private BigDecimal lcAccBill;
    private BigDecimal lcPay;
    private BigDecimal lcTotalOsAmount;
    private String lcEntdBy;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy hh:mm:ss a")
    private LocalDateTime lcEntOn;
*/