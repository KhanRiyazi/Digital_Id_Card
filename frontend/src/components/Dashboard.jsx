import React from 'react';

const Dashboard = ({ stats, students }) => {
    const statCards = [
        { title: 'Total Students', value: stats.total_students || 0, icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', color: 'from-blue-500 to-blue-600' },
        { title: 'Active Sessions', value: stats.active_sessions || 0, icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', color: 'from-green-500 to-green-600' },
        { title: 'Prediction Accuracy', value: `${stats.prediction_accuracy || 0}%`, icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6', color: 'from-purple-500 to-purple-600' },
        { title: 'Active Alerts', value: stats.alerts_count || 0, icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9', color: 'from-red-500 to-red-600' }
    ];

    // Get recent students (last 4)
    const recentStudents = students.slice(-4).reverse();

    return (
        <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((card, index) => (
                    <div key={index} className={`bg-gradient-to-r ${card.color} rounded-xl shadow-lg p-6 transform hover:scale-105 transition-transform duration-200`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white/80 text-sm font-medium">{card.title}</p>
                                <p className="text-white text-3xl font-bold mt-2">{card.value}</p>
                            </div>
                            <div className="bg-white/20 rounded-full p-3">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={card.icon} />
                                </svg>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Students */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800">Recent Registrations</h3>
                    <p className="text-sm text-gray-500 mt-1">Recently enrolled students</p>
                </div>
                <div className="divide-y divide-gray-100">
                    {recentStudents.length > 0 ? (
                        recentStudents.map((student) => (
                            <div key={student.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                                            {student.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-800">{student.name}</p>
                                            <p className="text-sm text-gray-500">ID: {student.id}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">{student.status}</span>
                                        <p className="text-sm text-gray-500 mt-1">{student.grade}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="px-6 py-8 text-center text-gray-500">
                            No students registered yet
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;