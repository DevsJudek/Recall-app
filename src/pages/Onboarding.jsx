// src/pages/Onboarding.jsx
import { useState, useEffect, useRef } from 'react';
export const UNIVERSITIES = [
    { name: "Abubakar Tafawa Balewa University (ATBU)" }, { name: "Ahmadu Bello University (ABU)" }, { name: "Alex Ekwueme Federal University, Ndufu-Alike (AE-FUNAI)" }, { name: "Bayero University Kano (BUK)" }, { name: "Federal University of Agriculture, Abeokuta (FUNAAB)" }, { name: "Federal University of Agriculture, Zuru (FUAZ)" }, { name: "Federal University of Petroleum Resources, Effurun (FUPRE)" }, { name: "Federal University of Technology, Akure (FUTA)" }, { name: "Federal University of Technology, Babura (FUTB)" }, { name: "Federal University of Technology, Ikot Abasi (FUTIA)" }, { name: "Federal University of Technology, Minna (FUTMINNA)" }, { name: "Federal University of Technology, Owerri (FUTO)" }, { name: "Federal University of Health Sciences, Azare (FUHSA)" }, { name: "Federal University of Health Sciences, Ila-Orangun (FUHSI)" }, { name: "Federal University of Health Sciences, Otukpo (FUHSO)" }, { name: "Federal University of Allied Health Sciences, Enugu (FUAHSE)" }, { name: "Federal University of Education, Kontagora (FUEK)" }, { name: "Federal University of Education, Pankshin (FUEP)" }, { name: "Federal University of Education, Zaria (FUEZ)" }, { name: "Adeyemi Federal University of Education (AFUED)" }, { name: "Alvan Ikoku Federal University of Education (AIFUE)" }, { name: "Federal University, Birnin Kebbi (FUBK)" }, { name: "Federal University, Dutse (FUD)" }, { name: "Federal University, Dutsin-Ma (FUDMA)" }, { name: "Federal University, Gashua (FUGA)" }, { name: "Federal University, Gusau (FUGUS)" }, { name: "Federal University, Kashere (FUKASHERE)" }, { name: "Federal University, Lafia (FULAFIA)" }, { name: "Federal University, Lokoja (FULOKOJA)" }, { name: "Federal University, Otuoke (FUOTUOKE)" }, { name: "Federal University, Oye-Ekiti (FUOYE)" }, { name: "Federal University, Wukari (FUWUKARI)" }, { name: "Joseph Sarwuan Tarka University, Makurdi (JOSTUM)" }, { name: "Michael Okpara University of Agriculture, Umudike (MOUAU)" }, { name: "Modibbo Adama University (MAU)" }, { name: "National Open University of Nigeria (NOUN)" }, { name: "Nigerian Defence Academy (NDA)" }, { name: "Nigerian Police Academy (POLAC)" }, { name: "Nigerian Maritime University (NMU)" }, { name: "Nigerian Army University, Biu (NAUB)" }, { name: "Nnamdi Azikiwe University (UNIZIK)" }, { name: "Obafemi Awolowo University (OAU)" }, { name: "University of Abuja (UNIABUJA)" }, { name: "University of Benin (UNIBEN)" }, { name: "University of Calabar (UNICAL)" }, { name: "University of Ibadan (UI)" }, { name: "University of Ilorin (UNILORIN)" }, { name: "University of Jos (UNIJOS)" }, { name: "University of Lagos (UNILAG)" }, { name: "University of Maiduguri (UNIMAID)" }, { name: "University of Nigeria, Nsukka (UNN)" }, { name: "University of Port Harcourt (UNIPORT)" }, { name: "University of Uyo (UNIUYO)" }, { name: "Usmanu Danfodiyo University (UDUS)" }, { name: "AbdulKadir Kure University (AKU)" }, { name: "Abdulsalam Abubakar University of Agriculture and Climate Action (AAUACA)" }, { name: "Abia State University (ABSU)" }, { name: "Adamawa State University (ADSU)" }, { name: "Adekunle Ajasin University (AAUA)" }, { name: "Akwa Ibom State University (AKSU)" }, { name: "Aliko Dangote University of Science and Technology (ADUSTECH)" }, { name: "Ambrose Alli University (AAU)" }, { name: "Bamidele Olumilua University of Education, Science and Technology (BOUESTI)" }, { name: "Bauchi State University (BASUG)" }, { name: "Bayelsa Medical University (BMU)" }, { name: "Benue State University (BSU)" }, { name: "Benue State University of Agriculture, Science and Technology (BSUAST)" }, { name: "Borno State University (BOSU)" }, { name: "Chukwuemeka Odumegwu Ojukwu University (COOU)" }, { name: "Confluence University of Science and Technology (CUSTECH)" }, { name: "Cross River University of Education and Entrepreneurship (CRUEE)" }, { name: "Delta State University (DELSU)" }, { name: "Delta University of Science and Technology (DUST)" }, { name: "Dennis Osadebay University (DOU)" }, { name: "Ebonyi State University (EBSU)" }, { name: "Ebonyi State University of ICT, Science and Technology (EB-SUIST)" }, { name: "Edo State University (EDSU)" }, { name: "Ekiti State University (EKSU)" }, { name: "Emmanuel Alayande University of Education (EAUED)" }, { name: "Enugu State University of Medical and Applied Sciences (SUMAS)" }, { name: "Enugu State University of Science and Technology (ESUT)" }, { name: "Gombe State University (GSU)" }, { name: "Gombe State University of Science and Technology (GSUST)" }, { name: "Ibrahim Badamasi Babangida University (IBBU)" }, { name: "Ignatius Ajuru University of Education (IAUE)" }, { name: "Imo State University (IMSU)" }, { name: "Kaduna State University (KASU)" }, { name: "Kebbi State University of Science and Technology (KSUSTA)" }, { name: "Kingsley Ozumba Mbadiwe University (KOMU)" }, { name: "Kogi State University (KSU)" }, { name: "Kwara State University (KWASU)" }, { name: "Kwara State University of Education (KSUED)" }, { name: "Ladoke Akintola University of Technology (LAUTECH)" }, { name: "Lagos State University (LASU)" }, { name: "Lagos State University of Education (LASUED)" }, { name: "Lagos State University of Science and Technology (LASUSTECH)" }, { name: "Moshood Abiola University of Science and Technology (MAUSTECH)" }, { name: "Nasarawa State University (NSUK)" }, { name: "Niger Delta University (NDU)" }, { name: "Olusegun Agagu University of Science and Technology (OAUSTECH)" }, { name: "Olabisi Onabanjo University (OOU)" }, { name: "Osun State University (UNIOSUN)" }, { name: "Plateau State University (PLASU)" }, { name: "Prince Abubakar Audu University (PAAU)" }, { name: "Rivers State University (RSU)" }, { name: "Sa’adatu Rimi University of Education (SRUE)" }, { name: "Shehu Shagari University of Education (SSUED)" }, { name: "Sokoto State University (SSU)" }, { name: "Sule Lamido University (SLU)" }, { name: "Tai Solarin University of Education (TASUED)" }, { name: "Taraba State University (TSU)" }, { name: "Umar Musa Yar'Adua University (UMYU)" }, { name: "University of Agriculture and Environmental Sciences (UAES)" }, { name: "University of Cross River State (UNICROSS)" }, { name: "University of Delta (UNIDEL)" }, { name: "University of Ilesa (UNILESA)" }, { name: "University of Medical Sciences (UNIMED)" }, { name: "Yobe State University (YSU)" }, { name: "Zamfara State University (ZAMSUT)" }
];

