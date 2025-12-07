export interface ExportVolumeDetailsData {
    brnCode: number;
    lcRefNo: string;
    lcOpSerial: number;
    lcCustNum: string;
    lcCurr: string;
    lcAmount: string;
    lcFobAmount: string;
    lcExpiryDate: string | null;
    lcShipDate: string | null;
    btbAllowAmt: string;
    pcAllowAmt: string;
    entdBy: string;
    entdOn: string | null;
}
/*
private Integer brnCode;
    private String lcRefNo;
    private Integer lcOpSerial;
    private String lcCustNum;
    private String lcCurr;
    private BigDecimal lcAmount;
    private BigDecimal lcFobAmount;
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