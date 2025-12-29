import { ChangeDetectorRef, Component } from '@angular/core';
import { MatCard, MatCardModule } from '@angular/material/card';
import { DashboardDataService } from '../../services/dashboard/dashboard-data.service';
import { BranchSummaryData } from '../../shared/interface/BranchSummaryData';
import { BranchStatusListData } from '../../shared/interface/BranchStatusListData';
import { Output, EventEmitter } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DashboardCardComponent } from '../../component/dashboard-card/dashboard-card.component';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatIcon } from "@angular/material/icon";
import { DynamicTableDialogComponent } from "../../component/dynamic-table-dialog/dynamic-table-dialog.component";
import { AdBranchDetailsData } from '../../shared/models/branch/AdBranchDetailsData.model';
import { PageResponse } from '../../shared/interface/PageResponse';
import { BranchSignInOutDetailsData } from '../../shared/models/branch/BranchSignInOutDetailsData.model';
import { EChartsOption } from 'echarts';
import { NgxEchartsDirective } from "ngx-echarts";


@Component({
    selector: 'app-branch-dashboard',
    standalone: true,
    imports: [MatCardModule,
        DashboardCardComponent,
        MatCard,
        FormsModule, CommonModule, ReactiveFormsModule,
        MatFormFieldModule, MatIcon, DynamicTableDialogComponent, NgxEchartsDirective],
    templateUrl: './branch-dashboard.component.html',
    styleUrl: './branch-dashboard.component.css',
    animations: [
        trigger('slideIn', [
            state('cards', style({
                transform: 'translateX(0)',
                opacity: 1
            })),
            state('details', style({
                transform: 'translateX(0)',
                opacity: 1
            })),

            transition('cards => details', [
                style({ transform: 'translateX(100%)', opacity: 0 }),
                animate(
                    '400ms cubic-bezier(0.25, 0, 0, 0)',
                    style({ transform: 'translateX(0)', opacity: 1 })
                )
            ]),

            transition('details => cards', [
                animate(
                    '400ms cubic-bezier(0.25, 0.8, 0.25, 1)',
                    style({ transform: 'translateX(-100%)', opacity: 0 })
                )
            ]),
        ])
    ]

})
export class BranchDashboardComponent {
    viewMode: "cards" | "details" = "cards";
    currentDetailData: any = null;
    currentData: any = null;

    branchSummaryData: BranchSummaryData = {
        totalSnOutBrn: 0,
        totalSnInBrn: 0,
        totalBrn: 0,
        totalPndSnInBrn: 0,
        totalPndSnOutBrn: 0
    };


    branchSummary: BranchStatusListData[] = [];
    adBranchDetails: AdBranchDetailsData[] = [];
    signInDetails: BranchSignInOutDetailsData[] = [];
    branchSummaryPieChart!: EChartsOption;
    SignInTrendLineChart!: EChartsOption;
    branchTrendData = {
  labels: ['9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM'],
  signedIn: [3, 6, 8, 12, 9, 7],
  pendingSignIn: [5, 7, 10, 14, 18, 20]
};