// COMPLETE OAU DEPARTMENT DATABASE WITH DURATION
export const OAU_DEPARTMENTS = [
    { name: "Accounting", duration: 4 }, { name: "Adult Education", duration: 4 }, { name: "Aerospace Engineering", duration: 5 }, { name: "Agricultural & Environmental Engineering", duration: 5 }, { name: "Agricultural Economics", duration: 5 }, { name: "Agricultural Extension & Rural Development", duration: 5 }, { name: "Animal Sciences", duration: 5 }, { name: "Applied Geophysics", duration: 4 }, { name: "Architecture", duration: 4 }, { name: "Biochemistry", duration: 4 }, { name: "Botany", duration: 4 }, { name: "Broadcast Journalism", duration: 4 }, { name: "Building", duration: 5 }, { name: "Business Administration", duration: 4 }, { name: "Chemical Engineering", duration: 5 }, { name: "Chemistry", duration: 4 }, { name: "Civil Engineering", duration: 5 }, { name: "Computer Education", duration: 4 }, { name: "Computer Engineering", duration: 5 }, { name: "Computer Science with Economics", duration: 4 }, { name: "Computer Science with Mathematics", duration: 4 }, { name: "Crop Production & Protection", duration: 5 }, { name: "Cybersecurity", duration: 4 }, { name: "Demography and Social Statistics", duration: 4 }, { name: "Dentistry", duration: 6 }, { name: "Dramatic Arts", duration: 4 }, { name: "Early Childhood & Primary Education", duration: 4 }, { name: "Economics", duration: 4 }, { name: "Education Agricultural Science", duration: 4 }, { name: "Education Biology", duration: 4 }, { name: "Education Chemistry", duration: 4 }, { name: "Education Economics", duration: 4 }, { name: "Education English", duration: 4 }, { name: "Education Fine Arts", duration: 4 }, { name: "Education French", duration: 4 }, { name: "Education Geography", duration: 4 }, { name: "Education History", duration: 4 }, { name: "Education Home Economics", duration: 4 }, { name: "Education Mathematics", duration: 4 }, { name: "Education Music", duration: 4 }, { name: "Education Physics", duration: 4 }, { name: "Education Political Science", duration: 4 }, { name: "Education Religious Studies", duration: 4 }, { name: "Education Social Studies", duration: 4 }, { name: "Education Yoruba", duration: 4 }, { name: "Educational Management", duration: 4 }, { name: "Educational Technology", duration: 4 }, { name: "Electronic & Electrical Engineering", duration: 5 }, { name: "Engineering Physics", duration: 4 }, { name: "English Language", duration: 4 }, { name: "Entrepreneurship", duration: 4 }, { name: "Estate Management", duration: 5 }, { name: "Family Nutrition & Consumer Science", duration: 4 }, { name: "Film Production", duration: 4 }, { name: "Fine & Applied Arts", duration: 4 }, { name: "Food Science & Technology", duration: 5 }, { name: "Forestry & Wild Life", duration: 5 }, { name: "French", duration: 4 }, { name: "Geography", duration: 4 }, { name: "Geology", duration: 4 }, { name: "German", duration: 4 }, { name: "Guidance and Counselling", duration: 4 }, { name: "Health Education", duration: 4 }, { name: "History", duration: 4 }, { name: "Human Kinetics Education", duration: 4 }, { name: "Human Nutrition & Dietetics", duration: 4 }, { name: "Industrial Chemistry", duration: 4 }, { name: "Information and Communication Technology", duration: 4 }, { name: "Information Science and Media Studies", duration: 4 }, { name: "Information System", duration: 4 }, { name: "International Relations", duration: 4 }, { name: "Language & Communication Arts", duration: 4 }, { name: "Law", duration: 5 }, { name: "Library and Information Science", duration: 4 }, { name: "Linguistics", duration: 4 }, { name: "Literature-in-English", duration: 4 }, { name: "Local Government & Development Studies", duration: 4 }, { name: "Mass Communication", duration: 4 }, { name: "Materials Science & Engineering", duration: 5 }, { name: "Mathematics", duration: 4 }, { name: "Mathematics/Integrated Science", duration: 4 }, { name: "Mechanical Engineering", duration: 5 }, { name: "Medical Rehabilitation", duration: 5 }, { name: "Medicine & Surgery", duration: 6 }, { name: "Microbiology", duration: 4 }, { name: "Music", duration: 4 }, { name: "Nursing Science", duration: 5 }, { name: "Pharmacy", duration: 6 }, { name: "Philosophy", duration: 4 }, { name: "Physical and Health Education", duration: 4 }, { name: "Physics", duration: 4 }, { name: "Political Sciences", duration: 4 }, { name: "Portuguese", duration: 4 }, { name: "Psychology", duration: 4 }, { name: "Public Administration", duration: 4 }, { name: "Quantity Surveying", duration: 5 }, { name: "Religious Studies", duration: 4 }, { name: "Science Laboratory Technology", duration: 4 }, { name: "Sociology and Anthropology", duration: 4 }, { name: "Software Engineering", duration: 4 }, { name: "Soil and Land Resources Management", duration: 5 }, { name: "Statistics", duration: 4 }, { name: "Surveying & Geoinformatics", duration: 5 }, { name: "Urban & Regional Planning", duration: 5 }, { name: "Yoruba", duration: 4 }, { name: "Zoology", duration: 4 }
];

