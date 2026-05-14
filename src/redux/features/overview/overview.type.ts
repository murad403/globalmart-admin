export interface OverviewCardItem {
    value: number;
    change_percentage: number | null;
}

export interface OverviewCards {
    total_users: OverviewCardItem;
    total_orders: OverviewCardItem;
    platform_revenue: OverviewCardItem;
    active_resellers: OverviewCardItem;
    pending_approvals: OverviewCardItem;
    escrow_balance: OverviewCardItem;
}

export interface MonthlyRevenueItem {
    month: string;
    amount: number;
}

export interface UserDistributionItem {
    type: string;
    count: number;
}

export interface OverviewData {
    period: string;
    currency: string;
    cards: OverviewCards;
    monthly_revenue: MonthlyRevenueItem[];
    user_distribution: UserDistributionItem[];
}

export interface GetOverviewResponse {
    success: boolean;
    message: string;
    request_id: string;
    data: OverviewData;
}

export interface ReportCards {
    total_sales: OverviewCardItem;
    total_orders: OverviewCardItem;
    new_customers: OverviewCardItem;
    growth_rate: OverviewCardItem;
    pending_approvals: { value: number };
}

export interface SalesTrendItem {
    month: string;
    sales: number;
    orders: number;
    customers: number;
}

export interface CategoryPerfItem {
    category: string;
    percentage: number;
    qty: number;
}

export interface UserActivityItem {
    month: string;
    active_users: number;
    new_registrations: number;
}

export interface TopProductItem {
    product_name: string;
    sales: number;
    revenue: number;
    growth: string | null;
}

export interface ReportData {
    period: string;
    currency: string;
    cards: ReportCards;
    sales_performance_trend: SalesTrendItem[];
    category_performance: CategoryPerfItem[];
    monthly_user_activity: UserActivityItem[];
    top_performing_products: TopProductItem[];
}

export interface GetReportsResponse {
    success: boolean;
    message: string;
    request_id: string;
    data: ReportData;
}
