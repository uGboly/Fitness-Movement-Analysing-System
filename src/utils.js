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

function summarizeFitnessActivities(data) {
    // 记录每种运动的次数
    const exerciseCounts = {
        'push-up': 0,
        'pull-up': 0,
        'squat': 0,
        'walk': 0,
        'sit-up': 0,
    };

    data.forEach(item => {
        if (exerciseCounts.hasOwnProperty(item.type)) {
            exerciseCounts[item.type] = item.count;
        }
    });

    // 分析哪些运动未进行
    const notPerformed = Object.entries(exerciseCounts).filter(([type, count]) => count === 0).map(([type]) => exerciseNameMap[type]);

    // 分析最多和最少的运动类型
    let maxCount = 0, minCount = Infinity;
    let maxType = '', minType = '';
    Object.entries(exerciseCounts).forEach(([type, count]) => {
        if (count > maxCount) {
            maxCount = count;
            maxType = type;
        }
        if (count < minCount && count > 0) {
            minCount = count;
            minType = type;
        }
    });

    let summary = `您最频繁的运动是${exerciseNameMap[maxType]}（${maxCount}次）。`;
    if (notPerformed.length > 0) {
        summary += ` 您还没有尝试${notPerformed.join('、')}。为了全面发展，建议您考虑加入这些运动。`;
    } else {
        summary += ` 您最少做的是${exerciseNameMap[minType]}（${minCount}次）。考虑增加其频率来平衡训练效果。`;
    }

    // 给出更具体的建议
    summary += " 特别是，";
    if (notPerformed.includes('行走')) {
        summary += "增加行走可以帮助您提高心肺耐力，";
    }
    if (notPerformed.includes('俯卧撑') || notPerformed.includes('引体向上')) {
        summary += "加入俯卧撑或引体向上可以强化上身力量，";
    }
    if (notPerformed.includes('深蹲') || notPerformed.includes('仰卧起坐')) {
        summary += "加入深蹲和仰卧起坐有助于加强下肢和核心肌群，";
    }

    // 移除最后的逗号并添加结束语
    summary = summary.slice(0, -1) + "。持续锻炼，不断挑战自我，可以带来更好的健身效果。";

    return summary;
}
export {speakChinese, exerciseNameMap, summarizeFitnessActivities}