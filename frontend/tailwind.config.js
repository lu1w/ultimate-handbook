/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    /* NOTE-FOR-DEVELOPERS: 
      Tailwind needs to know where your HTML (or other template files) are so that 
      it can scan them and determine which classes are actually used in your project. 
      By listing the paths to your template files in the tailwind.config.js file, 
      you’re allowing Tailwind to only include the CSS you need, and exclude unused 
      styles, which helps reduce the file size in production. 
    */
    './src/**/*.{html,js,jsx}' // Scan all files in src folder for HTML and JSX (might add JS, TS, TSX if we need to)
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

