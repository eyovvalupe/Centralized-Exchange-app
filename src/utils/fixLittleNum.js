export const fixLittleNum = (num, i) => {
    const lastNum = num * 1000000 - Math.floor(num * 100000) * 10
    if (lastNum) {
        return num.toFixed(i)
    } else return num
}