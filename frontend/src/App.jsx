import React, { useState, useEffect } from 'react';
import DigitalIDCard from './components/DigitalIDCard';
import StudentForm from './components/StudentForm';
import Dashboard from './components/Dashboard';
import StudentsList from './components/StudentsList';
import Analytics from './components/Analytics';
import Settings from './components/Settings';
import DataExport from './components/DataExport';
import QuickExportButton from './components/QuickExportButton';

function App() {
    const [currentView, setCurrentView] = useState('dashboard');
    const [students, setStudents] = useState([]);
    const [stats, setStats] = useState({});
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [rightMenuOpen, setRightMenuOpen] = useState(false);
    const [notification, setNotification] = useState(null);
    const [systemStatus, setSystemStatus] = useState({
        online: true,
        lastSync: new Date().toISOString(),
        version: '3.0.0'
    });

    useEffect(() => {
        checkBackendConnection();
        // Auto-refresh data every 30 seconds
        const interval = setInterval(() => {
            if (systemStatus.online) {
                fetchData();
            }
        }, 30000);
        return () => clearInterval(interval);
    }, []);

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const checkBackendConnection = async () => {
        try {
            const response = await fetch('/api/');
            if (response.ok) {
                const data = await response.json();
                setSystemStatus({
                    online: true,
                    lastSync: new Date().toISOString(),
                    version: data.version || '3.0.0'
                });
                fetchData();
                showNotification('System connected successfully', 'success');
            } else {
                setError('Backend server is not responding properly');
                setSystemStatus(prev => ({ ...prev, online: false }));
                setLoading(false);
            }
        } catch (error) {
            setError('Cannot connect to backend server. Please ensure the server is running.');
            setSystemStatus(prev => ({ ...prev, online: false }));
            setLoading(false);
            showNotification('Failed to connect to backend server', 'error');
        }
    };

    const fetchData = async () => {
        try {
            const [studentsRes, statsRes] = await Promise.all([
                fetch('/api/v1/prediction/students'),
                fetch('/api/v1/analytics/stats')
            ]);

            if (studentsRes.ok && statsRes.ok) {
                const studentsData = await studentsRes.json();
                const statsData = await statsRes.json();
                setStudents(studentsData);
                setStats(statsData);
                setSystemStatus(prev => ({ ...prev, online: true, lastSync: new Date().toISOString() }));
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            setSystemStatus(prev => ({ ...prev, online: false }));
        } finally {
            setLoading(false);
        }
    };

    const generateDigitalID = async (studentData, photoFile) => {
        const formData = new FormData();
        formData.append('name', studentData.name);
        formData.append('student_id', studentData.studentId);
        formData.append('grade', studentData.grade);
        formData.append('photo', photoFile);
        formData.append('aadhar_number', studentData.aadharNumber);
        formData.append('enrollment_number', studentData.enrollmentNumber);
        formData.append('roll_number', studentData.rollNumber);
        formData.append('parents_name', studentData.parentsName);
        formData.append('parents_contact', studentData.parentsContact);
        formData.append('interests', studentData.interests);
        formData.append('goals', studentData.goals);
        formData.append('address', studentData.address);
        formData.append('blood_group', studentData.bloodGroup);
        formData.append('date_of_birth', studentData.dateOfBirth);
        formData.append('email', studentData.email);
        formData.append('phone', studentData.phone);

        try {
            const response = await fetch('/api/v1/digital-id/generate', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const idCard = await response.json();
                setSelectedStudent(idCard);
                setCurrentView('id-card');
                await fetchData();
                setRightMenuOpen(false);
                showNotification(`Digital ID card generated for ${studentData.name}`, 'success');
            } else {
                const error = await response.json();
                showNotification(`Failed to generate ID: ${error.detail || 'Unknown error'}`, 'error');
            }
        } catch (error) {
            console.error('Error generating ID:', error);
            showNotification('Failed to generate ID card. Please try again.', 'error');
        }
    };

    const handleRefresh = async () => {
        setLoading(true);
        await fetchData();
        showNotification('Data refreshed successfully', 'success');
    };

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', color: 'from-blue-500 to-blue-600' },
        { id: 'students', label: 'Students', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', color: 'from-green-500 to-green-600' },
        { id: 'register', label: 'Register', icon: 'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z', color: 'from-purple-500 to-purple-600' },
        { id: 'analytics', label: 'Analytics', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', color: 'from-yellow-500 to-orange-500' },
        { id: 'export', label: 'Export Data', icon: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4', color: 'from-teal-500 to-cyan-500' },
        { id: 'settings', label: 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z', color: 'from-gray-500 to-gray-600' },
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="relative">
                        <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-indigo-600 mx-auto"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="h-8 w-8 bg-indigo-600 rounded-full animate-pulse"></div>
                        </div>
                    </div>
                    <p className="mt-6 text-gray-600 font-medium">Loading Student Welfare System...</p>
                    <p className="text-sm text-gray-400 mt-2">Connecting to AI server</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full transform transition-all">
                    <div className="text-center">
                        <div className="bg-red-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Connection Error</h2>
                        <p className="text-gray-600 mb-6">{error}</p>
                        <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                            <p className="text-sm font-semibold text-gray-700 mb-2">Troubleshooting tips:</p>
                            <ul className="text-xs text-gray-600 space-y-1">
                                <li>• Ensure backend server is running on port 8000</li>
                                <li>• Check if Python virtual environment is activated</li>
                                <li>• Run: python -c "from app.main import app; import uvicorn; uvicorn.run(app, host='0.0.0.0', port=8000)"</li>
                            </ul>
                        </div>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg"
                        >
                            Retry Connection
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50">
            {/* Notification Toast */}
            {notification && (
                <div className="fixed top-20 right-4 z-50 animate-slideIn">
                    <div className={`rounded-lg shadow-lg p-4 flex items-center gap-3 ${notification.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                        }`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${notification.type === 'success' ? 'bg-green-100' : 'bg-red-100'
                            }`}>
                            {notification.type === 'success' ? (
                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            )}
                        </div>
                        <p className={`text-sm ${notification.type === 'success' ? 'text-green-700' : 'text-red-700'}`}>
                            {notification.message}
                        </p>
                    </div>
                </div>
            )}

            {/* Top Navigation Bar */}
            <nav className="bg-white shadow-md sticky top-0 z-40">
                <div className="px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-3">
                            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-2 rounded-lg">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-800">Student Welfare System</h1>
                                <p className="text-xs text-gray-500">AI-Powered Digital ID & Analytics Platform</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            {/* System Status */}
                            <div className="hidden md:flex items-center space-x-2 bg-green-50 px-3 py-1 rounded-full">
                                <div className={`w-2 h-2 rounded-full animate-pulse ${systemStatus.online ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                <span className="text-xs text-green-600">
                                    {systemStatus.online ? 'System Online' : 'Offline'}
                                </span>
                            </div>

                            {/* Last Sync Time */}
                            <div className="hidden lg:block text-xs text-gray-400">
                                Last sync: {new Date(systemStatus.lastSync).toLocaleTimeString()}
                            </div>

                            {/* Refresh Button */}
                            <button
                                onClick={handleRefresh}
                                className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                                title="Refresh Data"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                            </button>

                            {/* Quick Export Button */}
                            <QuickExportButton />

                            {/* Right Menu Toggle Button */}
                            <button
                                onClick={() => setRightMenuOpen(!rightMenuOpen)}
                                className="relative p-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg transition-all duration-200"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    {rightMenuOpen ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Right Sidebar Menu */}
            <div className={`
                fixed inset-y-0 right-0 z-50 w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out
                ${rightMenuOpen ? 'translate-x-0' : 'translate-x-full'}
            `}>
                <div className="flex flex-col h-full">
                    {/* Menu Header */}
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-white font-bold text-xl">Menu</h2>
                                <p className="text-indigo-200 text-sm">Navigate through options</p>
                            </div>
                            <button
                                onClick={() => setRightMenuOpen(false)}
                                className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Menu Items */}
                    <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                        {menuItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => {
                                    setCurrentView(item.id);
                                    setRightMenuOpen(false);
                                }}
                                className={`
                                    w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200
                                    ${currentView === item.id
                                        ? `bg-gradient-to-r ${item.color} text-white shadow-lg transform scale-102`
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-indigo-600'}
                                `}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                                </svg>
                                <span className="font-medium flex-1 text-left">{item.label}</span>
                                {currentView === item.id && (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                )}
                            </button>
                        ))}
                    </nav>

                    {/* System Info Footer */}
                    <div className="p-4 border-t border-gray-100 bg-gray-50">
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                                AI
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-semibold text-gray-800">AI Student Welfare</p>
                                <p className="text-xs text-gray-500">Version {systemStatus.version}</p>
                            </div>
                            <div className={`w-2 h-2 rounded-full ${systemStatus.online ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        </div>
                        <div className="text-xs text-gray-400 text-center">
                            <p>© 2024 AI Student Welfare System</p>
                            <p className="mt-1">All rights reserved</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Overlay */}
            {rightMenuOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={() => setRightMenuOpen(false)}
                ></div>
            )}

            {/* Main Content */}
            <main className="p-4 sm:p-6 lg:p-8">
                {currentView === 'dashboard' && (
                    <Dashboard stats={stats} students={students} />
                )}

                {currentView === 'students' && (
                    <StudentsList students={students} />
                )}

                {currentView === 'register' && (
                    <StudentForm onSubmit={generateDigitalID} />
                )}

                {currentView === 'analytics' && (
                    <Analytics students={students} stats={stats} />
                )}

                {currentView === 'export' && (
                    <DataExport />
                )}

                {currentView === 'settings' && (
                    <Settings />
                )}

                {currentView === 'id-card' && selectedStudent && (
                    <div className="max-w-4xl mx-auto">
                        <button
                            onClick={() => setCurrentView('dashboard')}
                            className="mb-6 inline-flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 font-semibold transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            <span>Back to Dashboard</span>
                        </button>
                        <DigitalIDCard data={selectedStudent} />
                    </div>
                )}
            </main>

            <style>{`
                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                .animate-slideIn {
                    animation: slideIn 0.3s ease-out;
                }
                @keyframes scale {
                    0% { transform: scale(1); }
                    100% { transform: scale(1.02); }
                }
                .transform-scale-102:hover {
                    transform: scale(1.02);
                }
            `}</style>
        </div>
    );
}

export default App;