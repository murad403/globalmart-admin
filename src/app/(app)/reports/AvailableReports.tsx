"use client";
import React from "react";

const reports = [
    { title: "Monthly Sales Report", category: "Sales", date: "2024-03-01", size: "2.4 MB" },
    { title: "User Activity Report", category: "Users", date: "2024-03-01", size: "1.8 MB" },
    { title: "Financial Summary", category: "Finance", date: "2024-03-01", size: "3.2 MB" },
    { title: "Product Performance", category: "Products", date: "2024-02-28", size: "2.1 MB" },
    { title: "Category Analysis", category: "Analytics", date: "2024-02-28", size: "1.5 MB" },
    { title: "Customer Insights", category: "Users", date: "2024-02-27", size: "2.8 MB" },
];

const handleDownload = (report: { title: string; category: string; date: string; size: string }) => {
    // Create a mock CSV/text content for the download
    const content = `Report: ${report.title}\nCategory: ${report.category}\nDate: ${report.date}\nSize: ${report.size}\n\nThis is a sample report file for ${report.title}.`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${report.title.replace(/\s+/g, "_")}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

const AvailableReports = () => {
    return (
        <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h3 className="text-base font-semibold text-gray-900">Available Reports</h3>
            <p className="text-xs text-gray-400 mb-4">Download generated reports</p>
            <div className="space-y-2">
                {reports.map((report, i) => (
                    <div
                        key={i}
                        className="flex items-center justify-between py-3 px-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                                <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-800">{report.title}</p>
                                <p className="text-xs text-gray-400">{report.category} • {report.date} • {report.size}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => handleDownload(report)}
                            className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Download
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AvailableReports;