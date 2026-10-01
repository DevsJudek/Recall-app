// src/pages/EditProfile.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useSound } from '../contexts/SoundContext'; // 🚀 IMPORT CONTEXT

const OAU_DEPARTMENTS = [
    { name: "Accounting", duration: 4 }, { name: "Adult Education", duration: 4 }, { name: "Aerospace Engineering", duration: 5 }, { name: "Agricultural & Environmental Engineering", duration: 5 }, { name: "Agricultural Economics", duration: 5 }, { name: "Agricultural Extension & Rural Development", duration: 5 }, { name: "Animal Sciences", duration: 5 }, { name: "Applied Geophysics", duration: 4 }, { name: "Architecture", duration: 4 }, { name: "Biochemistry", duration: 4 }, { name: "Botany", duration: 4 }, { name: "Broadcast Journalism", duration: 4 }, { name: "Building", duration: 5 }, { name: "Business Administration", duration: 4 }, { name: "Chemical Engineering", duration: 5 }, { name: "Chemistry", duration: 4 }, { name: "Civil Engineering", duration: 5 }, { name: "Computer Education", duration: 4 }, { name: "Computer Engineering", duration: 5 }, { name: "Computer Science with Economics", duration: 4 }, { name: "Computer Science with Mathematics", duration: 4 }, { name: "Crop Production & Protection", duration: 5 }, { name: "Cybersecurity", duration: 4 }, { name: "Demography and Social Statistics", duration: 4 }, { name: "Dentistry", duration: 6 }, { name: "Dramatic Arts", duration: 4 }, { name: "Early Childhood & Primary Education", duration: 4 }, { name: "Economics", duration: 4 }, { name: "Education Agricultural Science", duration: 4 }, { name: "Education Biology", duration: 4 }, { name: "Education Chemistry", duration: 4 }, { name: "Education Economics", duration: 4 }, { name: "Education English", duration: 4 }, { name: "Education Fine Arts", duration: 4 }, { name: "Education French", duration: 4 }, { name: "Education Geography", duration: 4 }, { name: "Education History", duration: 4 }, { name: "Education Home Economics", duration: 4 }, { name: "Education Mathematics", duration: 4 }, { name: "Education Music", duration: 4 }, { name: "Education Physics", duration: 4 }, { name: "Education Political Science", duration: 4 }, { name: "Education Religious Studies", duration: 4 }, { name: "Education Social Studies", duration: 4 }, { name: "Education Yoruba", duration: 4 }, { name: "Educational Management", duration: 4 }, { name: "Educational Technology", duration: 4 }, { name: "Electronic & Electrical Engineering", duration: 5 }, { name: "Engineering Physics", duration: 4 }, { name: "English Language", duration: 4 }, { name: "Entrepreneurship", duration: 4 }, { name: "Estate Management", duration: 5 }, { name: "Family Nutrition & Consumer Science", duration: 4 }, { name: "Film Production", duration: 4 }, { name: "Fine & Applied Arts", duration: 4 }, { name: "Food Science & Technology", duration: 5 }, { name: "Forestry & Wild Life", duration: 5 }, { name: "French", duration: 4 }, { name: "Geography", duration: 4 }, { name: "Geology", duration: 4 }, { name: "German", duration: 4 }, { name: "Guidance and Counselling", duration: 4 }, { name: "Health Education", duration: 4 }, { name: "History", duration: 4 }, { name: "Human Kinetics Education", duration: 4 }, { name: "Human Nutrition & Dietetics", duration: 4 }, { name: "Industrial Chemistry", duration: 4 }, { name: "Information and Communication Technology", duration: 4 }, { name: "Information Science and Media Studies", duration: 4 }, { name: "Information System", duration: 4 }, { name: "International Relations", duration: 4 }, { name: "Language & Communication Arts", duration: 4 }, { name: "Law", duration: 5 }, { name: "Library and Information Science", duration: 4 }, { name: "Linguistics", duration: 4 }, { name: "Literature-in-English", duration: 4 }, { name: "Local Government & Development Studies", duration: 4 }, { name: "Mass Communication", duration: 4 }, { name: "Materials Science & Engineering", duration: 5 }, { name: "Mathematics", duration: 4 }, { name: "Mathematics/Integrated Science", duration: 4 }, { name: "Mechanical Engineering", duration: 5 }, { name: "Medical Rehabilitation", duration: 5 }, { name: "Medicine & Surgery", duration: 6 }, { name: "Microbiology", duration: 4 }, { name: "Music", duration: 4 }, { name: "Nursing Science", duration: 5 }, { name: "Pharmacy", duration: 6 }, { name: "Philosophy", duration: 4 }, { name: "Physical and Health Education", duration: 4 }, { name: "Physics", duration: 4 }, { name: "Political Sciences", duration: 4 }, { name: "Portuguese", duration: 4 }, { name: "Psychology", duration: 4 }, { name: "Public Administration", duration: 4 }, { name: "Quantity Surveying", duration: 5 }, { name: "Religious Studies", duration: 4 }, { name: "Science Laboratory Technology", duration: 4 }, { name: "Sociology and Anthropology", duration: 4 }, { name: "Software Engineering", duration: 4 }, { name: "Soil and Land Resources Management", duration: 5 }, { name: "Statistics", duration: 4 }, { name: "Surveying & Geoinformatics", duration: 5 }, { name: "Urban & Regional Planning", duration: 5 }, { name: "Yoruba", duration: 4 }, { name: "Zoology", duration: 4 }
];

