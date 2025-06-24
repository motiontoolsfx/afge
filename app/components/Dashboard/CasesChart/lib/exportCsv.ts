export function exportCsv(data: any[], allQuestions: { id: string; title: string }[]) {
    if (!data.length) return;

    const headers = allQuestions.map(q => q.title);
    const keys = allQuestions.map(q => q.id);

    const csvRows = data.map(c =>
        keys.map(k => {
            const val = c[k] ?? '';
            const escaped = String(val).replace(/"/g, '""');
            return `"${escaped}"`;
        }).join(',')
    );

    const csv = [headers.join(','), ...csvRows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'cases.csv';
    a.click();
    URL.revokeObjectURL(url);
}
