// 音效相关

const menuClick = document.createElement('audio')
export const initVoice = () => {
    setTimeout(() => {
        menuClick.id = 'audio'
        menuClick.src = './static/click.mp3'
        document.body.appendChild(menuClick)
    }, 2000)
}

export const _playVoice = () => {
    try {
        menuClick.play();
    } catch {
        console.error('音频未加载')
    }
}