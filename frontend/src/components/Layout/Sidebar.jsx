import React from 'react'
import { NavLink } from 'react-router-dom'
import {
    LayoutDashboard,
    Brain,
    Users,
    BarChart3,
    Menu,
    X,
    GraduationCap
} from 'lucide-react'

const Sidebar = ({ isOpen, setIsOpen }) => {
    const navItems = [
        { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/predict', icon: Brain, label: 'Predict Welfare' },
        { path: '/students', icon: Users, label: 'Students' },
        { path: '/analytics', icon: BarChart3, label: 'Analytics' },
    ]

    return (
        <div className={`${isOpen ? 'w-64' : 'w-20'} bg-gray-900 text-white transition-all duration-300 flex flex-col`}>
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
                {isOpen && (
                    <div className="flex items-center gap-2">
                        <GraduationCap className="h-8 w-8 text-green-400" />
                        <span className="font-bold text-lg">EduCare Pro</span>
                    </div>
                )}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-1 rounded-lg hover:bg-gray-700 transition"
                >
                    {isOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>

            <nav className="flex-1 mt-6">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 mx-2 my-1 rounded-lg transition ${isActive
                                ? 'bg-green-600 text-white'
                                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                            }`
                        }
                    >
                        <item.icon size={20} />
                        {isOpen && <span>{item.label}</span>}
                    </NavLink>
                ))}
            </nav>

            {isOpen && (
                <div className="p-4 border-t border-gray-700 text-xs text-gray-400">
                    <p>Principal Dashboard</p>
                    <p className="mt-1">AI-Powered Welfare Prediction</p>
                </div>
            )}
        </div>
    )
}

export default Sidebar