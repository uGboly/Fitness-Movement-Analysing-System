import i18n from './i18n'

function speak (lng, text) {
  var msg = new SpeechSynthesisUtterance()
  msg.text = text
  msg.lang = lng === 'en' ? 'en' : 'zh-CN'

  speechSynthesis.getVoices().forEach(function (voice) {
    if (voice.lang === msg.lang) {
      msg.voice = voice
    }
  })

  window.speechSynthesis.speak(msg)
}

function summarizeFitnessActivities(data, lng) {
    // Record the count of each exercise
    const exerciseCounts = {
      pushUp: 0,
      pullUp: 0,
      squat: 0,
      walk: 0,
      sitUp: 0
    }
  
    data.forEach(item => {
      if (exerciseCounts.hasOwnProperty(item.type)) {
        exerciseCounts[item.type] = item.count
      }
    })
  
    // Analyze which exercises were not performed
    const notPerformed = Object.entries(exerciseCounts)
      .filter(([type, count]) => count === 0)
      .map(([type, count]) => i18n.t(type))
  
    // Identify the most and least frequent exercise types
    let maxCount = 0,
      minCount = Infinity
    let maxType = '',
      minType = ''
    Object.entries(exerciseCounts).forEach(([type, count]) => {
      if (count > maxCount) {
        maxCount = count
        maxType = type
      }
      if (count < minCount && count > 0) {
        minCount = count
        minType = type
      }
    })
  
    let summary;
    if (lng === 'en') {
      summary = `Your most frequent exercise is ${i18n.t(maxType)} (${maxCount} times).`
      if (notPerformed.length > 0) {
        summary += ` You haven't tried ${notPerformed.join(
          ', '
        )}. For a more balanced workout, consider adding these exercises.`
      } else {
        summary += ` Your least performed exercise is ${i18n.t(minType)} (${minCount} times). Consider increasing its frequency for better balance.`
      }
  
      // Provide more specific recommendations
      summary += ' Specifically, '
      if (notPerformed.includes('walk')) {
        summary += 'adding more walking can improve cardiovascular endurance, '
      }
      if (notPerformed.includes('pushUp') || notPerformed.includes('pullUp')) {
        summary += 'adding push-ups or pull-ups can strengthen your upper body, '
      }
      if (notPerformed.includes('squat') || notPerformed.includes('sitUp')) {
        summary += 'adding squats and sit-ups can strengthen your lower body and core, '
      }
  
      // Remove the last comma and add closing message
      summary =
        summary.slice(0, -2) + '. Regular exercise and continuous self-challenge can lead to better fitness results.'
    } else {
      summary = `您最频繁的运动是${i18n.t(maxType)}（${maxCount}次）。`
      if (notPerformed.length > 0) {
        summary += ` 您还没有尝试${notPerformed.join(
          '、'
        )}。为了全面发展，建议您考虑加入这些运动。`
      } else {
        summary += ` 您最少做的是${i18n.t(minType)}（${minCount}次）。考虑增加其频率来平衡训练效果。`
      }
  
      // Provide more specific recommendations
      summary += ' 特别是，'
      if (notPerformed.includes('行走')) {
        summary += '增加行走可以帮助您提高心肺耐力，'
      }
      if (notPerformed.includes('俯卧撑') || notPerformed.includes('引体向上')) {
        summary += '加入俯卧撑或引体向上可以强化上身力量，'
      }
      if (notPerformed.includes('深蹲') || notPerformed.includes('仰卧起坐')) {
        summary += '加入深蹲和仰卧起坐有助于加强下肢和核心肌群，'
      }
  
      // Remove the last comma and add closing message
      summary =
        summary.slice(0, -1) + '。持续锻炼，不断挑战自我，可以带来更好的健身效果。'
    }
  
    return summary
  }
  
export { speak, summarizeFitnessActivities }
