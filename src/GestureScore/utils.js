import { PoseLandmarker } from '@mediapipe/tasks-vision';
import * as tf from '@tensorflow/tfjs'; // Assuming TensorFlow.js for any numerical operations


// Calculates an angle given three points
function calculateAngle(a, b, c) {
    const aVec = tf.tensor(a);
    const bVec = tf.tensor(b);
    const cVec = tf.tensor(c);

    const radians = tf.atan2(cVec.get(1) - bVec.get(1), cVec.get(0) - bVec.get(0))
                     .sub(tf.atan2(aVec.get(1) - bVec.get(1), aVec.get(0) - bVec.get(0)));
    let angle = tf.abs(radians.mul(180.0 / Math.PI)).arraySync();

    if (angle > 180.0) {
        angle = 360 - angle;
    }

    return angle;
}

// Detects a body part's x, y values and visibility
async function detectBodyPart(landmarks, bodyPartName) {
    const bodyPart = landmarks[PoseLandmarker[bodyPartName]];
    return [
        bodyPart.x,
        bodyPart.y,
        bodyPart.visibility
    ];
}

// Returns body parts, x, y as an array (since we're not using DataFrames in JS)
async function detectBodyParts(landmarks) {
    const bodyParts = [];

    // Assuming PoseLandmarker gives access to landmarks in a manner similar to this
    for (const [bodyPartName, landmark] of Object.entries(PoseLandmarker)) {
        const cord = await detectBodyPart(landmarks, bodyPartName);
        bodyParts.push({ bodyPart: bodyPartName, x: cord[0], y: cord[1] });
    }

    return bodyParts;
}

export {calculateAngle, detectBodyParts, detectBodyPart}