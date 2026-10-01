/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class', // 👈 THIS IS THE MAGIC LINE
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    orange: "#FF5E00",
                    hover: "#E05300",
                    peach: "#FFF4ED",
                    border: "#FED7AA",
                },
                surface: {
                    subtle: "#F9FAFB",
                    border: "#F1F3F5",
                    charcoal: "#111827",
                    slate: "#6B7280",
                },
                feedback: {
                    correct: "#16A34A",
                    "correct-bg": "#F0FDF4",
                    wrong: "#DC2626",
                    "wrong-bg": "#FEF2F2",
                },
            },
            borderRadius: {
                'ios-card': '24px',
                'ios-btn': '16px',
            },
            boxShadow: {
                'ios-soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
            }
        },
    },
    plugins: [],
}