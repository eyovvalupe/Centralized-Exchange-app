/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{vue,js}'],
  theme: {
    // 内边距
    padding: Array.from({ length: 667 }).reduce((map, _, index) => {
      map[index] = index ? `${(index * 4) / 50}rem` : 0
      return map
    }, {}),
    // 外边距
    spacing: Array.from({ length: 667 }).reduce((map, _, index) => {
      map[index] = index ? `${(index * 4) / 50}rem` : 0
      return map
    }, {}),

    extend: {
      // 宽度
      width: Array.from({ length: 667 }).reduce((map, _, index) => {
        map[index] = index ? `${(index * 4) / 50}rem` : 0
        return map
      }, {}),
      // 高度
      height: Array.from({ length: 667 }).reduce((map, _, index) => {
        map[index] = index ? `${(index * 4) / 50}rem` : 0
        return map
      }, {}),
      // 字体大小
      fontSize: Array.from({ length: 100 }).reduce((map, _, index) => {
        map[index] = index ? `${index / 50}rem` : 0
        return map
      }, {}),
      // 行高
      lineHeight: Array.from({ length: 667 }).reduce((map, _, index) => {
        map[index] = index ? `${index / 50}rem` : 0
        return map
      }, {}),
      // 圆角
      borderRadius: Array.from({ length: 100 }).reduce((map, _, index) => {
        map[index] = index ? `${(index * 4) / 50}rem` : 0
        return map
      }, {}),
      colors: {
        my: 'var(--main-color)',
      },
    },
  },
  plugins: [],
}
