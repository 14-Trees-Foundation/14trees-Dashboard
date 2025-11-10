export type AuditReportRow = {
    user_id: number;
    user_name: string;
    plot_id: number;
    plot_name: string;
    site_id: number;
    site_name: string;
    audit_date: string; // YYYY-MM-DD
    trees_audited: number;
};

export type AuditReportResponse = {
    offset: number;
    total: number;
    results: AuditReportRow[];
};
