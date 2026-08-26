// Build a CSV string from an array of objects (given column keys) and trigger
// a client-side download. Values are quoted/escaped.
function escape(val) {
    const s = val === undefined || val === null ? '' : String(val);
    return `"${s.replace(/"/g, '""')}"`;
}

// Pure builder (kept separate so it's unit-testable).
export function toCSV(columns, rows) {
    const header = columns.map(c => escape(c.label)).join(',');
    const body = rows.map(row => columns.map(c => escape(typeof c.value === 'function' ? c.value(row) : row[c.value])).join(',')).join('\n');
    return `${header}\n${body}`;
}

export function downloadCSV(filename, columns, rows) {
    const csv = toCSV(columns, rows);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