    /* Chart  */
    private buildBranchSummaryPieChart(): EChartsOption {
        const s = this.branchSummaryData;

        const signInBranch = s.totalSnInBrn;
        const pendingSignInBranch = s.totalPndSnInBrn;
        const signOutBranch = s.totalSnOutBrn;
        const pendingSignOutBranch = s.totalPndSnOutBrn;

        return {
            color: ['#1d4ed8', '#ef4444', '#9333ea', '#fb923c'],
            title: {
                text: 'Overall Branch Status',
                left: 'center',
                top: '2%'
            },
            tooltip: {
                trigger: 'item',
                formatter: '{b}: {c} ({d}%)'
            },
            legend: {
                top: '8%',
                left: 'center'
            },
            series: [
                {
                    name: 'Status',
                    type: 'pie',
                    radius: ['40%', '70%'],
                    avoidLabelOverlap: false,
                    itemStyle: {
                        borderRadius: 10,
                        borderColor: '#fff',
                        borderWidth: 2
                    },
                    label: {
                        show: true,
                        position: 'inside',
                        formatter: (params: any) => {
                            
                            return params.value && params.value !== 0 ? params.value : '';
                        },    
                        color: '#fff',
                        fontSize: 14,
                        fontWeight: 'bold'
                    },
                    labelLine: {
                        show: false
                    },
                    emphasis: {
                        scale: true
                    },

                    data: [
                        { value: signInBranch, name: 'Sign In' },
                        { value: pendingSignInBranch, name: 'Pending Sign In' },
                        { value: signOutBranch, name: 'Sign Out' },
                        { value: pendingSignOutBranch, name: 'Pending Sign Out' }
                    ]
                }
            ]
        };
    }
    private buildSignInTrendLineChart(): EChartsOption {

    const t = this.branchTrendData;

    return {
        color: ['#1d4ed8', '#fb923c'],
        title: {
            text: 'Sign-In Trend Over Time',
            left: 'center',
            top: '2%'
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            top: '8%',
            left: 'center'
        },
        grid: {
            top: '20%',
            left: '4%',
            right: '4%',
            bottom: '8%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: t.labels,
            axisLabel: {
                fontSize: 12
            }
        },
        yAxis: {
            type: 'value',
            minInterval: 1,
            axisLabel: {
                fontSize: 12
            }
        },
        series: [
            {
                name: 'Signed-In Branches',
                type: 'line',
                smooth: true,
                symbol: 'circle',
                symbolSize: 8,
                lineStyle: {
                    width: 3
                },
                emphasis: {
                    focus: 'series'
                },
                data: t.signedIn
            },
            {
                name: 'Pending Sign-In',
                type: 'line',
                smooth: true,
                symbol: 'circle',
                symbolSize: 8,
                lineStyle: {
                    width: 3,
                    type: 'dashed'
                },
                emphasis: {
                    focus: 'series'
                },
                data: t.pendingSignIn
            }
        ]
    };
}




    /* Pagination and Detail View State */
    paginationState = {
        adBranch: { totalItems: 0, currentPage: 0, pageSize: 10 },
        signIn: { totalItems: 0, currentPage: 0, pageSize: 10 },
    };
    currentDetailView:
        | 'adBranch'
        | 'signIn'
        | null = null;



    constructor(private dashboardService: DashboardDataService, private cdr: ChangeDetectorRef,) { }

    ngOnInit(): void {
        this.loadDashboardData(); // initial load
    }

    loadDashboardData(): void {
        this.dashboardService
            .fetchFormattedBranch('/branch/adBrnSummary')
            .subscribe((data) => {
                console.log('Branch Summary Data:', data);
                this.branchSummaryData = data;
                this.branchSummaryPieChart = this.buildBranchSummaryPieChart();
                this.SignInTrendLineChart = this.buildSignInTrendLineChart();
            });

        // this.dashboardService
        //   .fetchBranchStatusHistory(
        //     '/branch/brnHistory'
        //   )
        //   .subscribe((data: BranchStatusListData[]) => {
        //     console.log('Branch table status Data:', data);
        //     this.branchSummary = data;
        //     this.totalItems = data.length;
        //   });
    }

    // onPageChangeHandler(event: PageEvent) {
    //     if (event.pageSize !== this.pageSize) {
    //         this.pageSize = event.pageSize;
    //         this.currentPage = 0; // Reset to first page if needed
    //         //this.fetchData(); // Call API only on page size change
    //     } else {
    //         // Just update current page, don't call API
    //         this.currentPage = event.pageIndex;
    //     }
    // }


