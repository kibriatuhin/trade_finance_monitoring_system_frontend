
export interface ExportOpenDetailsModel {
   brnCode: number;
    exRefNum: string;
    custNum: string;
    lcCurr: string;
    lcAmount: string;
    entdBy: string;
    entdOn: string | null;
}
/*
   private Integer brnCode;
    private String exRefNum;
    private String custNum;
    private String lcCurr;
    private BigDecimal lcAmount;
    private String entdBy;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy hh:mm:ss a")
    private LocalDateTime entdOn;
*/