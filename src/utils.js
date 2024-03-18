function speakChinese(text) {
    var msg = new SpeechSynthesisUtterance();
    msg.text = text;
    msg.lang = 'zh-CN'; // 设置语言为简体中文

    // 查找并设置中文语音合成器（如果浏览器支持）
    speechSynthesis.getVoices().forEach(function(voice) {
        if(voice.lang === 'zh-CN') {
            msg.voice = voice;
        }
    });

    // 念出文字
    window.speechSynthesis.speak(msg);
}

const exerciseNameMap = {
    'push-up' : '引体向上',
    'pull-up' : '俯卧撑',
    'squat' : '深蹲',
    'walk' : '行走',
    'sit-up' : '仰卧起坐',
}
export {speakChinese, exerciseNameMap}