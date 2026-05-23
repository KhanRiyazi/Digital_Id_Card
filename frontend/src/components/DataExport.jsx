import React, { useState } from 'react';

const DataExport = () => {
    const [exporting, setExporting] = useState(false);
    const [exportType, setExportType] = useState('json');
    const [selectedFormat, setSelectedFormat] = useState('json');
    const [studentId, setStudentId] = useState('');
    const [showStudentInput, setShowStudentInput] = useState(false);
    const [exportSuccess, setExportSuccess] = useState(false);

    const handleExport = async () => {
        setExporting(true);
        setExportSuccess(false);

        try {
            let url = '';
            let filename = '';

            // Build URL based on export type
            if (exportType === 'all_json') {
                url = '/api/v1/export/json';
                filename = `students_export_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`;
            } else if (exportType === 'single_json' && studentId) {
                url = `/api/v1/export/json/${studentId}`;
                filename = `student_${studentId}_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`;
            } else if (exportType === 'csv') {
                url = '/api/v1/export/csv';
                filename = `students_export_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.csv`;
            } else if (exportType === 'summary') {
                url = '/api/v1/export/summary';
                filename = `summary_export_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`;
            }

            if (!url) {
                alert('Please select a valid export option');
                setExporting(false);
                return;
            }

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error('Export failed');
            }

            // Handle CSV (download as file)
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
            }
            // Handle JSON (preview and download)
            else {
                const data = await response.json();
                const jsonString = JSON.stringify(data, null, 2);

                // Create preview modal
                showPreviewModal(jsonString, filename);
            }

            setExportSuccess(true);
            setTimeout(() => setExportSuccess(false), 3000);

        } catch (error) {
            console.error('Export error:', error);
            alert('Failed to export data. Please try again.');
        } finally {
            setExporting(false);
        }
    };

    const showPreviewModal = (jsonString, filename) => {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
        modal.innerHTML = `
            <div class="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
                <div class="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 flex justify-between items-center">
                    <div>
                        <h3 class="text-xl font-bold text-white">Export Preview</h3>
                        <p class="text-indigo-200 text-sm">${filename}</p>
                    </div>
                    <button class="text-white hover:bg-white/20 rounded-lg p-2" onclick="this.closest('.fixed').remove()">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
                <div class="p-6 overflow-y-auto" style="max-height: 60vh;">
                    <pre class="bg-gray-50 p-4 rounded-lg overflow-x-auto text-xs">${escapeHtml(jsonString)}</pre>
                </div>
                <div class="bg-gray-50 px-6 py-4 border-t flex justify-end gap-3">
                    <button class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100" onclick="this.closest('.fixed').remove()">
                        Close
                    </button>
                    <button class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700" id="downloadBtn">
                        Download File
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Add download functionality
        const downloadBtn = modal.querySelector('#downloadBtn');
        downloadBtn.onclick = () => {
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
            modal.remove();
        };
    };

    const escapeHtml = (text) => {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    };

    const exportOptions = [
        {
            id: 'all_json',
            title: 'All Students (JSON)',
            description: 'Export complete data of all students in JSON format',
            icon: '📄',
            color: 'from-blue-500 to-blue-600',
            requiresId: false
        },
        {
            id: 'single_json',
            title: 'Single Student (JSON)',
            description: 'Export data of a specific student in JSON format',
            icon: '👤',
            color: 'from-green-500 to-green-600',
            requiresId: true
        },
        {
            id: 'csv',
            title: 'All Students (CSV)',
            description: 'Export student data to CSV for spreadsheet analysis',
            icon: '📊',
            color: 'from-orange-500 to-orange-600',
            requiresId: false
        },
        {
            id: 'summary',
            title: 'Analytics Summary',
            description: 'Export system analytics and performance summary',
            icon: '📈',
            color: 'from-purple-500 to-purple-600',
            requiresId: false
        }
    ];

    return (
        <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 mb-6">
                <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-3 rounded-xl">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Data Export Center</h1>
                        <p className="text-indigo-200 text-sm">Export student data in multiple formats for analysis and reporting</p>
                    </div>
                </div>
            </div>

            {/* Success Message */}
            {exportSuccess && (
                <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 animate-fadeIn">
                    <div className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-green-700">Export completed successfully!</span>
                    </div>
                </div>
            )}

            {/* Export Options Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {exportOptions.map((option) => (
                    <div
                        key={option.id}
                        onClick={() => {
                            setExportType(option.id);
                            setShowStudentInput(option.requiresId);
                            if (!option.requiresId) {
                                setStudentId('');
                            }
                        }}
                        className={`bg-white rounded-xl shadow-lg p-6 cursor-pointer transition-all duration-300 transform hover:scale-105 ${exportType === option.id ? 'ring-2 ring-indigo-500 shadow-xl' : 'hover:shadow-xl'
                            }`}
                    >
                        <div className="flex items-start gap-4">
                            <div className={`bg-gradient-to-r ${option.color} rounded-xl p-3 text-white text-2xl`}>
                                {option.icon}
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-gray-800 text-lg mb-1">{option.title}</h3>
                                <p className="text-gray-500 text-sm">{option.description}</p>
                                {option.requiresId && exportType === option.id && (
                                    <div className="mt-3">
                                        <input
                                            type="text"
                                            placeholder="Enter Student ID"
                                            value={studentId}
                                            onChange={(e) => setStudentId(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                        />
                                    </div>
                                )}
                            </div>
                            <div className={`w-5 h-5 rounded-full border-2 ${exportType === option.id ? 'border-indigo-500 bg-indigo-500' : 'border-gray-300'
                                }`}>
                                {exportType === option.id && (
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Export Button */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div>
                        <h3 className="font-semibold text-gray-800">Ready to Export</h3>
                        <p className="text-sm text-gray-500">
                            {exportType === 'single_json' && !studentId
                                ? 'Please enter a Student ID to continue'
                                : 'Click the button below to export your data'}
                        </p>
                    </div>
                    <button
                        onClick={handleExport}
                        disabled={exporting || (exportType === 'single_json' && !studentId)}
                        className={`px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold flex items-center gap-2 transition-all ${exporting || (exportType === 'single_json' && !studentId)
                                ? 'opacity-50 cursor-not-allowed'
                                : 'hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105'
                            }`}
                    >
                        {exporting ? (
                            <>
                                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Exporting...
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                Export Data
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Information Section */}
            <div className="mt-6 bg-blue-50 rounded-xl p-4">
                <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-blue-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                        <h4 className="font-semibold text-blue-800">About Data Export</h4>
                        <p className="text-sm text-blue-700 mt-1">
                            • JSON format is ideal for programmatic use and API integration<br />
                            • CSV format can be opened in Excel, Google Sheets, or any spreadsheet software<br />
                            • All exports include AI predictions, academic metrics, and student information<br />
                            • Export files are timestamped for easy identification
                        </p>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }
            `}</style>
        </div>
    );
};

export default DataExport;