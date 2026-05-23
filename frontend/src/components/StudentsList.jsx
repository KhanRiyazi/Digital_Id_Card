import React, { useState } from 'react';
import StudentScorePredictor from './StudentScorePredictor';

const StudentsList = ({ students }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterGrade, setFilterGrade] = useState('');
    const [filterPerformance, setFilterPerformance] = useState('');
    const [sortBy, setSortBy] = useState('name');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [showPredictor, setShowPredictor] = useState(false);

    // Get unique grades
    const grades = [...new Set(students.map(s => s.grade))];

    // Filter and sort students
    const filteredStudents = students
        .filter(student => {
            const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student.id.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesGrade = !filterGrade || student.grade === filterGrade;

            let matchesPerformance = true;
            if (filterPerformance === 'excellent') {
                matchesPerformance = (student.prediction_score || 75) >= 85;
            } else if (filterPerformance === 'good') {
                matchesPerformance = (student.prediction_score || 75) >= 70 && (student.prediction_score || 75) < 85;
            } else if (filterPerformance === 'average') {
                matchesPerformance = (student.prediction_score || 75) >= 50 && (student.prediction_score || 75) < 70;
            } else if (filterPerformance === 'needs_improvement') {
                matchesPerformance = (student.prediction_score || 75) < 50;
            }

            return matchesSearch && matchesGrade && matchesPerformance;
        })
        .sort((a, b) => {
            if (sortBy === 'name') return a.name.localeCompare(b.name);
            if (sortBy === 'score') return (b.prediction_score || 75) - (a.prediction_score || 75);
            if (sortBy === 'grade') return a.grade.localeCompare(b.grade);
            if (sortBy === 'id') return a.id.localeCompare(b.id);
            return 0;
        });

    const handleStudentClick = (student) => {
        setSelectedStudent(student);
        setShowPredictor(true);
    };

    const getScoreColor = (score) => {
        if (score >= 85) return 'text-green-600';
        if (score >= 70) return 'text-blue-600';
        if (score >= 50) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getScoreBgColor = (score) => {
        if (score >= 85) return 'bg-green-100';
        if (score >= 70) return 'bg-blue-100';
        if (score >= 50) return 'bg-yellow-100';
        return 'bg-red-100';
    };

    const getScoreStatus = (score) => {
        if (score >= 85) return { text: 'Excellent', color: 'bg-green-500', icon: '🌟' };
        if (score >= 70) return { text: 'Good', color: 'bg-blue-500', icon: '📈' };
        if (score >= 50) return { text: 'Average', color: 'bg-yellow-500', icon: '📊' };
        return { text: 'Needs Focus', color: 'bg-red-500', icon: '⚠️' };
    };

    return (
        <>
            <div className="space-y-6">
                {/* Stats Summary */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl p-4 text-white">
                        <p className="text-sm opacity-90">Total Students</p>
                        <p className="text-2xl font-bold">{students.length}</p>
                    </div>
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-4 text-white">
                        <p className="text-sm opacity-90">Average Score</p>
                        <p className="text-2xl font-bold">
                            {Math.round(students.reduce((acc, s) => acc + (s.prediction_score || 75), 0) / (students.length || 1))}%
                        </p>
                    </div>
                    <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-4 text-white">
                        <p className="text-sm opacity-90">Top Performers</p>
                        <p className="text-2xl font-bold">{students.filter(s => (s.prediction_score || 75) >= 85).length}</p>
                    </div>
                    <div className="bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl p-4 text-white">
                        <p className="text-sm opacity-90">Need Attention</p>
                        <p className="text-2xl font-bold">{students.filter(s => (s.prediction_score || 75) < 50).length}</p>
                    </div>
                </div>

                {/* Search, Filter and Sort Bar */}
                <div className="bg-white rounded-xl shadow-sm p-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="relative md:col-span-2">
                            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search by name or ID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>

                        <select
                            value={filterGrade}
                            onChange={(e) => setFilterGrade(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="">All Grades</option>
                            {grades.map(grade => (
                                <option key={grade} value={grade}>{grade}</option>
                            ))}
                        </select>

                        <select
                            value={filterPerformance}
                            onChange={(e) => setFilterPerformance(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="">All Performance</option>
                            <option value="excellent">Excellent (85%+)</option>
                            <option value="good">Good (70-84%)</option>
                            <option value="average">Average (50-69%)</option>
                            <option value="needs_improvement">Needs Improvement (&lt;50%)</option>
                        </select>

                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="name">Sort by Name</option>
                            <option value="score">Sort by Score</option>
                            <option value="grade">Sort by Grade</option>
                            <option value="id">Sort by ID</option>
                        </select>
                    </div>
                </div>

                {/* Results Count */}
                <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-500">
                        Showing {filteredStudents.length} of {students.length} students
                    </p>
                    <button
                        onClick={() => {
                            setSearchTerm('');
                            setFilterGrade('');
                            setFilterPerformance('');
                            setSortBy('name');
                        }}
                        className="text-sm text-indigo-600 hover:text-indigo-700"
                    >
                        Clear all filters
                    </button>
                </div>

                {/* Students Grid - Clickable Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredStudents.map((student, index) => {
                        const score = student.prediction_score || 75;
                        const status = getScoreStatus(score);

                        return (
                            <div
                                key={student.id}
                                onClick={() => handleStudentClick(student)}
                                className="bg-white rounded-xl shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer group transform hover:scale-105 animate-fadeIn"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                {/* Card Header with Gradient */}
                                <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-4 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
                                    <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/10 rounded-full -ml-10 -mb-10"></div>

                                    <div className="flex items-center justify-between relative z-10">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                                <span className="text-white font-bold text-lg">
                                                    {student.name.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="text-white text-xs opacity-90">Student ID</p>
                                                <p className="text-white font-mono text-sm">{student.id}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="px-2 py-1 bg-green-500/80 backdrop-blur-sm text-white text-xs rounded-full">
                                                {student.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Card Body */}
                                <div className="p-4">
                                    <h3 className="font-bold text-gray-800 text-lg mb-1 group-hover:text-indigo-600 transition-colors">
                                        {student.name}
                                    </h3>

                                    {/* Grade and Info */}
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="text-sm text-gray-500">Grade: {student.grade}</span>
                                        <span className="text-xs text-gray-400">Enrolled: {new Date(student.created_at).toLocaleDateString()}</span>
                                    </div>

                                    {/* AI Prediction Score Section */}
                                    <div className="mb-4">
                                        <div className="flex justify-between items-center mb-2">
                                            <div className="flex items-center gap-1">
                                                <span className="text-xs text-gray-500">AI Predicted Score</span>
                                                <span className="text-xs" title="AI Machine Learning Prediction">🤖</span>
                                            </div>
                                            <div className={`flex items-center gap-1 ${getScoreColor(score)} font-bold`}>
                                                <span>{status.icon}</span>
                                                <span>{score}%</span>
                                            </div>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                            <div
                                                className={`${status.color} rounded-full h-3 transition-all duration-1000 ease-out relative`}
                                                style={{ width: `${score}%` }}
                                            >
                                                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                                            </div>
                                        </div>
                                        <div className="flex justify-between mt-1">
                                            <span className="text-xs text-gray-400">Needs Focus</span>
                                            <span className="text-xs text-gray-400">Excellent</span>
                                        </div>
                                    </div>

                                    {/* Performance Badge */}
                                    <div className={`${getScoreBgColor(score)} rounded-lg p-2 mb-3`}>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-medium">Performance Level</span>
                                            <span className={`text-xs font-bold ${getScoreColor(score)}`}>
                                                {status.text}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Additional Info if available */}
                                    {(student.interests || student.goals) && (
                                        <div className="border-t border-gray-100 pt-3 mt-2">
                                            {student.interests && (
                                                <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                                                    <span>🎯 Interests:</span>
                                                    <span className="truncate">{student.interests.split(',')[0]}</span>
                                                </div>
                                            )}
                                            {student.goals && (
                                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                                    <span>🚀 Goal:</span>
                                                    <span className="truncate">{student.goals.substring(0, 40)}</span>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Click Hint */}
                                    <div className="mt-3 text-center">
                                        <div className="inline-flex items-center gap-1 text-xs text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                            Click for detailed AI analysis
                                        </div>
                                    </div>
                                </div>

                                {/* Card Footer */}
                                <div className="bg-gray-50 px-4 py-2 border-t border-gray-100">
                                    <div className="flex justify-between items-center text-xs text-gray-500">
                                        <span>Digital ID: {student.digital_id || 'Not generated'}</span>
                                        <span>🤖 AI v3.0</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* No Results */}
                {filteredStudents.length === 0 && (
                    <div className="bg-white rounded-xl shadow-sm p-12 text-center animate-fadeIn">
                        <svg className="w-20 h-20 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-gray-500 text-lg font-medium">No students found</p>
                        <p className="text-gray-400 text-sm mt-2">
                            {searchTerm || filterGrade || filterPerformance
                                ? "Try adjusting your search filters"
                                : "Register a new student to get started"}
                        </p>
                        {(searchTerm || filterGrade || filterPerformance) && (
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    setFilterGrade('');
                                    setFilterPerformance('');
                                }}
                                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Student Score Predictor Modal */}
            {showPredictor && selectedStudent && (
                <StudentScorePredictor
                    student={selectedStudent}
                    onClose={() => {
                        setShowPredictor(false);
                        setSelectedStudent(null);
                    }}
                    onPredict={(prediction) => {
                        console.log('Prediction generated for:', selectedStudent.name, prediction);
                    }}
                />
            )}

            {/* Add animation styles */}
            <style>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.5s ease-out forwards;
                    opacity: 0;
                }
            `}</style>
        </>
    );
};

export default StudentsList;