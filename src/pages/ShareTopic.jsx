// src/pages/ShareTopic.jsx
import { useState } from 'react';

export default function ShareTopic({ sharedCourse, sharedTopic, goBack }) {
    const [copied, setCopied] = useState(false);

    // Generates the public link for this specific topic
    const shareUrl = `${window.location.origin}/?course=${encodeURIComponent(sharedCourse)}&topic=${encodeURIComponent(sharedTopic)}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleWhatsApp = () => {
        const text = `Hey! Check out this interactive study module on "${sharedTopic}" for ${sharedCourse} on Recall: \n\n${shareUrl}`;
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
    };

    return (
        <div className="max-w-md mx-auto py-12 px-6 animate-fade-in-up">
            <button onClick={goBack} className="mb-8 text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-[#1A1A1A] dark:hover:text-white transition-colors">← Back</button>

            <div className="bg-white dark:bg-[#121212] border border-[#E5E5E5] dark:border-gray-800 rounded-[32px] p-8 shadow-sm text-center transition-colors">
                <h2 className="text-2xl font-black text-[#1A1A1A] dark:text-white mb-2">{sharedCourse}</h2>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-8">{sharedTopic}</p>

                {/* QR CODE GENERATOR */}
                <div className="flex justify-center mb-8">
                    {/* The QR code background stays white in dark mode so phone cameras can scan it easily! */}
                    <div className="p-4 bg-white border-2 border-[#F8F9FA] dark:border-gray-800 rounded-[24px] shadow-sm">
                        <img
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(shareUrl)}`}
                            alt="QR Code"
                            className="w-48 h-48 rounded-lg"
                        />
                    </div>
                </div>

                {/* COPY LINK BOX */}
                <div className="flex bg-[#F8F9FA] dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-gray-800 rounded-xl p-2 mb-6 shadow-inner transition-colors">
                    <input
                        type="text"
                        readOnly
                        value={shareUrl}
                        className="bg-transparent flex-1 text-[11px] text-gray-500 dark:text-gray-400 font-medium px-2 outline-none w-full"
                    />
                    <button
                        onClick={handleCopy}
                        className="bg-white dark:bg-[#242424] border border-[#E5E5E5] dark:border-gray-700 text-[#1A1A1A] dark:text-white text-xs font-bold px-4 py-2 rounded-[14px] hover:border-[#FF6B00] dark:hover:border-[#FF6B00] transition-colors shadow-sm whitespace-nowrap"
                    >
                        {copied ? '✓ Copied' : 'Copy'}
                    </button>
                </div>

                {/* WHATSAPP BUTTON */}
                <button
                    onClick={handleWhatsApp}
                    className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white py-4 rounded-[16px] font-black text-sm shadow-md transition-all active:scale-[0.98]"
                >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                    Share to WhatsApp
                </button>
            </div>
        </div>
    );
}