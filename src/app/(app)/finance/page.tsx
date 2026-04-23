import PageHeader from "@/components/shared/PageHeader";
import CashFlowAnalysis from "./CashFlowAnalysis";
import FinanceStats from "./FinanceStats";
import RecentTransactions from "./RecentTransactions";
import RevenueExpensesProfitTrend from "./RevenueExpensesProfitTrend";


const FinancePage = () => {
  return (
    <div>
      <div className="md:space-y-6 space-y-4">
        <PageHeader title="Finance" description="Financial overview and transaction management"/>
        {/* Stats Grid */}
        <FinanceStats />

        {/* Revenue Trend Chart - full width */}
        <RevenueExpensesProfitTrend />

        {/* Cash Flow + Recent Transactions - side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CashFlowAnalysis />
          <RecentTransactions />
        </div>
      </div>
    </div>
  );
};

export default FinancePage;