function SearchableDropdown({ options, value, onChange, placeholder, inputClassName }) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const wrapperRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false); setSearch('');
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filtered = options.filter(opt => opt.name.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="relative w-full" ref={wrapperRef}>
            <input
                type="text"
                value={isOpen ? search : value}
                onChange={(e) => { setSearch(e.target.value); setIsOpen(true); }}
                onFocus={() => { setSearch(''); setIsOpen(true); }}
                placeholder={placeholder || "Search..."}
                className={inputClassName}
            />
            <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path></svg>
            </div>
            {isOpen && (
                <div className="absolute z-50 w-full mt-2 bg-white dark:bg-[#1A1A1A] border border-gray-100 dark:border-gray-800 rounded-xl shadow-lg max-h-64 overflow-y-auto">
                    {filtered.length > 0 ? filtered.map((opt, i) => (
                        <div
                            key={i}
                            onClick={() => { onChange(opt.name); setIsOpen(false); setSearch(''); }}
                            className="px-4 py-3 hover:bg-[#FFF5F0] dark:hover:bg-gray-800 hover:text-[#FF6B00] cursor-pointer text-xs md:text-sm font-bold text-[#1A1A1A] dark:text-white transition-colors border-b border-gray-50 dark:border-gray-800 last:border-0"
                        >
                            {opt.name}
                        </div>
                    )) : (
                        <div className="px-4 py-3 text-xs md:text-sm text-gray-400 font-medium text-center">No departments found</div>
                    )}
                </div>
            )}
        </div>
    );
}

