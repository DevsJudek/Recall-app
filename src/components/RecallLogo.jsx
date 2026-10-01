// src/components/RecallLogo.jsx
export default function RecallLogo({ className = "w-8 h-8" }) {
    return (
        <div className={`${className} rounded-xl overflow-hidden flex items-center justify-center bg-[#FF6B00] shadow-sm flex-shrink-0`}>
            <img
                src={`${import.meta.env.BASE_URL}logo.png`}
                alt="Recall Logo"
                className="w-full h-full object-cover"
                onError={(e) => {
                    e.target.style.display = 'none';
                    if (e.target.parentNode) {
                        e.target.parentNode.innerHTML = '<span style="color:white; font-weight:900; font-size:16px; font-family:sans-serif;">R</span>';
                    }
                }}
            />
        </div>
    );
}