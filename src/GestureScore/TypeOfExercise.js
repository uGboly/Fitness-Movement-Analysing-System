import BodyPartAngle from './BodyPartAngle'
import {detectBodyPart} from './utils'

class TypeOfExercise extends BodyPartAngle {
  constructor (landmarks) {
    super(landmarks)
  }

  async pushUp (counter, status, avgScore) {
    const leftArmAngle = await this.angleOfTheLeftArm()
    const rightArmAngle = await this.angleOfTheRightArm()
    const avgArmAngle = Math.floor((leftArmAngle + rightArmAngle) / 2)

    const standard = [45, 170]
    const standardSum = 2 * standard.reduce((a, b) => a + b, 0)

    if (status) {
      if (avgArmAngle < 70) {
        counter += 1
        status = false
      }
      avgScore = 0
    } else {
      if (avgArmAngle > 160) {
        status = true
      }
      const leftArmScore =
        (1 - Math.abs((leftArmAngle - standard[0]) / standardSum)) * 100
      const rightArmScore =
        (1 - Math.abs((rightArmAngle - standard[0]) / standardSum)) * 100
      const leftLegScore =
        (1 -
          Math.abs(
            ((await this.angleOfTheLeftLeg()) - standard[1]) / standardSum
          )) *
        100
      const rightLegScore =
        (1 -
          Math.abs(
            ((await this.angleOfTheRightLeg()) - standard[1]) / standardSum
          )) *
        100
      avgScore =
        (leftArmScore + rightArmScore + leftLegScore + rightLegScore) / 4
    }

    return [counter, status, avgScore]
  }

  async pullUp (counter, status, avgScore) {
    const nose = await detectBodyPart(this.landmarks, 'NOSE')
    const leftElbow = await detectBodyPart(this.landmarks, 'LEFT_ELBOW')
    const rightElbow = await detectBodyPart(this.landmarks, 'RIGHT_ELBOW')
    const avgShoulderY = (leftElbow[1] + rightElbow[1]) / 2

    const standard = [30, 45]
    const standardSum = 2 * standard.reduce((a, b) => a + b, 0)

    if (status) {
      if (nose[1] > avgShoulderY) {
        counter += 1
        status = false
      }
      avgScore =
        (await this.calculateScoresForPullUp(standard, standardSum)) / 4
    } else {
      if (nose[1] < avgShoulderY) {
        status = true
      }
      avgScore = 0
    }

    return [counter, status, avgScore]
  }

  async calculateScoresForPullUp (standard, standardSum) {
    const leftArmScore =
      (1 -
        Math.abs(
          ((await this.angleOfTheLeftArm()) - standard[0]) / standardSum
        )) *
      100
    const rightArmScore =
      (1 -
        Math.abs(
          ((await this.angleOfTheRightArm()) - standard[0]) / standardSum
        )) *
      100
    const leftShoulderScore =
      (1 -
        Math.abs(
          ((await this.angleOfTheLeftShoulder()) - standard[1]) / standardSum
        )) *
      100
    const rightShoulderScore =
      (1 -
        Math.abs(
          ((await this.angleOfTheRightShoulder()) - standard[1]) / standardSum
        )) *
      100
    return leftArmScore + rightArmScore + leftShoulderScore + rightShoulderScore
  }

  async squat (counter, status, avgScore) {
    const leftLegAngle = await this.angleOfTheLeftLeg()
    const rightLegAngle = await this.angleOfTheRightLeg()
    const avgLegAngle = Math.floor((leftLegAngle + rightLegAngle) / 2)

    const standard = [45, 160]
    const standardSum = 2 * standard.reduce((a, b) => a + b, 0)

    if (status) {
      if (avgLegAngle < 70) {
        counter += 1
        status = false
      }
      avgScore = 0
    } else {
      if (avgLegAngle > 160) {
        status = true
      }
      const leftLegScore =
        (1 - Math.abs((leftLegAngle - standard[0]) / standardSum)) * 100
      const rightLegScore =
        (1 - Math.abs((rightLegAngle - standard[0]) / standardSum)) * 100
      const abdomenScore =
        (1 -
          Math.abs(
            ((await this.angleOfTheAbdomen()) - standard[1]) / standardSum
          )) *
        100
      avgScore = (leftLegScore + rightLegScore + abdomenScore) / 3
    }

    return [counter, status, avgScore]
  }

  async walk (counter, status) {
    const rightKnee = await detectBodyPart(this.landmarks, 'RIGHT_KNEE')
    const leftKnee = await detectBodyPart(this.landmarks, 'LEFT_KNEE')

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

  async sitUp (counter, status, avgScore) {
    const angle = await this.angleOfTheAbdomen()

    const standard = [45, 160]
    const standardSum = 2 * standard.reduce((a, b) => a + b, 0)

    if (status) {
      if (angle < 55) {
        counter += 1
        status = false
      }
      avgScore = 0
    } else {
      if (angle > 105) {
        status = true
      }
      const abdomenScore =
        (1 - Math.abs((angle - standard[0]) / standardSum)) * 100
      const leftLegScore =
        (1 -
          Math.abs(
            ((await this.angleOfTheLeftLeg()) - standard[1]) / standardSum
          )) *
        100
      const rightLegScore =
        (1 -
          Math.abs(
            ((await this.angleOfTheRightLeg()) - standard[1]) / standardSum
          )) *
        100
      avgScore = (abdomenScore + leftLegScore + rightLegScore) / 3
    }

    return [counter, status, avgScore]
  }

  async calculateExercise(exerciseType, counter, status, avgScore) {
    switch (exerciseType) {
      case "push-up":
        return await this.pushUp(counter, status, avgScore);
      case "pull-up":
        return await this.pullUp(counter, status, avgScore);
      case "squat":
        return await this.squat(counter, status, avgScore);
      case "walk":
        // Note: The 'walk' method does not use avgScore, so handle it accordingly.
        const [walkCounter, walkStatus] = await this.walk(counter, status);
        return [walkCounter, walkStatus, 0];
      case "sit-up":
        return await this.sitUp(counter, status, avgScore);
      default:
        throw new Error("Unknown exercise type");
    }
  }
  
}

export default TypeOfExercise