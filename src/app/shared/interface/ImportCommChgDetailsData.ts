export interface ImportCommChgDetailsData {
    lcBrnCode: number;
    lcRefNo: string;
    lcAmdSL: number;
    lcCustNum: string;
    lcStatus: string;
    lcCommGLCode: string;
    lcCommAmount: number;
    tranDate: string;
    tranBatchNo: number;
    lcEntdBy: string;
    lcEntdOn: string | null;

}


/*
private Integer lcBrnCode;
    private String lcRefNo;
    private Integer lcAmdSL;
    private String lcCustNum;
    private String lcStatus;
    private String lcCommGLCode;
    private BigDecimal lcCommAmount;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy")
    private LocalDate tranDate;
    private Integer tranBatchNo;
    private String lcEntdBy;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy hh:mm:ss a")
    private LocalDateTime lcEntdOn;
*/