// REUSABLE SEARCHABLE DROPDOWN
export function SearchableDropdown({ options, value, onChange, placeholder, inputClassName }) {
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

export default function Onboarding({ firstName, handleCompleteOnboarding, isUploading }) {
    const [name, setName] = useState(firstName || '');
    const [institution, setInstitution] = useState('Obafemi Awolowo University (OAU)');
    const [department, setDepartment] = useState('Law');
    const [level, setLevel] = useState('300L');
    const [dailyTarget, setDailyTarget] = useState(25);

    // Dynamic Levels based on department selection
    const selectedDept = OAU_DEPARTMENTS.find(d => d.name === department);
    const duration = selectedDept ? selectedDept.duration : 4;
    const activeLevels = Array.from({ length: duration }, (_, i) => `${(i + 1) * 100}L`);

    useEffect(() => {
        const currentLvlNum = parseInt(level.replace('L', ''));
        if (currentLvlNum > duration * 100) {
            setLevel(`${duration * 100}L`);
        }
    }, [department, duration, level]);

    const targets = [
        { val: 10, label: 'CASUAL' },
        { val: 25, label: 'REGULAR' },
        { val: 50, label: 'SERIOUS' },
        { val: 100, label: 'INTENSE' }
    ];

    const handleSubmit = () => {
        if (!name.trim()) return alert("Please enter your display name.");
        handleCompleteOnboarding({ name, institution, department, level, dailyTarget });
    };

    return (
        <div className="min-h-[100dvh] flex items-center justify-center bg-gradient-to-b from-[#FFF5F0] to-white dark:from-[#0a0a0a] dark:to-[#121212] p-4 md:p-8 font-sans animate-fade-in overflow-y-auto">
            <div className="w-full max-w-xl bg-transparent py-10">

                {/* Header Section */}
                <div className="text-center mb-10">
                    <div className="w-10 h-1 bg-[#FF6B00] rounded-full mx-auto mb-6"></div>
                    <h1 className="text-2xl md:text-3xl font-black text-[#1A1A1A] dark:text-white mb-2 tracking-tight">
                        Let's set up your syllabus ⚡
                    </h1>
                    <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-medium max-w-sm mx-auto leading-relaxed">
                        We'll tailor your courses, questions, and match you with your real classmates.
                    </p>
                </div>

                {/* Form Section */}
                <div className="space-y-6">

                    {/* Display Name */}
                    <div>
                        <label className="block text-[10px] md:text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-2">Display Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-[#F8F9FA] dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-gray-800 rounded-xl px-4 py-3 md:px-5 md:py-4 text-sm font-bold text-[#1A1A1A] dark:text-white focus:outline-none focus:border-[#FF6B00] transition-colors"
                            placeholder="e.g. Jude"
                        />
                        <p className="text-[10px] text-gray-400 font-medium mt-1.5 ml-1">This is how you'll appear on the leaderboard.</p>
                    </div>

                    {/* Institution */}
                    <div className="relative z-[60]">
                        <label className="block text-[10px] md:text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-2">Institution</label>
                        <SearchableDropdown
                            options={UNIVERSITIES}
                            value={institution}
                            onChange={setInstitution}
                            placeholder="Search your institution..."
                            inputClassName="w-full bg-[#F8F9FA] dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-gray-800 rounded-xl px-4 py-3 md:px-5 md:py-4 text-sm font-bold text-[#1A1A1A] dark:text-white focus:outline-none focus:border-[#FF6B00] transition-colors cursor-text"
                        />
                    </div>

                    {/* Searchable Department Dropdown */}
                    <div className="relative z-50">
                        <label className="block text-[10px] md:text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-2">Department</label>
                        <SearchableDropdown
                            options={OAU_DEPARTMENTS}
                            value={department}
                            onChange={setDepartment}
                            placeholder="Search your department..."
                            inputClassName="w-full bg-[#F8F9FA] dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-gray-800 rounded-xl px-4 py-3 md:px-5 md:py-4 text-sm font-bold text-[#1A1A1A] dark:text-white focus:outline-none focus:border-[#FF6B00] transition-colors cursor-text"
                        />
                    </div>

                    {/* Dynamic Level */}
                    <div className="relative z-0">
                        <label className="block text-[10px] md:text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-2">Academic Level</label>
                        <div className="bg-[#F8F9FA] dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-gray-800 rounded-xl p-1 flex w-full flex-wrap gap-1">
                            {activeLevels.map(l => (
                                <button
                                    key={l}
                                    onClick={() => setLevel(l)}
                                    className={`flex-1 py-2 md:py-2.5 text-[10px] md:text-xs font-bold rounded-lg transition-all min-w-[45px] ${level === l ? 'bg-white dark:bg-gray-700 shadow-sm text-[#1A1A1A] dark:text-white' : 'text-gray-400 hover:text-[#1A1A1A] dark:hover:text-white'}`}
                                >
                                    {l}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Daily Target */}
                    <div>
                        <label className="block text-[10px] md:text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-2">Daily Quiz Target</label>
                        <div className="grid grid-cols-4 gap-2 md:gap-3 w-full">
                            {targets.map(t => (
                                <div
                                    key={t.val}
                                    onClick={() => setDailyTarget(t.val)}
                                    className={`cursor-pointer rounded-xl p-3 md:p-4 flex flex-col items-center justify-center border-2 transition-all ${dailyTarget === t.val ? 'border-[#FF6B00] bg-[#FFF5F0] dark:bg-orange-950/20' : 'border-gray-100 dark:border-gray-800 bg-white dark:bg-[#1A1A1A] hover:border-gray-200 dark:hover:border-gray-700'}`}
                                >
                                    <span className={`text-lg md:text-xl font-black mb-0.5 ${dailyTarget === t.val ? 'text-[#FF6B00]' : 'text-[#1A1A1A] dark:text-white'}`}>{t.val}</span>
                                    <span className={`text-[8px] uppercase tracking-widest font-extrabold ${dailyTarget === t.val ? 'text-[#FF6B00]' : 'text-gray-400'}`}>{t.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                        <button
                            onClick={handleSubmit}
                            disabled={isUploading}
                            className="w-full bg-[#FF6B00] hover:bg-[#E05D00] text-white py-3.5 md:py-4 rounded-xl font-bold text-sm shadow-md shadow-[#FF6B00]/20 transition-all active:scale-[0.98] flex justify-center items-center gap-2 disabled:opacity-70"
                        >
                            {isUploading ? (
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            ) : (
                                <>Continue to Dashboard ➔</>
                            )}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}