    /**
         * Opens the Ad Branch detail view, loads data, and configures the table.
    */
    adBranchDetailsDialog() {
        this.currentDetailView = "adBranch";

        const columns = [
            { key: "rn", label: "RN", cssClass: "min-w-[70px] w-[100px]", },
            { key: "brnCode", label: "Branch Code", cssClass: "min-w-[90px] w-[150px]", },
            { key: "brnName", label: "Name", cssClass: "min-w-[200px] w-[550px]", },
            { key: "brnAddr", label: "Address", cssClass: "min-w-[150px] w-[450px]", },
            { key: "brnOpnDate", label: "Open Date", cssClass: "min-w-[130px] w-[170px]", },
            { key: "brnCurr", label: "Currency", cssClass: "min-w-[90px] w-[150px]", },
            { key: "brnDlrCode", label: "AD Code", cssClass: "min-w-[120px] w-[250px]", },
            { key: "brnSwfCode", label: "Swift Code", cssClass: "min-w-[120px] w-[250px]", },

        ];

        this.paginationState.adBranch.currentPage = 0;

        this.loadAdBranchDetails()
            .then(() => {
                console.log("Data loaded:", this.adBranchDetails);

                if (this.adBranchDetails && this.adBranchDetails.length > 0) {
                    this.currentDetailData = {
                        title: "View AD Branch Details",
                        columns: columns,
                        tableData: this.adBranchDetails,
                        totalItems: this.paginationState.adBranch.totalItems,
                        pageSize: this.paginationState.adBranch.pageSize,
                        currentPage: this.paginationState.adBranch.currentPage,
                    };
                } else {
                    console.warn("No data available for display");
                    this.currentDetailData = {
                        title: "View AD Branch Details",
                        columns: columns,
                        tableData: [],
                        totalItems: 0,
                        pageSize: this.paginationState.adBranch.pageSize,
                        currentPage: this.paginationState.adBranch.currentPage,
                    };
                }
                this.viewMode = "details";
            })
            .catch((error) => {
                console.error("Error loading data:", error);
                this.currentDetailData = {
                    title: "View AD Branch Details",
                    columns: columns,
                    tableData: [],
                    totalItems: 0,
                    pageSize: this.paginationState.adBranch.pageSize,
                    currentPage: this.paginationState.adBranch.currentPage,
                };
                this.viewMode = "details";
            });
    }

    /**
     * Loads paginated AD Branch details from the backend.
     * @returns A promise that resolves when data is loaded or rejects on error.
     */
    loadAdBranchDetails(): Promise<void> {
        const { currentPage, pageSize } = this.paginationState.adBranch;

        return new Promise((resolve, reject) => {
            this.dashboardService
                .getPagedData<AdBranchDetailsData>("/branch/AdbrnDtls", {
                    pageNo: currentPage,
                    pageSize: pageSize,
                })
                .subscribe({
                    next: (pageResponse: PageResponse<AdBranchDetailsData>) => {
                        console.log("Page Response:", pageResponse);
                        this.adBranchDetails = pageResponse.lcList.map((item) => ({
                            ...item,

                        }));
                        //this.lcOpenDetails = pageResponse.lcList;
                        this.paginationState.adBranch.totalItems = pageResponse.totalElements;
                        this.paginationState.adBranch.pageSize = pageResponse.pageSize;
                        this.paginationState.adBranch.currentPage = pageResponse.pageNo;

                        this.updateLcDialogData();
                        resolve();
                    },
                    error: (err) => {
                        console.error("Failed to fetch AD Branch details:", err);
                        this.adBranchDetails = [];
                        this.paginationState.adBranch.totalItems = 0;
                        this.updateLcDialogData();
                        reject(err);
                    },
                });
        });
    }


