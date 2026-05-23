import React, { useState } from 'react';

const QuickExportButton = ({ onExport }) => {
    const [showMenu, setShowMenu] = useState(false);
    const [exporting, setExporting] = useState(false);

    const exportOptions = [
        { type: 'all_json', label: 'All Students (JSON)', icon: '📄', description: 'Export complete student data' },
        { type: 'csv', label: 'All Students (CSV)', icon: '📊', description: 'Export for spreadsheet analysis' },
        { type: 'summary', label: 'Analytics Summary', icon: '📈', description: 'Export system analytics' }
    ];

    const handleExport = async (exportType) => {
        setExporting(true);
        let url = '';
        let filename = '';

        if (exportType === 'all_json') {
            url = '/api/v1/export/json';
            filename = `students_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`;
        } else if (exportType === 'csv') {
            url = '/api/v1/export/csv';
            filename = `students_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.csv`;
        } else if (exportType === 'summary') {
            url = '/api/v1/export/summary';
            filename = `summary_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`;
        }

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Export failed');

            if (exportType === 'csv') {
                const blob = await response.blob();
                const downloadUrl = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = downloadUrl;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(downloadUrl);
            } else {
                const data = await response.json();
                const jsonString = JSON.stringify(data, null, 2);
                const blob = new Blob([jsonString], { type: 'application/json' });
                const downloadUrl = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = downloadUrl;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(downloadUrl);
            }

            // Show success notification
            if (onExport) onExport(exportType);

            // Close menu
            setShowMenu(false);

        } catch (error) {
            console.error('Export error:', error);
            alert('Failed to export data. Please try again.');
        } finally {
            setExporting(false);
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setShowMenu(!showMenu)}
                disabled={exporting}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-teal-500 to-cyan-500 text-white hover:from-teal-600 hover:to-cyan-600 transition-all duration-200 shadow-md hover:shadow-lg"
            >
                {exporting ? (
                    <>
                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Exporting...
                    </>
                ) : (
                    <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Export
                        <svg className={`w-4 h-4 transition-transform duration-200 ${showMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </>
                )}
            </button>

            {showMenu && !exporting && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)}></div>
                    <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl z-50 overflow-hidden border border-gray-100 animate-slideDown">
                        <div className="bg-gradient-to-r from-teal-500 to-cyan-500 px-4 py-3">
                            <h3 className="text-white font-semibold text-sm">Quick Export</h3>
                            <p className="text-teal-100 text-xs">Choose export format</p>
                        </div>
                        <div className="py-2">
                            {exportOptions.map((option, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleExport(option.type)}
                                    className="w-full px-4 py-3 hover:bg-gray-50 transition-colors flex items-center gap-3 group"
                                >
                                    <div className="text-2xl">{option.icon}</div>
                                    <div className="flex-1 text-left">
                                        <p className="text-sm font-medium text-gray-800 group-hover:text-teal-600 transition-colors">
                                            {option.label}
                                        </p>
                                        <p className="text-xs text-gray-500">{option.description}</p>
                                    </div>
                                    <svg className="w-4 h-4 text-gray-400 group-hover:text-teal-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}

            <style>{`
                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-slideDown {
                    animation: slideDown 0.2s ease-out;
                }
            `}</style>
        </div>
    );
};

export default QuickExportButton;