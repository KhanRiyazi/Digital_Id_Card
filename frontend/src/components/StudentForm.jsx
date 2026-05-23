import React, { useState } from 'react';

const StudentForm = ({ onSubmit }) => {
    const [formData, setFormData] = useState({
        name: '',
        studentId: '',
        grade: '',
        aadharNumber: '',
        enrollmentNumber: '',
        rollNumber: '',
        parentsName: '',
        parentsContact: '',
        interests: '',
        goals: '',
        address: '',
        bloodGroup: '',
        dateOfBirth: '',
        email: '',
        phone: ''
    });
    const [photo, setPhoto] = useState(null);
    const [preview, setPreview] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [errors, setErrors] = useState({});

    const validateStep = () => {
        const newErrors = {};

        if (currentStep === 1) {
            if (!formData.name.trim()) newErrors.name = 'Name is required';
            if (!formData.studentId.trim()) newErrors.studentId = 'Student ID is required';
            if (!formData.grade) newErrors.grade = 'Grade is required';
            if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
            if (!formData.bloodGroup) newErrors.bloodGroup = 'Blood group is required';
        }
        else if (currentStep === 2) {
            if (!formData.aadharNumber.trim()) newErrors.aadharNumber = 'Aadhar number is required';
            if (formData.aadharNumber.length !== 12 && formData.aadharNumber.length > 0) {
                newErrors.aadharNumber = 'Aadhar must be 12 digits';
            }
            if (!formData.enrollmentNumber.trim()) newErrors.enrollmentNumber = 'Enrollment number is required';
            if (!formData.rollNumber.trim()) newErrors.rollNumber = 'Roll number is required';
        }
        else if (currentStep === 3) {
            if (!formData.parentsName.trim()) newErrors.parentsName = "Parent's name is required";
            if (!formData.parentsContact.trim()) newErrors.parentsContact = "Parent's contact is required";
            if (formData.parentsContact.length !== 10 && formData.parentsContact.length > 0) {
                newErrors.parentsContact = 'Contact must be 10 digits';
            }
        }
        else if (currentStep === 5) {
            if (!photo) newErrors.photo = 'Student photo is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: '' });
        }
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
            if (!validTypes.includes(file.type)) {
                setErrors({ ...errors, photo: 'Please upload a valid image file (JPEG, PNG, WEBP)' });
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                setErrors({ ...errors, photo: 'Photo must be less than 5MB' });
                return;
            }

            setPhoto(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
            if (errors.photo) setErrors({ ...errors, photo: '' });
        }
    };

    const nextStep = () => {
        if (validateStep()) {
            setCurrentStep(currentStep + 1);
            setErrors({});
            // Scroll to top of form
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const prevStep = () => {
        setCurrentStep(currentStep - 1);
        setErrors({});
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (currentStep === 5) {
            if (validateStep()) {
                setSubmitting(true);
                try {
                    await onSubmit(formData, photo);
                } catch (error) {
                    console.error('Submission error:', error);
                    setErrors({ submit: 'Failed to submit form. Please try again.' });
                } finally {
                    setSubmitting(false);
                }
            }
        }
    };

    const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
    const grades = ['9th Grade', '10th Grade', '11th Grade', '12th Grade'];

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* Progress Bar */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6">
                    <h2 className="text-2xl font-bold text-white">Student Registration</h2>
                    <p className="text-indigo-200 mt-1">Complete all details to generate Digital ID Card</p>
                    <div className="mt-4 flex items-center space-x-2">
                        {[1, 2, 3, 4, 5].map((step) => (
                            <div
                                key={step}
                                className="flex-1 cursor-pointer"
                                onClick={() => {
                                    if (step <= currentStep) {
                                        setCurrentStep(step);
                                        setErrors({});
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }
                                }}
                            >
                                <div className={`h-2 rounded-full transition-all duration-300 ${step <= currentStep ? 'bg-white' : 'bg-white/30'}`} />
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-white/80">
                        <span>Basic Info</span>
                        <span>Academic</span>
                        <span>Parents</span>
                        <span>Interests</span>
                        <span>Photo</span>
                    </div>
                </div>

                {/* Global Error Message */}
                {errors.submit && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 m-4 rounded">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-red-700">{errors.submit}</p>
                            </div>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="p-8">
                        {/* Step 1: Basic Information */}
                        {currentStep === 1 && (
                            <div className="space-y-6 animate-fadeIn">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">📋 Basic Information</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Full Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                                            placeholder="Enter student's full name"
                                        />
                                        {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Student ID <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="studentId"
                                            value={formData.studentId}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${errors.studentId ? 'border-red-500' : 'border-gray-300'}`}
                                            placeholder="Enter unique student ID"
                                        />
                                        {errors.studentId && <p className="mt-1 text-sm text-red-500">{errors.studentId}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Grade/Year <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            name="grade"
                                            value={formData.grade}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${errors.grade ? 'border-red-500' : 'border-gray-300'}`}
                                        >
                                            <option value="">Select Grade</option>
                                            {grades.map(grade => (
                                                <option key={grade} value={grade}>{grade}</option>
                                            ))}
                                        </select>
                                        {errors.grade && <p className="mt-1 text-sm text-red-500">{errors.grade}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Date of Birth <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            name="dateOfBirth"
                                            value={formData.dateOfBirth}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'}`}
                                        />
                                        {errors.dateOfBirth && <p className="mt-1 text-sm text-red-500">{errors.dateOfBirth}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Blood Group <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            name="bloodGroup"
                                            value={formData.bloodGroup}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${errors.bloodGroup ? 'border-red-500' : 'border-gray-300'}`}
                                        >
                                            <option value="">Select Blood Group</option>
                                            {bloodGroups.map(bg => (
                                                <option key={bg} value={bg}>{bg}</option>
                                            ))}
                                        </select>
                                        {errors.bloodGroup && <p className="mt-1 text-sm text-red-500">{errors.bloodGroup}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                            placeholder="student@example.com"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Academic Details */}
                        {currentStep === 2 && (
                            <div className="space-y-6 animate-fadeIn">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">🎓 Academic Details</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Aadhar Card Number <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="aadharNumber"
                                            value={formData.aadharNumber}
                                            onChange={handleChange}
                                            maxLength="12"
                                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${errors.aadharNumber ? 'border-red-500' : 'border-gray-300'}`}
                                            placeholder="12-digit Aadhar number"
                                        />
                                        {errors.aadharNumber && <p className="mt-1 text-sm text-red-500">{errors.aadharNumber}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Enrollment Number <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="enrollmentNumber"
                                            value={formData.enrollmentNumber}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${errors.enrollmentNumber ? 'border-red-500' : 'border-gray-300'}`}
                                            placeholder="University enrollment number"
                                        />
                                        {errors.enrollmentNumber && <p className="mt-1 text-sm text-red-500">{errors.enrollmentNumber}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Roll Number <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="rollNumber"
                                            value={formData.rollNumber}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${errors.rollNumber ? 'border-red-500' : 'border-gray-300'}`}
                                            placeholder="Class roll number"
                                        />
                                        {errors.rollNumber && <p className="mt-1 text-sm text-red-500">{errors.rollNumber}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            maxLength="10"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                            placeholder="Student's mobile number"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Parent/Guardian Details */}
                        {currentStep === 3 && (
                            <div className="space-y-6 animate-fadeIn">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">👨‍👩‍👧 Parent/Guardian Details</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Parent/Guardian Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="parentsName"
                                            value={formData.parentsName}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${errors.parentsName ? 'border-red-500' : 'border-gray-300'}`}
                                            placeholder="Father/Mother/Guardian name"
                                        />
                                        {errors.parentsName && <p className="mt-1 text-sm text-red-500">{errors.parentsName}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Parent/Guardian Contact <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            name="parentsContact"
                                            value={formData.parentsContact}
                                            onChange={handleChange}
                                            maxLength="10"
                                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${errors.parentsContact ? 'border-red-500' : 'border-gray-300'}`}
                                            placeholder="10-digit mobile number"
                                        />
                                        {errors.parentsContact && <p className="mt-1 text-sm text-red-500">{errors.parentsContact}</p>}
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Residential Address
                                        </label>
                                        <textarea
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            rows="3"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                            placeholder="Complete address"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 4: Interests & Goals */}
                        {currentStep === 4 && (
                            <div className="space-y-6 animate-fadeIn">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">🎯 Interests & Career Goals</h3>

                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                                    <div className="flex items-start gap-2">
                                        <span className="text-blue-500 text-xl">✨</span>
                                        <p className="text-sm text-blue-800">These fields are optional but help us provide better AI-powered career recommendations!</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Areas of Interest
                                        </label>
                                        <textarea
                                            name="interests"
                                            value={formData.interests}
                                            onChange={handleChange}
                                            rows="3"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                            placeholder="e.g., Programming, Robotics, Sports, Arts, Music, Science..."
                                        />
                                        <p className="text-xs text-gray-500 mt-1">💡 List all areas of interest separated by commas</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Career Goals & Aspirations
                                        </label>
                                        <textarea
                                            name="goals"
                                            value={formData.goals}
                                            onChange={handleChange}
                                            rows="3"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                            placeholder="e.g., Become a Software Engineer, Doctor, Entrepreneur..."
                                        />
                                        <p className="text-xs text-gray-500 mt-1">🚀 Describe short-term and long-term career goals</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 5: Photo Upload */}
                        {currentStep === 5 && (
                            <div className="space-y-6 animate-fadeIn">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">📸 Student Photo</h3>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Upload Photograph <span className="text-red-500">*</span>
                                    </label>
                                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-indigo-500 transition-colors">
                                        <div className="space-y-1 text-center">
                                            {preview ? (
                                                <div>
                                                    <img src={preview} alt="Preview" className="mx-auto h-40 w-40 object-cover rounded-lg shadow-md" />
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setPhoto(null);
                                                            setPreview(null);
                                                            if (errors.photo) {
                                                                const newErrors = { ...errors };
                                                                delete newErrors.photo;
                                                                setErrors(newErrors);
                                                            }
                                                        }}
                                                        className="mt-2 text-sm text-red-600 hover:text-red-700 font-medium"
                                                    >
                                                        Remove photo
                                                    </button>
                                                </div>
                                            ) : (
                                                <>
                                                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                    <div className="flex text-sm text-gray-600">
                                                        <label htmlFor="photo" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500">
                                                            <span>Upload a photo</span>
                                                            <input
                                                                id="photo"
                                                                name="photo"
                                                                type="file"
                                                                accept="image/jpeg,image/png,image/jpg,image/webp"
                                                                onChange={handlePhotoChange}
                                                                className="sr-only"
                                                            />
                                                        </label>
                                                        <p className="pl-1">or drag and drop</p>
                                                    </div>
                                                    <p className="text-xs text-gray-500">PNG, JPG, WEBP up to 5MB</p>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    {errors.photo && <p className="mt-1 text-sm text-red-500">{errors.photo}</p>}
                                </div>

                                {/* Preview Info */}
                                {!preview && (
                                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                                        <p className="text-xs text-gray-500">📷 A clear passport-size photo works best for ID cards</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Form Actions */}
                    <div className="px-8 py-4 bg-gray-50 border-t flex justify-between">
                        {currentStep > 1 && (
                            <button
                                type="button"
                                onClick={prevStep}
                                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2"
                            >
                                ← Previous
                            </button>
                        )}

                        {currentStep < 5 ? (
                            <button
                                type="button"
                                onClick={nextStep}
                                className="ml-auto px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center gap-2"
                            >
                                Next Step
                                <span>→</span>
                            </button>
                        ) : (
                            <button
                                type="submit"
                                disabled={submitting}
                                className="ml-auto px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all disabled:opacity-50 flex items-center gap-2"
                            >
                                {submitting ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Generating ID Card...
                                    </>
                                ) : (
                                    <>
                                        🎫 Generate Digital ID Card
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </form>
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

export default StudentForm;