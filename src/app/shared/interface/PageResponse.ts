export interface PageResponse<T> {
  lcList: T[];          // Generic list instead of fixed ImportLcTotalAmountData
  pageNo: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  isFirst: boolean;
  isLast: boolean;
}