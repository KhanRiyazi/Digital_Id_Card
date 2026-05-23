import React, { useState } from 'react';

const Settings = () => {
    const [settings, setSettings] = useState({
        notifications: true,
        autoSave: true,
        darkMode: false,
        language: 'en'
    });

    const toggleSetting = (key) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
                    <h2 className="text-xl font-bold text-white">System Settings</h2>
                    <p className="text-indigo-200 text-sm">Configure your application preferences</p>
                </div>

                <div className="p-6 space-y-6">
                    {/* Notification Settings */}
                    <div className="border-b border-gray-200 pb-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold text-gray-800">Notifications</h3>
                                <p className="text-sm text-gray-500">Receive email notifications for student activities</p>
                            </div>
                            <button
                                onClick={() => toggleSetting('notifications')}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${settings.notifications ? 'bg-indigo-600' : 'bg-gray-300'
                                    }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.notifications ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                />
                            </button>
                        </div>
                    </div>

                    {/* Auto Save */}
                    <div className="border-b border-gray-200 pb-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold text-gray-800">Auto Save</h3>
                                <p className="text-sm text-gray-500">Automatically save form data</p>
                            </div>
                            <button
                                onClick={() => toggleSetting('autoSave')}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${settings.autoSave ? 'bg-indigo-600' : 'bg-gray-300'
                                    }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.autoSave ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                />
                            </button>
                        </div>
                    </div>

                    {/* Dark Mode */}
                    <div className="border-b border-gray-200 pb-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold text-gray-800">Dark Mode</h3>
                                <p className="text-sm text-gray-500">Switch between light and dark theme</p>
                            </div>
                            <button
                                onClick={() => toggleSetting('darkMode')}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${settings.darkMode ? 'bg-indigo-600' : 'bg-gray-300'
                                    }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.darkMode ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                />
                            </button>
                        </div>
                    </div>

                    {/* Language Selection */}
                    <div>
                        <h3 className="font-semibold text-gray-800 mb-2">Language</h3>
                        <select
                            value={settings.language}
                            onChange={(e) => setSettings(prev => ({ ...prev, language: e.target.value }))}
                            className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="en">English</option>
                            <option value="es">Spanish</option>
                            <option value="fr">French</option>
                            <option value="de">German</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* System Info */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="font-semibold text-gray-800 mb-4">System Information</h3>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-500">Version</span>
                        <span className="font-medium text-gray-800">2.0.0</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-500">Last Updated</span>
                        <span className="font-medium text-gray-800">2026-05-23</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-500">API Status</span>
                        <span className="text-green-600 font-medium">Connected</span>
                    </div>
                    <div className="flex justify-between py-2">
                        <span className="text-gray-500">OpenCV Status</span>
                        <span className="text-green-600 font-medium">Available</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;