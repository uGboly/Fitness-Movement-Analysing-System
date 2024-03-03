import * as tf from '@tensorflow/tfjs' // Assuming TensorFlow.js for any numerical operations

// Calculates an angle given three points
function calculateAngle (a, b, c) {
  const aVec = tf.tensor(a)
  const bVec = tf.tensor(b)
  const cVec = tf.tensor(c)

  // Calculate vectors
  const ba = bVec.sub(aVec)
  const bc = bVec.sub(cVec)

  // Calculate the angle in radians between the two vectors
  const cosineAngle = ba.dot(bc).div(ba.norm().mul(bc.norm()))
  let radians = cosineAngle.acos()

  // Convert radians to degrees
  let angle = radians.mul(180 / Math.PI)

  // Normalize the angle values
  angle = angle.arraySync() // Convert to JavaScript number for comparison and adjustment
  if (angle > 180) {
    angle = 360 - angle
  }

  return angle
}

// Detects a body part's x, y values and visibility
function detectBodyPart (landmarks, bodyPartName) {
  const bodyPart = landmarks[bodyPartName]
  return [bodyPart.x, bodyPart.y, bodyPart.z]
}

// Returns body parts, x, y as an array (since we're not using DataFrames in JS)
//  function detectBodyParts(landmarks) {
//     const bodyParts = [];

//     // Assuming PoseLandmarker gives access to landmarks in a manner similar to this
//     for (const [bodyPartName, landmark] of Object.entries(PoseLandmarker)) {
//         const cord = await detectBodyPart(landmarks, bodyPartName);
//         bodyParts.push({ bodyPart: bodyPartName, x: cord[0], y: cord[1] });
//     }

//     return bodyParts;
// }

export { calculateAngle, detectBodyPart }
