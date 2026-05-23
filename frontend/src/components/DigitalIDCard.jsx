import React, { useRef, useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
import { QRCodeSVG } from 'qrcode.react';

const DigitalIDCard = ({ data }) => {
    const cardRef = useRef(null);
    const [downloading, setDownloading] = useState(false);
    const [showDetails, setShowDetails] = useState(false);

    // Extract data from the response
    const studentData = data?.student_details || data;
    const mlPrediction = data?.ml_prediction || {};
    const studyPlan = data?.study_plan || {};
    const careerPathways = data?.career_pathways || [];

    const downloadCard = async () => {
        if (cardRef.current) {
            setDownloading(true);
            try {
                const canvas = await html2canvas(cardRef.current, {
                    scale: 2,
                    backgroundColor: '#ffffff',
                    logging: false,
                    useCORS: true
                });
                const link = document.createElement('a');
                link.download = `digital-id-${data.student_id || data.id}.png`;
                link.href = canvas.toDataURL('image/png');
                link.click();
            } catch (error) {
                console.error('Error downloading card:', error);
                alert('Failed to download ID card. Please try again.');
            } finally {
                setDownloading(false);
            }
        }
    };

    const getScoreColor = (score) => {
        if (score >= 85) return 'text-green-600';
        if (score >= 70) return 'text-blue-600';
        if (score >= 50) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getPerformanceBadge = (level) => {
        if (level?.includes('Excellent')) return { color: 'bg-green-100 text-green-700', icon: '🌟' };
        if (level?.includes('Good')) return { color: 'bg-blue-100 text-blue-700', icon: '📈' };
        if (level?.includes('Average')) return { color: 'bg-yellow-100 text-yellow-700', icon: '📊' };
        return { color: 'bg-red-100 text-red-700', icon: '⚠️' };
    };

    const performanceBadge = getPerformanceBadge(mlPrediction.performance_level);

    return (
        <div className="space-y-6">
            {/* Digital ID Card */}
            <div
                ref={cardRef}
                className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-2xl mx-auto"
                style={{ width: '600px' }}
            >
                {/* Card Header with Gradient */}
                <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-6 py-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="flex items-center space-x-2">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-4 0h4" />
                                </svg>
                                <h2 className="text-2xl font-bold text-white">Digital ID Card</h2>
                            </div>
                            <p className="text-indigo-200 text-sm mt-1">Official Student Identification</p>
                        </div>
                        <div className="text-right">
                            <div className="text-white/80 text-xs font-semibold">ISSUE DATE</div>
                            <div className="text-white font-bold">{data.issue_date || new Date().toLocaleDateString()}</div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="p-6">
                    <div className="flex gap-6">
                        {/* Photo Section */}
                        <div className="flex-shrink-0">
                            <div className="relative">
                                <div className="w-32 h-32 rounded-xl overflow-hidden bg-gradient-to-br from-indigo-100 to-purple-100 border-4 border-white shadow-lg">
                                    {data.photo ? (
                                        <img src={data.photo} alt="Student" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <div className="text-center">
                                                <div className="w-16 h-16 bg-indigo-200 rounded-full flex items-center justify-center mx-auto">
                                                    <span className="text-3xl font-bold text-indigo-600">
                                                        {(data.student_name || data.name || 'S').charAt(0)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-1.5 shadow-lg">
                                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Student Information */}
                        <div className="flex-grow">
                            <div className="space-y-2">
                                <div>
                                    <label className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Full Name</label>
                                    <p className="text-gray-800 font-bold text-xl mt-0.5">{data.student_name || data.name}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Student ID</label>
                                        <p className="text-gray-800 font-mono text-sm font-bold">{data.student_id || data.id}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Grade/Year</label>
                                        <p className="text-gray-800 font-semibold">{data.grade}</p>
                                    </div>
                                </div>

                                {/* AI Prediction Score */}
                                {mlPrediction.overall_predicted_score && (
                                    <div className="mt-2 bg-gray-50 rounded-lg p-2">
                                        <div className="flex justify-between items-center mb-1">
                                            <label className="text-xs text-gray-500 font-semibold">AI Performance Score</label>
                                            <span className={`text-sm font-bold ${getScoreColor(mlPrediction.overall_predicted_score)}`}>
                                                {mlPrediction.overall_predicted_score}%
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full h-2 transition-all duration-500"
                                                style={{ width: `${mlPrediction.overall_predicted_score}%` }}
                                            />
                                        </div>
                                        <div className="flex justify-between mt-1">
                                            <span className="text-xs text-gray-400">Needs Improvement</span>
                                            <span className="text-xs text-gray-400">Excellent</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* QR Code Section */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-3">
                                <div className="bg-white p-2 rounded-lg shadow-md">
                                    <QRCodeSVG
                                        value={data.qr_code_data || JSON.stringify({
                                            student_id: data.student_id || data.id,
                                            name: data.student_name || data.name
                                        })}
                                        size={60}
                                        level="H"
                                        includeMargin={true}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 uppercase font-semibold">Verification Code</label>
                                    <p className="text-gray-600 text-xs font-mono">{data.qr_hash || data.card_id || 'VERIFY'}</p>
                                    <p className="text-xs text-green-600 mt-1">✓ Scan to verify authenticity</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-xs text-gray-500 uppercase font-semibold">Valid Until</div>
                                <div className="text-sm font-bold text-gray-800">{data.expiry_date || '2027-05-23'}</div>
                                <div className="flex items-center gap-1 mt-1 justify-end">
                                    <span className="text-xs text-indigo-600 font-semibold">✦ AI Verified</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Performance Badge */}
                    <div className="mt-4 pt-3 border-t border-gray-100">
                        <div className={`${performanceBadge.color} rounded-lg p-2 flex items-center justify-between`}>
                            <div className="flex items-center gap-2">
                                <span className="text-lg">{performanceBadge.icon}</span>
                                <span className="text-sm font-semibold">Performance Level</span>
                            </div>
                            <span className="text-sm font-bold">{mlPrediction.performance_level || 'Average'}</span>
                        </div>
                    </div>

                    {/* Additional Details Button */}
                    <button
                        onClick={() => setShowDetails(!showDetails)}
                        className="mt-4 w-full text-center text-sm text-indigo-600 hover:text-indigo-700 font-semibold flex items-center justify-center gap-1"
                    >
                        {showDetails ? 'Hide Details' : 'View Details'}
                        <svg className={`w-4 h-4 transition-transform ${showDetails ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    {/* Expandable Details */}
                    {showDetails && (
                        <div className="mt-4 pt-4 border-t border-gray-100 space-y-3 animate-fadeIn">
                            {/* Parent Information */}
                            {(data.parents_name || data.parents_contact) && (
                                <div>
                                    <h4 className="text-xs font-semibold text-gray-600 mb-2">Parent/Guardian Information</h4>
                                    <div className="bg-gray-50 rounded-lg p-3 space-y-1">
                                        {data.parents_name && (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500">Name:</span>
                                                <span className="font-medium text-gray-700">{data.parents_name}</span>
                                            </div>
                                        )}
                                        {data.parents_contact && (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500">Contact:</span>
                                                <span className="font-medium text-gray-700">{data.parents_contact}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Academic Metrics */}
                            {data.academic_metrics && (
                                <div>
                                    <h4 className="text-xs font-semibold text-gray-600 mb-2">Academic Performance</h4>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="bg-blue-50 rounded-lg p-2 text-center">
                                            <p className="text-xs text-blue-600">Attendance</p>
                                            <p className="text-lg font-bold text-blue-700">{data.academic_metrics.attendance_percentage}%</p>
                                        </div>
                                        <div className="bg-green-50 rounded-lg p-2 text-center">
                                            <p className="text-xs text-green-600">Study Hours</p>
                                            <p className="text-lg font-bold text-green-700">{data.academic_metrics.study_hours_per_day} hrs/day</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Interests & Goals */}
                            {(data.interests || data.goals) && (
                                <div>
                                    <h4 className="text-xs font-semibold text-gray-600 mb-2">Interests & Goals</h4>
                                    <div className="space-y-2">
                                        {data.interests && (
                                            <div className="bg-purple-50 rounded-lg p-2">
                                                <p className="text-xs text-purple-600 font-semibold">Areas of Interest</p>
                                                <p className="text-sm text-gray-700">{data.interests}</p>
                                            </div>
                                        )}
                                        {data.goals && (
                                            <div className="bg-indigo-50 rounded-lg p-2">
                                                <p className="text-xs text-indigo-600 font-semibold">Career Goals</p>
                                                <p className="text-sm text-gray-700">{data.goals}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Career Pathways */}
                            {careerPathways.length > 0 && (
                                <div>
                                    <h4 className="text-xs font-semibold text-gray-600 mb-2">AI Career Recommendations</h4>
                                    <div className="space-y-2">
                                        {careerPathways.map((career, idx) => (
                                            <div key={idx} className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg p-2">
                                                <div className="flex justify-between items-center">
                                                    <span className="font-semibold text-gray-800">{career.field}</span>
                                                    <span className="text-sm font-bold text-teal-600">{career.probability}% match</span>
                                                </div>
                                                <p className="text-xs text-gray-500 mt-1">Expected Salary: {career.average_salary}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
                    <div className="flex justify-between items-center text-xs">
                        <div className="flex items-center space-x-3">
                            <span className="text-gray-500">Authorized by Student Welfare System</span>
                            <span className="text-gray-300">|</span>
                            <span className="text-gray-500">Powered by AI/ML</span>
                        </div>
                        <div className="text-gray-400 font-mono">
                            v3.0
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 max-w-2xl mx-auto">
                <button
                    onClick={downloadCard}
                    disabled={downloading}
                    className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-lg hover:from-green-600 hover:to-green-700 transition-all flex items-center justify-center gap-2 font-semibold shadow-lg"
                >
                    {downloading ? (
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                    )}
                    {downloading ? 'Downloading...' : 'Download ID Card'}
                </button>

                <button
                    onClick={() => window.print()}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all flex items-center justify-center gap-2 font-semibold shadow-lg"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    Print ID Card
                </button>
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }
            `}</style>
        </div>
    );
};

export default DigitalIDCard;