export default function EditProfile({
    setCurrentView, handleSaveProfile, isUploading,
    editName, setEditName, editDepartment, setEditDepartment,
    editLevel, setEditLevel, editAvatarUrl, setEditAvatarUrl, handleImageUpload,
    handleSignOut, editBio, setEditBio, session,
    isDarkMode, setIsDarkMode
}) {
    // 🚀 USE CONTEXT FOR SOUNDS
    const { isSoundEnabled, setIsSoundEnabled } = useSound();

    const [isSaving, setIsSaving] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const userEmail = session?.user?.email || 'Loading email...';

    const selectedDept = OAU_DEPARTMENTS.find(d => d.name === editDepartment);
    const duration = selectedDept ? selectedDept.duration : 4;
    const activeLevels = Array.from({ length: duration }, (_, i) => `${(i + 1) * 100}L`);

    useEffect(() => {
        const currentLvlNum = parseInt(editLevel.replace('L', ''));
        if (currentLvlNum > duration * 100) {
            setEditLevel(`${duration * 100}L`);
        }
    }, [editDepartment, duration, editLevel, setEditLevel]);

    const onSaveClick = async () => {
        setIsSaving(true);
        await handleSaveProfile();
        setIsSaving(false);
    };

    const handleForceUpdate = () => {
        setIsUpdating(true);
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistrations().then((registrations) => {
                for (let registration of registrations) registration.unregister();
            });
        }
        if ('caches' in window) {
            caches.keys().then((names) => {
                for (let name of names) caches.delete(name);
            });
        }
        setTimeout(() => {
            window.location.href = window.location.origin + '?updated=true';
        }, 500);
    };

    return (
        <div className="max-w-4xl mx-auto py-6 px-4 md:px-8 relative animate-fade-in pb-24">
            <div className="flex justify-between items-center mb-8">
                <button
                    onClick={() => setCurrentView('profile')}
                    className="w-8 h-8 md:w-10 md:h-10 bg-white dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-gray-800 rounded-full flex items-center justify-center font-bold text-[#1A1A1A] dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 shadow-sm transition-colors text-sm md:text-base"
                >
                    ✕
                </button>

                <button
                    onClick={onSaveClick}
                    disabled={isUploading || isSaving}
                    className="flex items-center gap-2 px-4 py-[14px] md:px-6 md:py-[18px] bg-[#FF6B00] text-white text-xs md:text-sm font-bold rounded-xl shadow-md shadow-[#FF6B00]/20 hover:bg-[#E05D00] transition-all active:scale-95 disabled:opacity-70"
                >
                    {(isUploading || isSaving) && (
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    )}
                    {isUploading ? 'Uploading...' : isSaving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            <div className="bg-white dark:bg-[#121212] border border-[#E5E5E5] dark:border-gray-800 rounded-[24px] md:rounded-[32px] p-6 md:p-12 shadow-sm mb-6 flex flex-col md:flex-row gap-10 md:gap-16">
                <div className="flex flex-col items-center md:w-1/3 shrink-0">
                    <div className="relative mb-4">
                        <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-gradient-to-br from-[#FFD5C2] to-[#FF6B00] border-4 border-white dark:border-[#121212] shadow-md overflow-hidden flex items-center justify-center text-white text-4xl font-black">
                            {editAvatarUrl && editAvatarUrl.startsWith('http') ? (
                                <img src={editAvatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                editName ? editName.charAt(0).toUpperCase() : 'S'
                            )}
                        </div>
                        <label className="absolute bottom-1 right-1 w-8 h-8 md:w-10 md:h-10 bg-[#FF6B00] border-2 border-white dark:border-[#121212] rounded-full flex items-center justify-center cursor-pointer shadow-md hover:scale-105 transition-transform text-white text-sm md:text-base z-10">
                            ✏️<input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isUploading} />
                        </label>
                        {editAvatarUrl && editAvatarUrl.startsWith('http') && (
                            <button
                                onClick={() => setEditAvatarUrl(null)}
                                className="absolute bottom-1 left-1 w-8 h-8 md:w-10 md:h-10 bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-900 rounded-full flex items-center justify-center cursor-pointer shadow-md hover:scale-105 transition-transform text-red-500 text-sm md:text-base z-10"
                                title="Remove Avatar"
                            >
                                🗑️
                            </button>
                        )}
                    </div>
                    <h3 className="text-lg md:text-xl font-black text-[#1A1A1A] dark:text-white text-center">{editName || 'Student'}</h3>
                    <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest text-center mt-1">{editDepartment || 'Law'}</p>
                </div>

                <div className="md:w-2/3 flex flex-col gap-6 w-full">
                    <div>
                        <label className="block text-[10px] md:text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-2">Username</label>
                        <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="w-full bg-[#F8F9FA] dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-gray-800 rounded-xl px-4 py-3 md:px-5 md:py-4 text-sm font-bold text-[#1A1A1A] dark:text-white focus:outline-none focus:border-[#FF6B00] transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] md:text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-2">Bio</label>
                        <textarea
                            value={editBio}
                            onChange={(e) => setEditBio(e.target.value)}
                            placeholder="Tell us about your academic interests..."
                            className="w-full bg-[#F8F9FA] dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-gray-800 rounded-xl px-4 py-3 md:px-5 md:py-4 text-sm font-bold text-[#1A1A1A] dark:text-white focus:outline-none focus:border-[#FF6B00] transition-colors resize-none h-24"
                        />
                    </div>
                    <div className="relative z-50">
                        <label className="block text-[10px] md:text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-2">Department</label>
                        <SearchableDropdown
                            options={OAU_DEPARTMENTS}
                            value={editDepartment}
                            onChange={setEditDepartment}
                            placeholder="Search your department..."
                            inputClassName="w-full bg-[#F8F9FA] dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-gray-800 rounded-xl px-4 py-3 md:px-5 md:py-4 text-sm font-bold text-[#1A1A1A] dark:text-white focus:outline-none focus:border-[#FF6B00] transition-colors cursor-text"
                        />
                    </div>
                    <div className="relative z-0">
                        <label className="block text-[10px] md:text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-2">Academic Level</label>
                        <div className="bg-[#F8F9FA] dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-gray-800 rounded-xl p-1 flex w-full flex-wrap gap-1">
                            {activeLevels.map((lvl) => (
                                <button
                                    key={lvl}
                                    onClick={() => setEditLevel(lvl)}
                                    className={`flex-1 py-2 md:py-2.5 text-[10px] md:text-xs font-bold rounded-lg transition-all min-w-[45px] ${editLevel === lvl ? 'bg-white dark:bg-gray-700 shadow-sm text-[#1A1A1A] dark:text-white' : 'text-gray-400 hover:text-[#1A1A1A] dark:hover:text-white'}`}
                                >
                                    {lvl}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="pt-2 relative z-0">
                        <label className="block text-[10px] md:text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-2">Email Address</label>
                        <input
                            type="email"
                            value={userEmail}
                            disabled
                            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 md:px-5 md:py-4 text-sm font-bold text-gray-400 cursor-not-allowed focus:outline-none"
                        />
                    </div>
                </div>
            </div>

            {/* Application Settings & Sign Out */}
            <div className="bg-white dark:bg-[#121212] border border-[#E5E5E5] dark:border-gray-800 rounded-[24px] p-6 shadow-sm flex flex-col xl:flex-row justify-between items-center gap-6">
                <div className="text-center xl:text-left w-full xl:w-auto">
                    <h4 className="text-sm font-bold text-[#1A1A1A] dark:text-white">App Settings</h4>
                    <p className="text-[10px] md:text-xs font-medium text-gray-400 mt-1">
                        Manage appearance, sounds, version updates, or sign out.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto">
                    <div className="flex flex-col gap-2 w-full sm:w-auto shrink-0">
                        {/* 🌙 LIGHT/DARK MODE TOGGLE */}
                        <div className="flex bg-[#F8F9FA] dark:bg-[#1A1A1A] p-1 rounded-xl border border-[#E5E5E5] dark:border-gray-800 w-full sm:w-auto shrink-0">
                            <button
                                onClick={() => setIsDarkMode(false)}
                                className={`flex-1 sm:flex-none px-4 py-2.5 text-xs font-bold rounded-lg transition-all ${!isDarkMode ? 'bg-white shadow-sm text-[#1A1A1A]' : 'text-gray-400 hover:text-[#1A1A1A] dark:hover:text-white'}`}
                            >
                                ☀️ Light
                            </button>
                            <button
                                onClick={() => setIsDarkMode(true)}
                                className={`flex-1 sm:flex-none px-4 py-2.5 text-xs font-bold rounded-lg transition-all ${isDarkMode ? 'bg-[#2A2A2A] shadow-sm text-white' : 'text-gray-400 hover:text-[#1A1A1A] dark:hover:text-white'}`}
                            >
                                🌙 Dark
                            </button>
                        </div>

                        {/* 🔊 SOUND ENABLE/DISABLE TOGGLE */}
                        <div className="flex bg-[#F8F9FA] dark:bg-[#1A1A1A] p-1 rounded-xl border border-[#E5E5E5] dark:border-gray-800 w-full sm:w-auto shrink-0">
                            <button
                                onClick={() => setIsSoundEnabled(true)}
                                className={`flex-1 sm:flex-none px-4 py-2.5 text-xs font-bold rounded-lg transition-all ${isSoundEnabled ? 'bg-white dark:bg-[#2A2A2A] shadow-sm text-[#1A1A1A] dark:text-white' : 'text-gray-400 hover:text-[#1A1A1A] dark:hover:text-white'}`}
                            >
                                🔊 Sounds
                            </button>
                            <button
                                onClick={() => setIsSoundEnabled(false)}
                                className={`flex-1 sm:flex-none px-4 py-2.5 text-xs font-bold rounded-lg transition-all ${!isSoundEnabled ? 'bg-white dark:bg-[#2A2A2A] shadow-sm text-[#1A1A1A] dark:text-white' : 'text-gray-400 hover:text-[#1A1A1A] dark:hover:text-white'}`}
                            >
                                🔇 Muted
                            </button>
                        </div>
                    </div>

                    <button
                        onClick={handleForceUpdate}
                        disabled={isUpdating}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-3 bg-[#FFF9F5] dark:bg-gray-800 text-[#FF6B00] border border-[#FFD5C2] dark:border-gray-700 rounded-xl text-xs font-bold hover:bg-[#FFD5C2] dark:hover:bg-gray-700 transition-colors disabled:opacity-50 shrink-0"
                    >
                        {isUpdating ? 'Updating...' : 'Check for Updates'}
                    </button>

                    <button
                        onClick={handleSignOut}
                        className="w-full sm:w-auto px-4 py-3 text-xs font-bold text-gray-500 hover:text-red-500 transition-colors uppercase tracking-widest shrink-0"
                    >
                        Sign Out
                    </button>
                </div>
            </div>
        </div>
    );
}