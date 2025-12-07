export interface OrderVolumeDetailsData {
    brnCode: number;
    ordRefNum: string;
    opSerialNo: number;
    custNum: string;
    lcCurr: string;
    lcAmount: string;
    lcFobAmt: string;
    lcExpiryDate: string | null;
    lcShipDate: string | null;
    btbAllowAmt: string;
    pcAllowAmt: string;
    entdBy: string;
    entdOn: string | null;
}
/*
   private Integer brnCode;
    private String ordRefNum;
    private Integer opSerialNo;
    private String custNum;
    private String lcCurr;
    private BigDecimal lcAmount;
    private BigDecimal lcFobAmt;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy")
    private LocalDate lcExpiryDate;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy")
    private LocalDate lcShipDate;
    private BigDecimal btbAllowAmt;
    private BigDecimal pcAllowAmt;
    private String entdBy;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy hh:mm:ss a")
    private LocalDateTime entdOn;
*/