// src/pages/SuggestMaterial.jsx
import { useState } from 'react';

export default function SuggestMaterial({ onBack }) {
    const [shareMethod, setShareMethod] = useState('cloud');
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('Textbook');
    const [link, setLink] = useState('');

    return (
        // 🚀 FORCE FULL SCREEN OVER THE NAV BAR
        <div className="!fixed !top-0 !left-0 !w-screen !h-[100dvh] z-[99999] bg-[#FAFAFA] dark:bg-[#121212] font-sans animate-fade-in flex flex-col !m-0 !p-0 overflow-y-auto">

            {/* 📱 MOBILE HEADER (Hidden on Desktop) */}
            <div className="md:hidden flex items-center px-5 pt-6 pb-4 bg-white dark:bg-[#1A1A1A] border-b border-[#E5E5E5] dark:border-gray-800 sticky top-0 z-10 shrink-0">
                <button onClick={onBack} className="mr-4 text-[#111827] dark:text-white shrink-0">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"></path></svg>
                </button>
                <h1 className="text-xl font-black text-[#111827] dark:text-white tracking-tight">Suggest Material</h1>
            </div>

            {/* 🖥️ DESKTOP NAV (Hidden on Mobile) */}
            <div className="hidden md:flex items-center justify-between px-10 py-6 max-w-7xl mx-auto w-full shrink-0">
                <div className="flex items-center gap-6">
                    <button onClick={onBack} className="flex items-center gap-2 text-gray-500 hover:text-[#111827] dark:hover:text-white transition-colors font-bold">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"></path></svg>
                        Back to Library
                    </button>
                    <span className="text-gray-300 dark:text-gray-700">•</span>
                    <span className="font-bold text-[#FF6B00]">Contribute</span>
                </div>
            </div>

            {/* MAIN CONTENT */}
            <div className="flex-1 max-w-7xl mx-auto w-full px-5 py-8 md:py-12 grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16">

                {/* LEFT COLUMN (Text & Info Cards) */}
                <div className="lg:col-span-5 flex flex-col">
                    <h1 className="text-[36px] md:text-[48px] font-black text-[#111827] dark:text-white leading-[1.1] tracking-tight mb-4 md:mb-6">
                        Help build the <span className="text-[#FF6B00]">Faculty</span> library.
                    </h1>
                    <p className="text-[15px] md:text-[16px] text-gray-500 dark:text-gray-400 font-medium leading-relaxed mb-10">
                        Your contributions help thousands of students access the materials they need. <span className="font-bold text-[#111827] dark:text-white">The resource library is free forever.</span>
                    </p>

                    {/* Desktop Information Cards (Hidden on Mobile) */}
                    <div className="hidden md:flex flex-col gap-6">
                        {/* Submission Guide */}
                        <div className="bg-white dark:bg-[#1A1A1A] rounded-[24px] p-8 border border-[#E5E5E5] dark:border-gray-800 shadow-sm">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                    <svg className="w-3.5 h-3.5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
                                </div>
                                <h3 className="font-bold text-[#111827] dark:text-white">Submission Guide</h3>
                            </div>

                            <ul className="space-y-5 mb-8">
                                <li className="flex gap-4">
                                    <span className="text-[#FF6B00] font-black text-sm">01</span>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed">Ensure the file is clear and readable (preferably PDF or high-quality scan).</p>
                                </li>
                                <li className="flex gap-4">
                                    <span className="text-[#FF6B00] font-black text-sm">02</span>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed">Make sure Google Drive/Cloud links are set to "Anyone with the link".</p>
                                </li>
                                <li className="flex gap-4">
                                    <span className="text-[#FF6B00] font-black text-sm">03</span>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed">Include the Author and Edition to help with proper categorization.</p>
                                </li>
                            </ul>

                            <button type="button" className="w-full py-3 bg-[#F8F9FA] dark:bg-gray-800 border border-[#E5E5E5] dark:border-gray-700 rounded-[14px] text-xs font-bold text-[#111827] dark:text-white flex items-center justify-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9v-2H7v-2h2V9h2v7zm4-4h-2v2h-2v-4h4v2z" /></svg>
                                Download Submission PDF
                            </button>
                        </div>

                        {/* Contributor Reward */}
                        <div className="bg-[#FFF5F0] dark:bg-[#FF6B00]/10 rounded-[24px] p-6 border border-[#FFD5C2] dark:border-[#FF6B00]/20 flex flex-col gap-3">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-[#FF6B00]/20 flex items-center justify-center">
                                    <span className="text-[14px]">🏆</span>
                                </div>
                                <h3 className="font-bold text-[#FF6B00]">Contributor Reward</h3>
                            </div>
                            <p className="text-xs text-[#FF6B00] font-medium leading-relaxed">Top contributors get early access to "Recall Pro" and a verified badge on their faculty profile.</p>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN (Form Area) */}
                <div className="lg:col-span-7">
                    <div className="bg-transparent md:bg-white md:dark:bg-[#1A1A1A] md:rounded-[32px] md:p-10 md:border border-[#E5E5E5] dark:border-gray-800 md:shadow-sm">

                        {/* Step 1 */}
                        <div className="mb-10">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-8 h-8 rounded-full bg-[#111827] dark:bg-white text-white dark:text-[#111827] flex items-center justify-center font-bold text-sm shrink-0">1</div>
                                <h2 className="text-xl font-bold text-[#111827] dark:text-white">{window.innerWidth > 768 ? 'What are you sharing?' : 'Material Details'}</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-xs font-bold text-[#111827] dark:text-white mb-2">Material Title</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Criminal Law Vol. 1"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full px-4 py-3.5 bg-white dark:bg-[#121212] border border-[#E5E5E5] dark:border-gray-700 rounded-[16px] text-sm font-medium text-[#111827] dark:text-white focus:outline-none focus:border-[#FF6B00] transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-[#111827] dark:text-white mb-2">Category</label>
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="w-full px-4 py-3.5 bg-white dark:bg-[#121212] border border-[#E5E5E5] dark:border-gray-700 rounded-[16px] text-sm font-medium text-[#111827] dark:text-white focus:outline-none focus:border-[#FF6B00] transition-colors appearance-none"
                                    >
                                        <option value="Textbook">Textbook</option>
                                        <option value="Statute">Statute / Constitution</option>
                                        <option value="Authority Book">Authority Book</option>
                                        <option value="Past Question">Past Question</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="mb-10">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-8 h-8 rounded-full bg-[#111827] dark:bg-white text-white dark:text-[#111827] flex items-center justify-center font-bold text-sm shrink-0">2</div>
                                <h2 className="text-xl font-bold text-[#111827] dark:text-white">{window.innerWidth > 768 ? 'Choose Sharing Method' : 'Share Method'}</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                {/* Cloud Link Card */}
                                <div
                                    onClick={() => setShareMethod('cloud')}
                                    className={`p-5 rounded-[20px] border-2 cursor-pointer transition-all ${shareMethod === 'cloud' ? 'border-[#FF6B00] bg-white dark:bg-[#121212] shadow-[0_4px_12px_rgba(255,107,0,0.08)]' : 'border-[#E5E5E5] dark:border-gray-700 bg-white dark:bg-[#1A1A1A] hover:border-gray-300 dark:hover:border-gray-600'}`}
                                >
                                    <div className="w-10 h-10 rounded-full bg-[#F0F4FF] dark:bg-blue-900/30 flex items-center justify-center mb-4">
                                        <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24"><path d="M19.14 11.23l-3.32-5.74c-.58-1-1.63-1.62-2.78-1.62h-2c-1.15 0-2.2.62-2.78 1.62L4.94 11.23C4.36 12.23 4.36 13.48 4.94 14.48l3.32 5.75c.58 1 1.63 1.62 2.78 1.62h2c1.15 0 2.2-.62 2.78-1.62l3.32-5.75c.58-1 .58-2.25 0-3.25zM12 16.5l-4-7h8l-4 7z" /></svg>
                                    </div>
                                    <h4 className="text-sm font-bold text-[#111827] dark:text-white mb-1">Cloud Link</h4>
                                    <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">Google Drive, Dropbox, etc.</p>
                                </div>

                                {/* WhatsApp Card */}
                                <div
                                    onClick={() => setShareMethod('whatsapp')}
                                    className={`p-5 rounded-[20px] border-2 cursor-pointer transition-all ${shareMethod === 'whatsapp' ? 'border-[#FF6B00] bg-white dark:bg-[#121212] shadow-[0_4px_12px_rgba(255,107,0,0.08)]' : 'border-[#E5E5E5] dark:border-gray-700 bg-white dark:bg-[#1A1A1A] hover:border-gray-300 dark:hover:border-gray-600'}`}
                                >
                                    <div className="w-10 h-10 rounded-full bg-[#E8FDEE] dark:bg-green-900/30 flex items-center justify-center mb-4">
                                        <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12.01 2.01c-5.5 0-9.98 4.48-9.98 9.98 0 1.96.56 3.84 1.62 5.43l-1.57 4.71 4.82-1.55c1.54.98 3.33 1.49 5.11 1.49 5.5 0 9.98-4.48 9.98-9.98s-4.48-9.98-9.98-9.98zm5.55 14.18c-.24.68-1.39 1.25-1.93 1.34-.51.09-1.15.17-3.32-.73-2.61-1.09-4.32-3.8-4.45-3.98-.13-.17-1.07-1.42-1.07-2.7 0-1.28.66-1.92.89-2.18.23-.26.5-.32.66-.32.17 0 .34 0 .49.01.17.01.38-.06.58.42.21.5.71 1.73.78 1.86.06.13.11.28.02.45-.08.17-.13.28-.26.43-.13.15-.28.34-.39.47-.13.15-.28.31-.12.58.15.26.68 1.13 1.47 1.83 1.01.91 1.86 1.19 2.12 1.32.26.13.41.11.56-.06.15-.17.65-.75.82-1.01.17-.26.34-.21.58-.13.24.08 1.5.71 1.76.84.26.13.43.21.49.32.06.13.06.77-.18 1.45z" /></svg>
                                    </div>
                                    <h4 className="text-sm font-bold text-[#111827] dark:text-white mb-1">WhatsApp Direct</h4>
                                    <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">Send directly to Review Team.</p>
                                </div>
                            </div>

                            {/* Link Input */}
                            <div>
                                <label className="block text-xs font-bold text-[#111827] dark:text-white mb-2">{shareMethod === 'cloud' ? 'Paste Link' : 'File Link (Optional)'}</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                                    </div>
                                    <input
                                        type="url"
                                        placeholder={shareMethod === 'cloud' ? "https://drive.google.com/..." : "Paste link here (or leave blank to send via WhatsApp)"}
                                        value={link}
                                        onChange={(e) => setLink(e.target.value)}
                                        className="w-full pl-11 pr-4 py-3.5 bg-white dark:bg-[#121212] border border-[#E5E5E5] dark:border-gray-700 rounded-[16px] text-sm font-medium text-[#111827] dark:text-white focus:outline-none focus:border-[#FF6B00] transition-colors"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Submit Footer */}
                        <div className="mt-8 md:mt-12 md:pt-8 md:border-t border-[#E5E5E5] dark:border-gray-800 flex flex-col-reverse md:flex-row md:items-center justify-between gap-6">
                            <p className="md:hidden text-[11px] text-gray-400 font-medium text-center leading-relaxed px-4">
                                By submitting, you agree that this material is for academic purposes and complies with our guidelines.
                            </p>
                            <div className="hidden md:flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-[#FF6B00] animate-pulse"></div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">AWAITING SUBMISSION</span>
                            </div>
                            <button type="button" className="w-full md:w-auto px-10 py-4 bg-[#FF6B00] text-white rounded-[16px] text-sm font-bold shadow-[0_8px_24px_rgba(255,107,0,0.25)] hover:bg-[#E05D00] hover:shadow-[0_8px_24px_rgba(224,93,0,0.35)] active:scale-95 transition-all">
                                Send for Review
                            </button>
                        </div>

                    </div>
                </div>
            </div>

            {/* GLOBAL FOOTER */}
            <footer className="w-full py-8 md:py-10 mt-auto border-t border-[#E5E5E5] dark:border-gray-800 shrink-0">
                <div className="max-w-7xl mx-auto px-5 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
                    <div className="text-[11px] text-gray-500 dark:text-gray-400 font-medium max-w-2xl leading-relaxed">
                        © 2026 Recall Study. Curated for the Faculty of Law. <br className="hidden md:block" />
                        <span className="italic mt-1 block md:inline md:mt-0">If you believe your material is being used illegally or infringes on copyright, please contact the Recall team for a prompt takedown.</span>
                    </div>
                    <div className="flex items-center justify-center gap-6 text-xs font-bold text-[#111827] dark:text-gray-300">
                        <a href="#" className="hover:text-[#FF6B00] transition-colors">Privacy</a>
                        <a href="#" className="hover:text-[#FF6B00] transition-colors">Terms</a>
                        <a href="#" className="hover:text-[#FF6B00] transition-colors">Support</a>
                    </div>
                </div>
            </footer>

        </div>
    );
}