    /**
     * Opens the Ad Branch Sign In detail view, loads data, and configures the table.
    */
    adBranchSignInDetailsDialog() {
        this.currentDetailView = "signIn";

        const columns = [
            { key: "rn", label: "RN", cssClass: "min-w-[70px] w-[100px]", },
            { key: "brnCode", label: "Branch Code", cssClass: "min-w-[90px] w-[150px]", },
            { key: "brnName", label: "Name", cssClass: "min-w-[200px] w-[550px]", },
            { key: "currBussDate", label: "Business Date", cssClass: "min-w-[130px] w-[170px]", },
            { key: "signIn", label: "Sign In", cssClass: "min-w-[150px] w-[250px]", },
            { key: "signOut", label: "Sign Out", cssClass: "min-w-[150px] w-[250px]", },
            { key: "userId", label: "SingIn User", cssClass: "min-w-[100px] w-[250px]", },

        ];

        this.paginationState.signIn.currentPage = 0;

        this.loadAdBranchSignInDetails()
            .then(() => {
                console.log("Data loaded:", this.signInDetails);

                if (this.signInDetails && this.signInDetails.length > 0) {
                    this.currentDetailData = {
                        title: "View Sign In Branch Details",
                        columns: columns,
                        tableData: this.signInDetails,
                        totalItems: this.paginationState.signIn.totalItems,
                        pageSize: this.paginationState.signIn.pageSize,
                        currentPage: this.paginationState.signIn.currentPage,
                    };
                } else {
                    console.warn("No data available for display");
                    this.currentDetailData = {
                        title: "View Sign In Branch Details",
                        columns: columns,
                        tableData: [],
                        totalItems: 0,
                        pageSize: this.paginationState.signIn.pageSize,
                        currentPage: this.paginationState.signIn.currentPage,
                    };
                }
                this.viewMode = "details";
            })
            .catch((error) => {
                console.error("Error loading data:", error);
                this.currentDetailData = {
                    title: "View Sign In Branch Details",
                    columns: columns,
                    tableData: [],
                    totalItems: 0,
                    pageSize: this.paginationState.signIn.pageSize,
                    currentPage: this.paginationState.signIn.currentPage,
                };
                this.viewMode = "details";
            });
    }

    /**
     * Loads paginated Sign In details from the backend.
     * @returns A promise that resolves when data is loaded or rejects on error.
     */
    loadAdBranchSignInDetails(): Promise<void> {
        const { currentPage, pageSize } = this.paginationState.signIn;

        return new Promise((resolve, reject) => {
            this.dashboardService
                .getPagedData<BranchSignInOutDetailsData>("/branch/brnSignInDtls", {
                    pageNo: currentPage,
                    pageSize: pageSize,
                })
                .subscribe({
                    next: (pageResponse: PageResponse<BranchSignInOutDetailsData>) => {
                        console.log("Page Response:", pageResponse);
                        this.signInDetails = pageResponse.lcList.map((item) => ({
                            ...item,
                            signOut: item.signOut == null ? "Pending.." : item.signOut,
                        }));
                        //this.lcOpenDetails = pageResponse.lcList;
                        this.paginationState.signIn.totalItems = pageResponse.totalElements;
                        this.paginationState.signIn.pageSize = pageResponse.pageSize;
                        this.paginationState.signIn.currentPage = pageResponse.pageNo;

                        this.updateLcDialogData();
                        resolve();
                    },
                    error: (err) => {
                        console.error("Failed to fetch Sign In Branch details:", err);
                        this.signInDetails = [];
                        this.paginationState.signIn.totalItems = 0;
                        this.updateLcDialogData();
                        reject(err);
                    },
                });
        });
    }

