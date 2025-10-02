const C_ORIGIN = 0;
const C_LINEAR = 1;
const C_QUADRATIC = 2;

const sceneInformation = {
  "act1": {
    "curves": [
      [   C_ORIGIN, [ [0.0, 0.0, 0.0] ]],
      [   C_LINEAR, [ [1.0, 1.0, 1.0] ]],
      [   C_LINEAR, [ [4.0, -3.0, -2.0] ]],
      [C_QUADRATIC, [ [2.0, 0.0, 1.0], [5.0, -5.0, 5.0] ]],
      [   C_LINEAR, [ [-3.0, 0.0, 0.0] ]]
    ],
    "audio": "audio/audioCut.mp3",
    "subtitles": [
      [0, 3.5, "This is a duck-billed platypus."],
      [3.5, 8, "The local Wiradjuri people, call them Biladurang."],
      [8, 11, "They are very shy, and good at hiding"],
      [11, 15, "so it's extremely rare to see platypus in the wild."]
    ],
    "colour": 0xffff00
  },
  "act2": {
    "curves": [
      [   C_ORIGIN, [ [-3.0, 0.0, 0.0] ]],
      [   C_LINEAR, [ [-1.0, 1.0, -1.0] ]],
      [   C_LINEAR, [ [-4.0, -3.0, 2.0] ]],
      [   C_LINEAR, [ [3.0, 0.0, -0.0] ]]
    ],
    "colour": 0xff00ff,
    "audio": "audio/1156474.mp3",
    "subtitles": [
      [0, 3, "Hello world 2"],
      [3, 6, "More testing 2"],
      [6, 10, "Even morerer testing 2"]
    ],
  }
}

// const sceneInformation = {
//   "act1": {
//     "curves": [
//       [ C_ORIGIN, [ [0.0, 1.0, 0.0]]],
//       [ C_LINEAR, [ [1.0, 1.0, 0.5]]],
//       [ C_LINEAR, [ [1.0, 1.0, 1.0]]],
//       [ C_LINEAR, [ [0.0, 1.0, 1.0]]],
//       [ C_LINEAR, [ [0.0, 1.0, 0.0]]],
//       [ C_LINEAR, [ [1.0, 1.0, 0.5]]]
//     ],
//     "colour": 0xffff00
//   }
// }

// const sceneInformation = {
//   "act1": {
//     "curves": [
//       [ C_ORIGIN, [ [0.0, 1.0, 0.0]]],
//       [ C_QUADRATIC, [ [1.0, 1.0, 0.0], [0.5, 1.0, -0.5]]],
//       [ C_QUADRATIC, [ [1.0, 1.0, 1.0], [1.5, 1.0, 0.5]]],
//       [ C_QUADRATIC, [ [0.0, 1.0, 1.0], [0.5, 1.0, 1.5]]],
//       [ C_QUADRATIC, [ [0.0, 1.0, 0.0], [-0.5, 1.0, 0.5]]]
//       // [ C_LINEAR, [ [1.0, 1.0, 0.5]]]
//     ],
//     "colour": 0xffff00
//   }
// }

export { sceneInformation, C_ORIGIN, C_LINEAR, C_QUADRATIC };
