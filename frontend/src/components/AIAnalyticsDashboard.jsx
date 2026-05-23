import React, { useState, useEffect } from 'react';
import {
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';

const AIAnalyticsDashboard = ({ studentId, predictions, studyPlan, careerPathways }) => {
    const [activeTab, setActiveTab] = useState('performance');

    // Prepare data for charts
    const subjectData = predictions?.subject_wise_predictions
        ? Object.entries(predictions.subject_wise_predictions).map(([subject, score]) => ({
            subject: subject.split(' ')[0],
            score: score,
            fullName: subject
        }))
        : [];

    const performanceData = [
        { name: 'Current', score: predictions?.overall_predicted_score || 70 },
        { name: 'Target (1 mo)', score: Math.min(100, (predictions?.overall_predicted_score || 70) + 10) },
        { name: 'Target (3 mo)', score: Math.min(100, (predictions?.overall_predicted_score || 70) + 15) },
        { name: 'Target (6 mo)', score: Math.min(100, (predictions?.overall_predicted_score || 70) + 20) },
    ];

    const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316', '#10b981'];

    return (
        <div className="space-y-6">
            {/* Tab Navigation */}
            <div className="flex space-x-2 border-b border-gray-200">
                {[
                    { id: 'performance', label: 'Performance Analytics', icon: '📊' },
                    { id: 'subjects', label: 'Subject Analysis', icon: '📚' },
                    { id: 'improvement', label: 'Improvement Plan', icon: '🎯' },
                    { id: 'career', label: 'Career Pathways', icon: '🚀' }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-2 font-medium transition-all ${activeTab === tab.id
                                ? 'text-indigo-600 border-b-2 border-indigo-600'
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <span className="mr-2">{tab.icon}</span>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Performance Analytics Tab */}
            {activeTab === 'performance' && (
                <div className="space-y-6">
                    {/* Key Metrics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg p-4 text-white">
                            <p className="text-sm opacity-90">Predicted Score</p>
                            <p className="text-3xl font-bold">{predictions?.overall_predicted_score || 70}%</p>
                            <p className="text-xs mt-1">Confidence: {(predictions?.prediction_confidence || 0.85) * 100}%</p>
                        </div>
                        <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg p-4 text-white">
                            <p className="text-sm opacity-90">Performance Level</p>
                            <p className="text-xl font-bold">{predictions?.performance_level || 'Analyzing...'}</p>
                        </div>
                        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-lg p-4 text-white">
                            <p className="text-sm opacity-90">Study Hours Needed</p>
                            <p className="text-3xl font-bold">{studyPlan?.daily_study_hours?.total_daily_hours || 5} hrs</p>
                        </div>
                        <div className="bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg p-4 text-white">
                            <p className="text-sm opacity-90">Learning Style</p>
                            <p className="text-lg font-bold">{predictions?.learning_style || 'Mixed Learner'}</p>
                        </div>
                    </div>

                    {/* Performance Trend Chart */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Performance Improvement Trajectory</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={performanceData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis domain={[0, 100]} />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={3} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Feature Importance */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">ML Model Feature Importance</h3>
                        <div className="space-y-3">
                            {Object.entries(predictions?.feature_importance || {}).map(([feature, weight]) => (
                                <div key={feature}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-600 capitalize">{feature.replace('_', ' ')}</span>
                                        <span className="text-indigo-600 font-semibold">{(weight * 100).toFixed(0)}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full"
                                            style={{ width: `${weight * 100}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Subject Analysis Tab */}
            {activeTab === 'subjects' && (
                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Subject-wise Performance Prediction</h3>
                        <ResponsiveContainer width="100%" height={400}>
                            <BarChart data={subjectData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="subject" />
                                <YAxis domain={[0, 100]} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="score" fill="#6366f1" radius={[10, 10, 0, 0]}>
                                    {subjectData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.score < 60 ? '#ef4444' : entry.score < 75 ? '#f59e0b' : '#10b981'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Study Hours Breakdown */}
                    {studyPlan?.daily_study_hours?.subject_breakdown && (
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Recommended Study Hours Distribution</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={Object.entries(studyPlan.daily_study_hours.subject_breakdown).map(([subject, hours]) => ({
                                            name: subject.split(' ')[0],
                                            value: hours
                                        }))}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {Object.entries(studyPlan.daily_study_hours.subject_breakdown).map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>
            )}

            {/* Improvement Plan Tab */}
            {activeTab === 'improvement' && (
                <div className="space-y-6">
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl shadow-lg p-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">🎯 Personalized Improvement Plan</h3>
                        <p className="text-gray-600 mb-4">{predictions?.improvement_needed || 'Focus on maintaining excellence'}</p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white rounded-lg p-4">
                                <h4 className="font-semibold text-indigo-600 mb-3">Immediate Actions</h4>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li>✓ Complete pending assignments</li>
                                    <li>✓ Review weak concepts daily</li>
                                    <li>✓ Take practice quizzes</li>
                                </ul>
                            </div>
                            <div className="bg-white rounded-lg p-4">
                                <h4 className="font-semibold text-indigo-600 mb-3">Weekly Goals</h4>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li>✓ 5 practice tests per week</li>
                                    <li>✓ Revise 2 chapters daily</li>
                                    <li>✓ Attend doubt clearing sessions</li>
                                </ul>
                            </div>
                            <div className="bg-white rounded-lg p-4">
                                <h4 className="font-semibold text-indigo-600 mb-3">Monthly Targets</h4>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li>✓ Improve score by 10-15%</li>
                                    <li>✓ Master difficult topics</li>
                                    <li>✓ Maintain 90% attendance</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Learning Resources */}
                    {studyPlan?.recommended_resources && studyPlan.recommended_resources.length > 0 && (
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">📚 Recommended Learning Resources</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {studyPlan.recommended_resources.map((resource, idx) => (
                                    <div key={idx} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                        <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                                            <span className="text-indigo-600">📖</span>
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-800">{resource.name}</p>
                                            <p className="text-xs text-gray-500">{resource.type} • {resource.priority} Priority</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Career Pathways Tab */}
            {activeTab === 'career' && careerPathways && careerPathways.length > 0 && (
                <div className="space-y-6">
                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl shadow-lg p-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">🚀 AI-Powered Career Recommendations</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {careerPathways.map((career, idx) => (
                                <div key={idx} className="bg-white rounded-lg p-6 hover:shadow-xl transition-shadow">
                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4">
                                            {idx === 0 ? '🎯' : idx === 1 ? '📈' : '💡'}
                                        </div>
                                        <h4 className="text-lg font-bold text-gray-800 mb-2">{career.field}</h4>
                                        <div className="mb-3">
                                            <div className="text-sm text-gray-500">Match Probability</div>
                                            <div className="text-2xl font-bold text-indigo-600">{career.probability}%</div>
                                        </div>
                                        <div className="text-sm text-gray-600 mb-3">
                                            <span className="font-semibold">Avg Salary:</span> {career.average_salary}
                                        </div>
                                        <div className="text-left">
                                            <p className="text-sm font-semibold text-gray-700 mb-2">Required Skills:</p>
                                            <div className="flex flex-wrap gap-1">
                                                {career.required_skills.slice(0, 3).map((skill, i) => (
                                                    <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recommended Course Pathway</h3>
                        <div className="space-y-3">
                            {careerPathways[0]?.recommended_courses?.map((course, idx) => (
                                <div key={idx} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-sm">
                                        {idx + 1}
                                    </div>
                                    <span className="text-gray-700">{course}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AIAnalyticsDashboard;