    /**
     * Opens the Pending Sign In detail view, loads data, and configures the table.
    */
    adBranchPnSignInDetailsDialog() {
        this.currentDetailView = "signIn";

        const columns = [
            { key: "rn", label: "RN", cssClass: "min-w-[70px] w-[100px]", },
            { key: "brnCode", label: "Branch Code", cssClass: "min-w-[90px] w-[150px]", },
            { key: "brnName", label: "Name", cssClass: "min-w-[200px] w-[550px]", },
            { key: "currBussDate", label: "Business Date", cssClass: "min-w-[130px] w-[170px]", },
            { key: "signIn", label: "Sign In", cssClass: "min-w-[150px] w-[250px]", },
            { key: "signOut", label: "Sign Out", cssClass: "min-w-[150px] w-[250px]", },
            { key: "userId", label: "SignIn User", cssClass: "min-w-[100px] w-[250px]", },

        ];

        this.paginationState.signIn.currentPage = 0;

        this.loadAdBranchPnSignInDetails()
            .then(() => {
                console.log("Data loaded:", this.signInDetails);

                if (this.signInDetails && this.signInDetails.length > 0) {
                    this.currentDetailData = {
                        title: "View  Pending Sign In Branch Details",
                        columns: columns,
                        tableData: this.signInDetails,
                        totalItems: this.paginationState.signIn.totalItems,
                        pageSize: this.paginationState.signIn.pageSize,
                        currentPage: this.paginationState.signIn.currentPage,
                    };
                } else {
                    console.warn("No data available for display");
                    this.currentDetailData = {
                        title: "View Pending Sign In Branch Details",
                        columns: columns,
                        tableData: [],
                        totalItems: 0,
                        pageSize: this.paginationState.signIn.pageSize,
                        currentPage: this.paginationState.signIn.currentPage,
                    };
                }
                this.viewMode = "details";
            })
            .catch((error) => {
                console.error("Error loading data:", error);
                this.currentDetailData = {
                    title: "View Pending Sign In Branch Details",
                    columns: columns,
                    tableData: [],
                    totalItems: 0,
                    pageSize: this.paginationState.signIn.pageSize,
                    currentPage: this.paginationState.signIn.currentPage,
                };
                this.viewMode = "details";
            });
    }
    /**
     * Loads paginated Pending Sign In details from the backend.
     * @returns A promise that resolves when data is loaded or rejects on error.
     */
    loadAdBranchPnSignInDetails(): Promise<void> {
        const { currentPage, pageSize } = this.paginationState.signIn;

        return new Promise((resolve, reject) => {
            this.dashboardService
                .getPagedData<BranchSignInOutDetailsData>("/branch/brnPndSignInDtls", {
                    pageNo: currentPage,
                    pageSize: pageSize,
                })
                .subscribe({
                    next: (pageResponse: PageResponse<BranchSignInOutDetailsData>) => {
                        console.log("Page Response:", pageResponse);
                        this.signInDetails = pageResponse.lcList.map((item) => ({
                            ...item,
                            signIn: item.signIn == null ? "Pending.." : item.signIn,
                            signOut: item.signOut == null ? "Pending.." : item.signOut,
                        }));
                        //this.lcOpenDetails = pageResponse.lcList;
                        this.paginationState.signIn.totalItems = pageResponse.totalElements;
                        this.paginationState.signIn.pageSize = pageResponse.pageSize;
                        this.paginationState.signIn.currentPage = pageResponse.pageNo;

                        this.updateLcDialogData();
                        resolve();
                    },
                    error: (err) => {
                        console.error("Failed to fetch Sign In Branch details:", err);
                        this.signInDetails = [];
                        this.paginationState.signIn.totalItems = 0;
                        this.updateLcDialogData();
                        reject(err);
                    },
                });
        });
    }

    /**
     * Opens the Ad Branch Sign Out detail view, loads data, and configures the table.
    */
    adBranchSignOutDetailsDialog() {
        this.currentDetailView = "signIn";

        const columns = [
            { key: "rn", label: "RN", cssClass: "min-w-[70px] w-[100px]", },
            { key: "brnCode", label: "Branch Code", cssClass: "min-w-[90px] w-[150px]", },
            { key: "brnName", label: "Name", cssClass: "min-w-[200px] w-[550px]", },
            { key: "currBussDate", label: "Business Date", cssClass: "min-w-[130px] w-[170px]", },
            { key: "signIn", label: "Sign In", cssClass: "min-w-[150px] w-[250px]", },
            { key: "signOut", label: "Sign Out", cssClass: "min-w-[150px] w-[250px]", },
            { key: "userId", label: "SingOut User", cssClass: "min-w-[100px] w-[250px]", },

        ];

        this.paginationState.signIn.currentPage = 0;

        this.loadAdBranchSignOutDetails()
            .then(() => {
                console.log("Data loaded:", this.signInDetails);

                if (this.signInDetails && this.signInDetails.length > 0) {
                    this.currentDetailData = {
                        title: "View Sign Out Branch Details",
                        columns: columns,
                        tableData: this.signInDetails,
                        totalItems: this.paginationState.signIn.totalItems,
                        pageSize: this.paginationState.signIn.pageSize,
                        currentPage: this.paginationState.signIn.currentPage,
                    };
                } else {
                    console.warn("No data available for display");
                    this.currentDetailData = {
                        title: "View Sign Out Branch Details",
                        columns: columns,
                        tableData: [],
                        totalItems: 0,
                        pageSize: this.paginationState.signIn.pageSize,
                        currentPage: this.paginationState.signIn.currentPage,
                    };
                }
                this.viewMode = "details";
            })
            .catch((error) => {
                console.error("Error loading data:", error);
                this.currentDetailData = {
                    title: "View Sign Out Branch Details",
                    columns: columns,
                    tableData: [],
                    totalItems: 0,
                    pageSize: this.paginationState.signIn.pageSize,
                    currentPage: this.paginationState.signIn.currentPage,
                };
                this.viewMode = "details";
            });
    }

