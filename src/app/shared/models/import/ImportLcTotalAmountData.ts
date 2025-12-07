export interface ImportLcTotalAmountData {
    lcBrnCode: number;
    lcType: string;
    lcYear: number;
    lcSl: number;
    lcRefNo: string;
    lcCustNum: string;
    lcCurr: string;
    lcOpenAmt: string;
    totalAmdEn: string;
    totalAmdRd: string;
    totalLcAmt: string;
    lcEntdBy: string;
    lcEntdOn: string | null;

}
/*
 Integer lcBrnCode;
   String lcType;
    String lcYear;
     String lcSl;
     String lcRefNo;
    private String lcCustNum;
    private String lcCurr;
    private String lcEntdBy;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy hh:mm:ss a")
    private LocalDateTime lcEntdOn;
    private BigDecimal lcOpenAmt;
    private BigDecimal totalAmdEn;
    private BigDecimal totalAmdRd;
    private BigDecimal totalLcAmt; */