// npm install -g svgo

const fs = require('fs');
const path = require('path');
const svgo = require('svgo');

// 目标文件大小（500 KB）
const targetFileSize = 500 * 1024;  // 500 KB

// 扫描目录及其子目录
const directoryPath = path.join(__dirname, './img');  // 替换为你自己的目录路径

// 递归函数，扫描目录及子目录
function scanDirectory(directory) {
    fs.readdirSync(directory).forEach((file) => {
        const filePath = path.join(directory, file);

        // 如果是目录，递归扫描
        if (fs.statSync(filePath).isDirectory()) {
            scanDirectory(filePath);
        } else {
            // 如果是 SVG 文件，进行压缩
            if (path.extname(file).toLowerCase() === '.svg') {
                // console.log(`开始压缩文件：${filePath}`);

                let svgContent = fs.readFileSync(filePath, 'utf8');

                // 使用 svgo 压缩 SVG 内容
                let result = svgo.optimize(svgContent);

                if (Buffer.byteLength(result.data, 'utf8') / 1024 > 500) {
                    console.error('超大的： ', filePath)
                }

                // 将压缩后的内容写回文件
                fs.writeFileSync(filePath, result.data, 'utf8');
                // console.log(`压缩完成：${filePath}`);
            }
        }
    });
}

// 开始扫描目录
scanDirectory(directoryPath);

// 开始扫描目录
scanDirectory(directoryPath);