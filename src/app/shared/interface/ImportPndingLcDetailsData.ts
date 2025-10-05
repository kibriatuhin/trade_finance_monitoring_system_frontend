export interface ImportPndingLcDetailsData {
    lcBrnCode: number;
    lcType: string;
    lcYear: number;
    lcSl: number;
    lcRefNo: string;
    lcCustNum: string;
    lcCurr: string;
    lcAmount: number;
    lcTotalAmount: number;
    lcTotalOsAmount: number;
    lcEntdBy: string;
    lcEntdOn: string | null;

}
export interface PendingLcPageResponse {
  lcList: ImportPndingLcDetailsData[];
  pageNo: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  isFirst: boolean;
  isLast: boolean;
}

// Generic API response wrapper
export interface ApiResponse<T> {
  data: T;
  message: string;
  status: string;
}

// private Integer lcBrnCode;
//     private String lcType;
//     private String lcYear;
//     private String lcSl;
//     private String lcRefNo;
//     private String lcCustNum;
//     private String lcCurr;
//     private BigDecimal lcAmount;
//     private BigDecimal lcTotalAmount;
//     private BigDecimal lcTotalOsAmount;
//     private String lcEntdBy;
//     @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy hh:mm:ss a")
//     private LocalDateTime lcEntdOn;