    /**
     * Loads paginated Sign Out details from the backend.
     * @returns A promise that resolves when data is loaded or rejects on error.
     */
    loadAdBranchSignOutDetails(): Promise<void> {
        const { currentPage, pageSize } = this.paginationState.signIn;

        return new Promise((resolve, reject) => {
            this.dashboardService
                .getPagedData<BranchSignInOutDetailsData>("/branch/brnSignOutDtls", {
                    pageNo: currentPage,
                    pageSize: pageSize,
                })
                .subscribe({
                    next: (pageResponse: PageResponse<BranchSignInOutDetailsData>) => {
                        console.log("Page Response:", pageResponse);
                        this.signInDetails = pageResponse.lcList.map((item) => ({
                            ...item,
                            signOut: item.signOut == null ? "Pending.." : item.signOut,
                        }));
                        //this.lcOpenDetails = pageResponse.lcList;
                        this.paginationState.signIn.totalItems = pageResponse.totalElements;
                        this.paginationState.signIn.pageSize = pageResponse.pageSize;
                        this.paginationState.signIn.currentPage = pageResponse.pageNo;

                        this.updateLcDialogData();
                        resolve();
                    },
                    error: (err) => {
                        console.error("Failed to fetch Sign Out Branch details:", err);
                        this.signInDetails = [];
                        this.paginationState.signIn.totalItems = 0;
                        this.updateLcDialogData();
                        reject(err);
                    },
                });
        });
    }

    /**
     * Opens the Ad Branch Pending Sign Out detail view, loads data, and configures the table.
    */
    adBranchPnSignOutDetailsDialog() {
        this.currentDetailView = "signIn";

        const columns = [
            { key: "rn", label: "RN", cssClass: "min-w-[70px] w-[100px]", },
            { key: "brnCode", label: "Branch Code", cssClass: "min-w-[90px] w-[150px]", },
            { key: "brnName", label: "Name", cssClass: "min-w-[200px] w-[550px]", },
            { key: "currBussDate", label: "Business Date", cssClass: "min-w-[130px] w-[170px]", },
            { key: "signIn", label: "Sign In", cssClass: "min-w-[150px] w-[250px]", },
            { key: "signOut", label: "Sign Out", cssClass: "min-w-[150px] w-[250px]", },
            { key: "userId", label: "SingOut User", cssClass: "min-w-[100px] w-[250px]", },

        ];

        this.paginationState.signIn.currentPage = 0;

        this.loadAdBranchPnSignOutDetails()
            .then(() => {
                console.log("Data loaded:", this.signInDetails);

                if (this.signInDetails && this.signInDetails.length > 0) {
                    this.currentDetailData = {
                        title: "View Pending Sign Out Branch Details",
                        columns: columns,
                        tableData: this.signInDetails,
                        totalItems: this.paginationState.signIn.totalItems,
                        pageSize: this.paginationState.signIn.pageSize,
                        currentPage: this.paginationState.signIn.currentPage,
                    };
                } else {
                    console.warn("No data available for display");
                    this.currentDetailData = {
                        title: "View Pending Sign Out Branch Details",
                        columns: columns,
                        tableData: [],
                        totalItems: 0,
                        pageSize: this.paginationState.signIn.pageSize,
                        currentPage: this.paginationState.signIn.currentPage,
                    };
                }
                this.viewMode = "details";
            })
            .catch((error) => {
                console.error("Error loading data:", error);
                this.currentDetailData = {
                    title: "View Pending Sign Out Branch Details",
                    columns: columns,
                    tableData: [],
                    totalItems: 0,
                    pageSize: this.paginationState.signIn.pageSize,
                    currentPage: this.paginationState.signIn.currentPage,
                };
                this.viewMode = "details";
            });
    }

