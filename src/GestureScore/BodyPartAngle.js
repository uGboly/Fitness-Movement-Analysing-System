import { detectBodyPart, calculateAngle } from './utils'
class BodyPartAngle {
  constructor (landmarks) {
    this.landmarks = landmarks
  }

  angleOfTheLeftArm () {
    const lShoulder = detectBodyPart(this.landmarks, 11)
    const lElbow = detectBodyPart(this.landmarks, 13)
    const lWrist = detectBodyPart(this.landmarks, 15)
    return calculateAngle(lShoulder, lElbow, lWrist)
  }

  angleOfTheRightArm () {
    const rShoulder = detectBodyPart(this.landmarks, 12)
    const rElbow = detectBodyPart(this.landmarks, 14)
    const rWrist = detectBodyPart(this.landmarks, 16)
    return calculateAngle(rShoulder, rElbow, rWrist)
  }

  angleOfTheLeftShoulder () {
    const lHip = detectBodyPart(this.landmarks, 23)
    const lShoulder = detectBodyPart(this.landmarks, 11)
    const lElbow = detectBodyPart(this.landmarks, 13)
    return calculateAngle(lHip, lShoulder, lElbow)
  }

  angleOfTheRightShoulder () {
    const rHip = detectBodyPart(this.landmarks, 24)
    const rShoulder = detectBodyPart(this.landmarks, 12)
    const rElbow = detectBodyPart(this.landmarks, 14)
    return calculateAngle(rHip, rShoulder, rElbow)
  }

  angleOfTheLeftLeg () {
    const lHip = detectBodyPart(this.landmarks, 23)
    const lKnee = detectBodyPart(this.landmarks, 25)
    const lAnkle = detectBodyPart(this.landmarks, 27)
    return calculateAngle(lHip, lKnee, lAnkle)
  }

  angleOfTheRightLeg () {
    const rHip = detectBodyPart(this.landmarks, 24)
    const rKnee = detectBodyPart(this.landmarks, 26)
    const rAnkle = detectBodyPart(this.landmarks, 28)
    return calculateAngle(rHip, rKnee, rAnkle)
  }

  angleOfTheNeck () {
    const rShoulder = detectBodyPart(this.landmarks, 12)
    const lShoulder = detectBodyPart(this.landmarks, 11)
    const rMouth = detectBodyPart(this.landmarks, 10)
    const lMouth = detectBodyPart(this.landmarks, 9)
    const rHip = detectBodyPart(this.landmarks, 24)
    const lHip = detectBodyPart(this.landmarks, 23)

    const shoulderAvg = [
      (rShoulder[0] + lShoulder[0]) / 2,
      (rShoulder[1] + lShoulder[1]) / 2
    ]
    const mouthAvg = [(rMouth[0] + lMouth[0]) / 2, (rMouth[1] + lMouth[1]) / 2]
    const hipAvg = [(rHip[0] + lHip[0]) / 2, (rHip[1] + lHip[1]) / 2]

    return Math.abs(180 - calculateAngle(mouthAvg, shoulderAvg, hipAvg))
  }

  angleOfTheAbdomen () {
    const rShoulder = detectBodyPart(this.landmarks, 12)
    const lShoulder = detectBodyPart(this.landmarks, 11)
    const shoulderAvg = [
      (rShoulder[0] + lShoulder[0]) / 2,
      (rShoulder[1] + lShoulder[1]) / 2
    ]

    const rHip = detectBodyPart(this.landmarks, 24)
    const lHip = detectBodyPart(this.landmarks, 23)
    const hipAvg = [(rHip[0] + lHip[0]) / 2, (rHip[1] + lHip[1]) / 2]

    const rKnee = detectBodyPart(this.landmarks, 26)
    const lKnee = detectBodyPart(this.landmarks, 25)
    const kneeAvg = [(rKnee[0] + lKnee[0]) / 2, (rKnee[1] + lKnee[1]) / 2]

    return calculateAngle(shoulderAvg, hipAvg, kneeAvg)
  }
}

export default BodyPartAngle
