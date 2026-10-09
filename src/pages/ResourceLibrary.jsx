import { supabase } from '../supabase';
// src/pages/ResourceLibrary.jsx
import { useState, useMemo, useEffect } from 'react';

const FILTERS = ['All', 'Textbooks', 'Authority Books', 'Statutes / Constitution', '100L', '200L', '300L', '400L', '500L'];

export default function ResourceLibrary({ onSuggestMaterial }) {
    const [activeFilter, setActiveFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMaterials = async () => {
            const { data } = await supabase.from('materials').select('*');
            if (data) setMaterials(data);
            setLoading(false);
        };
        fetchMaterials();
    }, []);

    const filteredResources = useMemo(() => {
        return materials.filter(resource => {
            const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                resource.author.toLowerCase().includes(searchQuery.toLowerCase());

            let matchesFilter = true;
            if (activeFilter === 'Textbooks') matchesFilter = resource.type === 'Textbook';
            else if (activeFilter === 'Authority Books') matchesFilter = resource.type === 'Authority Book';
            else if (activeFilter === 'Statutes / Constitution') matchesFilter = resource.type === 'Statute';
            else if (activeFilter.endsWith('L')) matchesFilter = resource.level === activeFilter;

            return matchesSearch && matchesFilter;
        });
    }, [searchQuery, activeFilter, materials]);

    return (
        <div className="w-full animate-fade-in">

            {/* 1. MOBILE SUGGEST BUTTON */}
            <button
                type="button"
                onClick={(e) => { e.preventDefault(); onSuggestMaterial(); }}
                className="md:hidden w-full py-3 mb-6 bg-white dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-gray-800 rounded-[14px] flex items-center justify-center gap-2 text-sm font-bold text-[#1A1A1A] dark:text-white shadow-[0_2px_8px_rgba(0,0,0,0.02)] active:scale-95 transition-transform"
            >
                <svg className="w-4 h-4 text-[#FF6B00]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"></path></svg>
                Suggest Material
            </button>

            {/* 2. SEARCH BAR */}
            <div className="relative mb-5">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <svg className="h-4 w-4 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
                <input
                    type="text"
                    placeholder="Search resources..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-[#1A1A1A] border border-[#F3F4F6] dark:border-gray-800 rounded-full text-[13px] font-medium text-[#111827] dark:text-white focus:outline-none focus:border-[#FF6B00] transition-colors shadow-sm"
                />
            </div>

            {/* 3. FILTER PILLS */}
            <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide w-full mb-6">
                <button type="button" onClick={() => setActiveFilter('All')} className={`shrink-0 px-5 py-2 rounded-full text-[13px] font-bold transition-colors shadow-sm ${activeFilter === 'All' ? 'bg-[#1A1A1A] dark:bg-white text-white dark:text-[#1A1A1A]' : 'bg-[#F8F9FA] dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:text-[#1A1A1A] dark:hover:text-white'}`}>
                    {window.innerWidth < 768 ? 'All Resources' : 'All'}
                </button>
                {FILTERS.slice(1).map(filter => (
                    <button type="button" key={filter} onClick={() => setActiveFilter(filter)} className={`shrink-0 px-5 py-2 rounded-full text-[13px] font-bold transition-colors shadow-sm ${activeFilter === filter ? 'bg-[#1A1A1A] dark:bg-white text-white dark:text-[#1A1A1A]' : 'bg-[#F8F9FA] dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:text-[#1A1A1A] dark:hover:text-white'}`}>
                        {filter}
                    </button>
                ))}
            </div>

            {/* 4. RESOURCES GRID */}
            {loading ? (
                <div className="flex justify-center items-center py-20 w-full text-[#FF6B00] animate-pulse font-bold">
                    Loading Library...
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-10">
                {filteredResources.map((resource) => (
                    <div onClick={() => resource.url && window.open(resource.url, '_blank')} key={resource.id} className="bg-white dark:bg-[#1A1A1A] rounded-[20px] p-4 border border-[#E5E5E5] dark:border-gray-800 flex flex-row gap-4 hover:shadow-[0_4px_12px_rgba(0,0,0,0.03)] transition-all cursor-pointer">
                        <div className={`w-[72px] h-[72px] rounded-[16px] flex items-center justify-center shrink-0 ${resource.bgClass || 'bg-[#F0F6FF] dark:bg-blue-950/30'} ${resource.textClass || 'text-[#3B82F6]'}`}>
                            {resource.type === 'Textbook' && <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M4 4v16a2 2 0 002 2h14V2H6a2 2 0 00-2 2zm10 2h4v2h-4V6zm0 4h4v2h-4v-2z" /></svg>}
                            {resource.type === 'Statute' && <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zm0 7.5L5 6.25l7-3.5 7 3.5-7 3.25zM3 10v6c0 3 4 5 9 5s9-2 9-5v-6M12 19c-3 0-7-1-7-3v-3.5l7 3.5 7-3.5V16c0 2-4 3-7 3z" /></svg>}
                            {resource.type === 'Authority Book' && <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 2.5L17.5 9H13V4.5zM6 20V4h5v6h6v10H6z" /></svg>}
                        </div>
                        <div className="flex flex-col flex-1 justify-center py-0.5">
                            <span className={`text-[10px] font-black uppercase tracking-widest mb-1 ${resource.textClass}`}>{resource.type}</span>
                            <h3 className="text-[15px] font-bold text-[#1A1A1A] dark:text-white leading-tight mb-1">{resource.title}</h3>
                            <p className="text-[12px] text-gray-400 dark:text-gray-500 font-medium mb-2.5">{resource.author}</p>
                            <div className="flex items-center gap-1.5 text-xs font-bold text-[#1A1A1A] dark:text-white">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                Read
                            </div>
                        </div>
                    </div>
                ))}

                {filteredResources.length === 0 && (
                    <div className="col-span-full text-center py-12 text-gray-400 font-medium text-sm">
                        No resources found matching your search.
                    </div>
                )}
                {/* 5. DESKTOP SUGGEST CARD */}
                <div
                    onClick={(e) => { e.preventDefault(); onSuggestMaterial(); }}
                    className="hidden md:flex flex-col items-center justify-center bg-white dark:bg-[#1A1A1A] rounded-[20px] p-6 border-2 border-dashed border-[#E5E5E5] dark:border-gray-800 hover:border-[#FF6B00] dark:hover:border-[#FF6B00] transition-all cursor-pointer group text-center min-h-[140px]"
                >
                    <div className="w-10 h-10 rounded-full bg-[#F8F9FA] dark:bg-gray-800 flex items-center justify-center mb-3 group-hover:bg-[#FFF5F0] dark:group-hover:bg-[#FF6B00]/10 transition-colors">
                        <svg className="w-4 h-4 text-gray-400 dark:text-gray-500 group-hover:text-[#FF6B00]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"></path></svg>
                    </div>
                    <h4 className="font-bold text-[#1A1A1A] dark:text-white mb-1">Suggest a Material</h4>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium leading-relaxed">Know a useful case law or textbook?<br />Share a link and our team will review it.</p>
                </div>
            </div>
            )}

            {/* FOOTER ALERT */}
            <div className="hidden md:flex bg-[#F8F9FA] dark:bg-[#1A1A1A] rounded-2xl p-4 border border-[#E5E5E5] dark:border-gray-800 items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#FF6B00] flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-white text-[10px] font-black italic">i</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                    Materials are curated by the Faculty of Law. If you find a broken link or outdated statute, use the <span className="font-bold text-[#1A1A1A] dark:text-white">Suggest Material</span> card to report it.
                </p>
            </div>
        </div>
    );
}
