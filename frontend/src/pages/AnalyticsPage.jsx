import React, { useState, useEffect } from 'react'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import api from '../api'

const AnalyticsPage = () => {
    const [stats, setStats] = useState(null)
    const [students, setStudents] = useState([])

    useEffect(() => {
        fetchStats()
        fetchStudents()
    }, [])

    const fetchStats = async () => {
        try {
            const response = await api.get('/analytics/stats')
            setStats(response.data)
        } catch (error) {
            console.error('Failed to fetch stats', error)
        }
    }

    const fetchStudents = async () => {
        try {
            const response = await api.get('/prediction/students')
            setStudents(response.data)
        } catch (error) {
            console.error('Failed to fetch students', error)
        }
    }

    const gradeDistribution = students.reduce((acc, student) => {
        acc[student.grade] = (acc[student.grade] || 0) + 1
        return acc
    }, {})

    const gradeData = Object.entries(gradeDistribution).map(([grade, count]) => ({ grade, count }))

    const wellnessByGrade = students.reduce((acc, student) => {
        if (!acc[student.grade]) {
            acc[student.grade] = { total: 0, count: 0 }
        }
        acc[student.grade].total += student.wellness_score
        acc[student.grade].count += 1
        return acc
    }, {})

    const wellnessData = Object.entries(wellnessByGrade).map(([grade, data]) => ({
        grade,
        avgWellness: (data.total / data.count).toFixed(1)
    }))

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Analytics Dashboard</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-lg font-semibold mb-4">Students by Grade</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={gradeData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="grade" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="count" fill="#10b981" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-lg font-semibold mb-4">Average Wellness by Grade</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={wellnessData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="grade" />
                            <YAxis domain={[0, 100]} />
                            <Tooltip />
                            <Line type="monotone" dataKey="avgWellness" stroke="#10b981" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {stats && (
                <div className="mt-6 bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-lg font-semibold mb-4">Key Metrics</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <p className="text-2xl font-bold text-green-600">{stats.total_students}</p>
                            <p className="text-sm text-gray-600">Total Students</p>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <p className="text-2xl font-bold text-green-600">{stats.avg_wellness}</p>
                            <p className="text-sm text-gray-600">Avg Wellness</p>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <p className="text-2xl font-bold text-green-600">{stats.avg_attendance}%</p>
                            <p className="text-sm text-gray-600">Avg Attendance</p>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <p className="text-2xl font-bold text-green-600">{stats.avg_exam_score}%</p>
                            <p className="text-sm text-gray-600">Avg Exam Score</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AnalyticsPage