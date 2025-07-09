/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  /**
   * @description 移除冗余的 line-clamp 插件
   * @date 2025-07-08
   * @details 根据Tailwind v3.3+的更新，line-clamp功能已内置，无需作为插件引入。
   */
  plugins: [],
}