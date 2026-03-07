/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'brand-primary': '#921115',
                'brand-secondary': '#232f3e',
                'accent-success': '#1c9d5d',
                'accent-warning': '#f39c12',
                'accent-info': '#3498db',
            },
            fontFamily: {
                sans: ['"Public Sans"', '"Poppins"', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
