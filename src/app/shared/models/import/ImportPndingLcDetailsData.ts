export interface ImportPndingLcDetailsData {
    brnCode: number;
    lcRefNum: string;
    custNum: string;
    lcCurr: string;
    lcAmount: string;
    totalLcAmount: string;
    totalOsAmount: string;
    expiryDate: string | null;
    entdBy: string;
    entdOn: string | null;

}

/*
private Integer BrnCode;
    private String lcRefNum;
    private String custNum;
    private String lcCurr;
    private BigDecimal lcAmount;
    totalLcAmount
    private BigDecimal totalOsAmount;
    private LocalDate expiryDate;
    private String entdBy;
    private LocalDateTime entdOn;
*/
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
export interface ApiResponseN<T> {
  data: T;
  message: string;
  status: string;
}
