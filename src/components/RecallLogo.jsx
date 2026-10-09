export default function RecallLogo({ className = "w-8 h-8" }) {
    return (
        <img
            src={`${import.meta.env.BASE_URL}mockups/recall-logo.png`}
            alt="Recall Logo"
            className={`${className} object-contain`}
            onError={(e) => {
                e.target.style.display = 'none';
                if (e.target.parentNode) {
                    e.target.parentNode.innerHTML = '<span style="font-weight:900; font-size:16px; font-family:sans-serif;">R</span>';
                }
            }}
        />
    );
}