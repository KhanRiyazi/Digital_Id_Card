/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#e6f7f0',
                    100: '#cceee1',
                    200: '#99ddc3',
                    300: '#66cca5',
                    400: '#33bb87',
                    500: '#00aa69',
                    600: '#008854',
                    700: '#00663f',
                    800: '#00442a',
                    900: '#002215',
                }
            }
        },
    },
    plugins: [],
}