import React, { useState, useEffect } from 'react'
import { Search, Eye, Download } from 'lucide-react'
import api from '../api'

const StudentsPage = () => {
    const [students, setStudents] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedStudent, setSelectedStudent] = useState(null)

    useEffect(() => {
        fetchStudents()
    }, [])

    const fetchStudents = async () => {
        try {
            const response = await api.get('/prediction/students')
            setStudents(response.data)
        } catch (error) {
            console.error('Failed to fetch students', error)
        }
    }

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.student_id.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const getRiskBadge = (risk) => {
        const styles = {
            'Excellent': 'bg-green-100 text-green-800',
            'Moderate': 'bg-yellow-100 text-yellow-800',
            'At Risk': 'bg-orange-100 text-orange-800',
            'Critical': 'bg-red-100 text-red-800'
        }
        return styles[risk] || 'bg-gray-100 text-gray-800'
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Student Records</h1>

            {/* Search Bar */}
            <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Search by name or ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
            </div>

            {/* Students Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Wellness Score</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Level</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredStudents.map((student) => (
                            <tr key={student.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-sm font-mono">{student.student_id}</td>
                                <td className="px-6 py-4 text-sm font-medium">{student.name}</td>
                                <td className="px-6 py-4 text-sm">{student.grade}</td>
                                <td className="px-6 py-4 text-sm font-semibold">{student.wellness_score}/100</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs rounded-full ${getRiskBadge(student.risk_level)}`}>
                                        {student.risk_level}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <button className="text-green-600 hover:text-green-800">
                                        <Eye size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default StudentsPage