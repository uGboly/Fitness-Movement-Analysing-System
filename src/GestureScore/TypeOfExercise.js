import BodyPartAngle from './BodyPartAngle'
import { detectBodyPart } from './utils'

class TypeOfExercise extends BodyPartAngle {
  pushUp(counter, status, avgScore) {
    const leftArmAngle = this.angleOfTheLeftArm()
    const rightArmAngle = this.angleOfTheRightArm()
    const avgArmAngle = Math.floor((leftArmAngle + rightArmAngle) / 2)

    const standard = [45, 170]
    const standardSum = 2 * standard.reduce((a, b) => a + b, 0)

    if (status) {
      if (avgArmAngle < 70) {
        counter += 1
        status = false
      }
      if (avgArmAngle > 160) {
        status = true
      }
      const leftArmScore =
        (1 - Math.abs((leftArmAngle - standard[0]) / standardSum)) * 100
      const rightArmScore =
        (1 - Math.abs((rightArmAngle - standard[0]) / standardSum)) * 100
      const leftLegScore =
        (1 - Math.abs((this.angleOfTheLeftLeg() - standard[1]) / standardSum)) *
        100
      const rightLegScore =
        (1 -
          Math.abs((this.angleOfTheRightLeg() - standard[1]) / standardSum)) *
        100
      avgScore =
        (leftArmScore + rightArmScore + leftLegScore + rightLegScore) / 4
    } else {
      if (avgArmAngle > 160) {
        status = true
      }
      avgScore = 0
    }

    return [counter, status, avgScore]
  }

  pullUp(counter, status, avgScore) {
    const nose = detectBodyPart(this.landmarks, 0)
    const leftElbow = detectBodyPart(this.landmarks, 13)
    const rightElbow = detectBodyPart(this.landmarks, 14)
    const avgShoulderY = (leftElbow[1] + rightElbow[1]) / 2

    const standard = [30, 45]
    const standardSum = 2 * standard.reduce((a, b) => a + b, 0)

    if (status) {
      if (nose[1] > avgShoulderY) {
        counter += 1
        status = false
      }
      avgScore = this.calculateScoresForPullUp(standard, standardSum) / 4
    } else {
      if (nose[1] < avgShoulderY) {
        status = true
      }
      avgScore = 0
    }

    return [counter, status, avgScore]
  }

  calculateScoresForPullUp(standard, standardSum) {
    const leftArmScore =
      (1 - Math.abs((this.angleOfTheLeftArm() - standard[0]) / standardSum)) *
      100
    const rightArmScore =
      (1 - Math.abs((this.angleOfTheRightArm() - standard[0]) / standardSum)) *
      100
    const leftShoulderScore =
      (1 -
        Math.abs((this.angleOfTheLeftShoulder() - standard[1]) / standardSum)) *
      100
    const rightShoulderScore =
      (1 -
        Math.abs(
          (this.angleOfTheRightShoulder() - standard[1]) / standardSum
        )) *
      100
    return leftArmScore + rightArmScore + leftShoulderScore + rightShoulderScore
  }

  squat(counter, status, avgScore) {
    const leftLegAngle = this.angleOfTheLeftLeg()
    const rightLegAngle = this.angleOfTheRightLeg()
    const avgLegAngle = Math.floor((leftLegAngle + rightLegAngle) / 2)

    const standard = [45, 160]
    const standardSum = 2 * standard.reduce((a, b) => a + b, 0)

    if (status) {
      if (avgLegAngle < 70) {
        counter += 1
        status = false
      }
      const leftLegScore =
        (1 - Math.abs((leftLegAngle - standard[0]) / standardSum)) * 100
      const rightLegScore =
        (1 - Math.abs((rightLegAngle - standard[0]) / standardSum)) * 100
      const abdomenScore =
        (1 - Math.abs((this.angleOfTheAbdomen() - standard[1]) / standardSum)) *
        100
      avgScore = (leftLegScore + rightLegScore + abdomenScore) / 3
    } else {
      if (avgLegAngle > 160) {
        status = true
      }
      avgScore = 0
    }

    return [counter, status, avgScore]
  }

  walk(counter, status) {
    const rightKnee = detectBodyPart(this.landmarks, 26)
    const leftKnee = detectBodyPart(this.landmarks, 25)

    if (status) {
      if (leftKnee[0] > rightKnee[0]) {
        counter += 1
        status = false
      }
    } else {
      if (leftKnee[0] < rightKnee[0]) {
        counter += 1
        status = true
      }
    }

    return [counter, status]
  }

  sitUp(counter, status, avgScore) {
    const angle = this.angleOfTheAbdomen()

    const standard = [45, 160]
    const standardSum = 2 * standard.reduce((a, b) => a + b, 0)

    if (status) {
      if (angle < 55) {
        counter += 1
        status = false
      }
      const abdomenScore =
        (1 - Math.abs((angle - standard[0]) / standardSum)) * 100
      const leftLegScore =
        (1 - Math.abs((this.angleOfTheLeftLeg() - standard[1]) / standardSum)) *
        100
      const rightLegScore =
        (1 -
          Math.abs((this.angleOfTheRightLeg() - standard[1]) / standardSum)) *
        100
      avgScore = (abdomenScore + leftLegScore + rightLegScore) / 3
    } else {
      if (angle > 105) {
        status = true
      }
      avgScore = 0
    }

    return [counter, status, avgScore]
  }

  calculateExercise(exerciseType, counter, status, avgScore) {
    try {
      switch (exerciseType) {
        case 'push-up':
          return this.pushUp(counter, status, avgScore)
        case 'pull-up':
          return this.pullUp(counter, status, avgScore)
        case 'squat':
          return this.squat(counter, status, avgScore)
        case 'walk':
          // Note: The 'walk' method does not use avgScore, so handle it accordingly.
          const [walkCounter, walkStatus] = this.walk(counter, status)
          return [walkCounter, walkStatus, 0]
        case 'sit-up':
          return this.sitUp(counter, status, avgScore)
        default:
          throw new Error('Unknown exercise type')
      }
    } catch (e) {
      return [counter, status, avgScore]
    }

  }
}

export default TypeOfExercise
