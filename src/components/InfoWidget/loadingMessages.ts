export const LOADING_MESSAGES = [
  "Squinting at the sky...",
  "Asking the clouds nicely...",
  "Sticking a finger in the wind...",
  "Consulting a smug cloud...",
  "Poking the barometer...",
  "Bribing a passing seagull...",
  "Interrogating the horizon...",
  "Waiting for the sun to RSVP...",
  "Sniffing the air for rain...",
  "Counting clouds, badly...",
  "Peeking behind the curtains...",
  "Deciding on umbrella o'clock...",
  "Tapping the weather vane...",
  "Eavesdropping on the clouds...",
  "Consulting grandpa's knee...",
];

export const pickLoadingMessage = () =>
  LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)];
