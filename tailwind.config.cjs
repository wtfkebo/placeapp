module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: "hsl(245, 58%, 51%)",
                    foreground: "#ffffff",
                },
            },
        },
    },
    plugins: [],
}