    /**
     * Loads paginated Pending Sign Out details from the backend.
     * @returns A promise that resolves when data is loaded or rejects on error.
     */
    loadAdBranchPnSignOutDetails(): Promise<void> {
        const { currentPage, pageSize } = this.paginationState.signIn;

        return new Promise((resolve, reject) => {
            this.dashboardService
                .getPagedData<BranchSignInOutDetailsData>("/branch/brnPndSignOutDtls", {
                    pageNo: currentPage,
                    pageSize: pageSize,
                })
                .subscribe({
                    next: (pageResponse: PageResponse<BranchSignInOutDetailsData>) => {
                        console.log("Page Response:", pageResponse);
                        this.signInDetails = pageResponse.lcList.map((item) => ({
                            ...item,
                            signOut: item.signOut == null ? "Pending.." : item.signOut,
                        }));
                        //this.lcOpenDetails = pageResponse.lcList;
                        this.paginationState.signIn.totalItems = pageResponse.totalElements;
                        this.paginationState.signIn.pageSize = pageResponse.pageSize;
                        this.paginationState.signIn.currentPage = pageResponse.pageNo;

                        this.updateLcDialogData();
                        resolve();
                    },
                    error: (err) => {
                        console.error("Failed to fetch Pending Sign Out Branch details:", err);
                        this.signInDetails = [];
                        this.paginationState.signIn.totalItems = 0;
                        this.updateLcDialogData();
                        reject(err);
                    },
                });
        });
    }


    /**
       * Switches the view back to card mode and clears detail view state.
       */
    goBackToCards() {
        this.viewMode = "cards";
        this.currentDetailView = null;
        this.currentDetailData = null;
    }

    /**
     * Updates the current detail dialog data based on the active view type
     * to reflect the latest table data and pagination state.
     */
    private updateLcDialogData() {
        if (this.currentDetailView === "adBranch" && this.viewMode === "details") {
            this.currentDetailData = {
                ...this.currentDetailData,
                tableData: this.adBranchDetails,
                totalItems: this.paginationState.adBranch.totalItems,
                pageSize: this.paginationState.adBranch.pageSize,
                currentPage: this.paginationState.adBranch.currentPage,
            };
        }
        if (this.currentDetailView === "signIn" && this.viewMode === "details") {
            this.currentDetailData = {
                ...this.currentDetailData,
                tableData: this.signInDetails,
                totalItems: this.paginationState.signIn.totalItems,
                pageSize: this.paginationState.signIn.pageSize,
                currentPage: this.paginationState.signIn.currentPage,
            };
        }

    }

    /**
    * Handles pagination events and reloads the appropriate data set
    * based on the currently active detail view.
    * @param event The pagination event containing page index and size.
    */
    onPageChangeHandler(event: PageEvent) {

        if (this.currentDetailView === "adBranch") {
            this.paginationState.adBranch.currentPage = event.pageIndex;
            this.paginationState.adBranch.pageSize = event.pageSize;
            this.loadAdBranchDetails();
        }
        if (this.currentDetailView === "signIn") {
            this.paginationState.signIn.currentPage = event.pageIndex;
            this.paginationState.signIn.pageSize = event.pageSize;
            this.loadAdBranchSignInDetails();
        }
    }
}
