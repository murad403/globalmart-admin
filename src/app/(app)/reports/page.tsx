"use client";

import PageHeader from "@/components/shared/PageHeader";
import AvailableReports from "./AvailableReports";
import CategoryPerformance from "./CategoryPerformance";
import MonthlyUserActivity from "./MonthlyUserActivity";
import ReportsStats from "./ReportsStats";
import SalesPerformanceTrend from "./SalesPerformanceTrend";
import TopPerformingProducts from "./TopPerformingProducts";

const ReportsPage = () => {
  return (
    <div>
      <div className="md:space-y-6 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <PageHeader title="Reports" description="Comprehensive analytics and insights"/>
          </div>
        </div>

        {/* Stats */}
        <ReportsStats />

        {/* Sales Performance Line Chart - full width */}
        <SalesPerformanceTrend />

        {/* Category Pie + Monthly User Activity Bar - side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CategoryPerformance />
          <MonthlyUserActivity />
        </div>

        {/* Top Products Table - full width */}
        <TopPerformingProducts />

        {/* Available Reports - full width */}
        <AvailableReports />
      </div>
    </div>
  );
};

export default ReportsPage;