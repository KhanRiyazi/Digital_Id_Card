import React, { useState, useEffect } from 'react'
import { Users, TrendingUp, Award, AlertTriangle } from 'lucide-react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import api from '../api'

const DashboardPage = () => {
    const [stats, setStats] = useState({
        total_students: 0,
        avg_wellness: 0,
        avg_attendance: 0,
        avg_exam_score: 0,
        risk_distribution: []
    })
    const [recentStudents, setRecentStudents] = useState([])

    useEffect(() => {
        fetchStats()
        fetchRecentStudents()
    }, [])

    const fetchStats = async () => {
        try {
            const response = await api.get('/analytics/stats')
            setStats(response.data)
        } catch (error) {
            console.error('Failed to fetch stats', error)
        }
    }

    const fetchRecentStudents = async () => {
        try {
            const response = await api.get('/prediction/students')
            setRecentStudents(response.data.slice(0, 5))
        } catch (error) {
            console.error('Failed to fetch students', error)
        }
    }

    const riskColors = {
        'Excellent': '#10b981',
        'Moderate': '#f59e0b',
        'At Risk': '#ef4444',
        'Critical': '#7f1d1d'
    }

    const statCards = [
        { title: 'Total Students', value: stats.total_students, icon: Users, color: 'bg-blue-500' },
        { title: 'Avg Wellness Score', value: stats.avg_wellness, icon: TrendingUp, color: 'bg-green-500', suffix: '/100' },
        { title: 'Avg Attendance', value: stats.avg_attendance, icon: Award, color: 'bg-purple-500', suffix: '%' },
        { title: 'At Risk Students', value: stats.risk_distribution?.find(r => r.level === 'At Risk')?.count || 0, icon: AlertTriangle, color: 'bg-red-500' },
    ]

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Principal Dashboard</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statCards.map((stat, index) => (
                    <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">{stat.title}</p>
                                <p className="text-2xl font-bold mt-1">
                                    {stat.value}{stat.suffix || ''}
                                </p>
                            </div>
                            <div className={`${stat.color} p-3 rounded-full text-white`}>
                                <stat.icon size={24} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-lg font-semibold mb-4">Risk Distribution</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={stats.risk_distribution}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="count"
                            >
                                {stats.risk_distribution.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={riskColors[entry.level] || '#8884d8'} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-lg font-semibold mb-4">Recent Students</h2>
                    <div className="space-y-3">
                        {recentStudents.map((student) => (
                            <div key={student.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="font-medium">{student.name}</p>
                                    <p className="text-sm text-gray-500">ID: {student.student_id}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-green-600">{student.wellness_score}/100</p>
                                    <p className="text-xs text-gray-500">{student.risk_level}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DashboardPage