import {detectBodyPart, calculateAngle} from './utils'
class BodyPartAngle {
    constructor(landmarks) {
      this.landmarks = landmarks;
    }
  
    async angleOfTheLeftArm() {
      const lShoulder = await detectBodyPart(this.landmarks, "LEFT_SHOULDER");
      const lElbow = await detectBodyPart(this.landmarks, "LEFT_ELBOW");
      const lWrist = await detectBodyPart(this.landmarks, "LEFT_WRIST");
      return calculateAngle(lShoulder, lElbow, lWrist);
    }
  
    async angleOfTheRightArm() {
      const rShoulder = await detectBodyPart(this.landmarks, "RIGHT_SHOULDER");
      const rElbow = await detectBodyPart(this.landmarks, "RIGHT_ELBOW");
      const rWrist = await detectBodyPart(this.landmarks, "RIGHT_WRIST");
      return calculateAngle(rShoulder, rElbow, rWrist);
    }
  
    async angleOfTheLeftShoulder() {
      const lHip = await detectBodyPart(this.landmarks, "LEFT_HIP");
      const lShoulder = await detectBodyPart(this.landmarks, "LEFT_SHOULDER");
      const lElbow = await detectBodyPart(this.landmarks, "LEFT_ELBOW");
      return calculateAngle(lHip, lShoulder, lElbow);
    }
  
    async angleOfTheRightShoulder() {
      const rHip = await detectBodyPart(this.landmarks, "RIGHT_HIP");
      const rShoulder = await detectBodyPart(this.landmarks, "RIGHT_SHOULDER");
      const rElbow = await detectBodyPart(this.landmarks, "RIGHT_ELBOW");
      return calculateAngle(rHip, rShoulder, rElbow);
    }
  
    async angleOfTheLeftLeg() {
      const lHip = await detectBodyPart(this.landmarks, "LEFT_HIP");
      const lKnee = await detectBodyPart(this.landmarks, "LEFT_KNEE");
      const lAnkle = await detectBodyPart(this.landmarks, "LEFT_ANKLE");
      return calculateAngle(lHip, lKnee, lAnkle);
    }
  
    async angleOfTheRightLeg() {
      const rHip = await detectBodyPart(this.landmarks, "RIGHT_HIP");
      const rKnee = await detectBodyPart(this.landmarks, "RIGHT_KNEE");
      const rAnkle = await detectBodyPart(this.landmarks, "RIGHT_ANKLE");
      return calculateAngle(rHip, rKnee, rAnkle);
    }
  
    async angleOfTheNeck() {
      const rShoulder = await detectBodyPart(this.landmarks, "RIGHT_SHOULDER");
      const lShoulder = await detectBodyPart(this.landmarks, "LEFT_SHOULDER");
      const rMouth = await detectBodyPart(this.landmarks, "MOUTH_RIGHT");
      const lMouth = await detectBodyPart(this.landmarks, "MOUTH_LEFT");
      const rHip = await detectBodyPart(this.landmarks, "RIGHT_HIP");
      const lHip = await detectBodyPart(this.landmarks, "LEFT_HIP");
  
      const shoulderAvg = [(rShoulder[0] + lShoulder[0]) / 2, (rShoulder[1] + lShoulder[1]) / 2];
      const mouthAvg = [(rMouth[0] + lMouth[0]) / 2, (rMouth[1] + lMouth[1]) / 2];
      const hipAvg = [(rHip[0] + lHip[0]) / 2, (rHip[1] + lHip[1]) / 2];
  
      return Math.abs(180 - calculateAngle(mouthAvg, shoulderAvg, hipAvg));
    }
  
    async angleOfTheAbdomen() {
      const rShoulder = await detectBodyPart(this.landmarks, "RIGHT_SHOULDER");
      const lShoulder = await detectBodyPart(this.landmarks, "LEFT_SHOULDER");
      const shoulderAvg = [(rShoulder[0] + lShoulder[0]) / 2, (rShoulder[1] + lShoulder[1]) / 2];
  
      const rHip = await detectBodyPart(this.landmarks, "RIGHT_HIP");
      const lHip = await detectBodyPart(this.landmarks, "LEFT_HIP");
      const hipAvg = [(rHip[0] + lHip[0]) / 2, (rHip[1] + lHip[1]) / 2];
  
      const rKnee = await detectBodyPart(this.landmarks, "RIGHT_KNEE");
      const lKnee = await detectBodyPart(this.landmarks, "LEFT_KNEE");
      const kneeAvg = [(rKnee[0] + lKnee[0]) / 2, (rKnee[1] + lKnee[1]) / 2];
  
      return calculateAngle(shoulderAvg, hipAvg, kneeAvg);
    }
  }
  
  export default BodyPartAngle