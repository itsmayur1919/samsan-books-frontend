export const state = {
    purchases: [],
    sales: [],
    cash: [],
    cashOpening: 0,
    currentView: 'reportsView',
    reports: {
        monthSummary: { month: null, rows: [] },
        gstByMonth: { rows: [] },
        gstSummary: {
            total_sales_gst: 0,
            total_purchases_gst: 0,
            net_gst: 0,
            gst_status: 'Payable'
        },
        selectedMonth: null
    }
};