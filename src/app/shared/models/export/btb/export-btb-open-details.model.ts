export interface ExOrdBtbOpenDetailsModel {
    brnCode: number;
    lcRefNum: string;
    custNum: string;
    lcCurr: string;
    lcAmt: string;
    entdBy: string;
    entdOn: string | null;
}


/*
private Integer brnCode;
    private String lcRefNum;
    private String custNum;
    private String lcCurr;
    private BigDecimal lcAmt;
    private String entdBy;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy hh:mm:ss a")
    private LocalDateTime entdOn;
*/