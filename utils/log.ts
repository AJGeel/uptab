/* eslint-disable no-console */
type ColorType = "success" | "info" | "error" | "warning" | keyof typeof COLORS;

export default function colorLog(message: string, type?: ColorType) {
  let color: string = type || COLORS.FgBlack;

  switch (type) {
    case "success":
      color = COLORS.FgGreen;
      break;
    case "info":
      color = COLORS.FgBlue;
      break;
    case "error":
      color = COLORS.FgRed;
      break;
    case "warning":
      color = COLORS.FgYellow;
      break;
    default:
      color = COLORS.Dim;
  }

  console.log(color, message);
}

const COLORS = {
  BgBlack: "\x1b[40m",
  BgBlue: "\x1b[44m",
  BgCyan: "\x1b[46m",
  BgGreen: "\x1b[42m",
  BgMagenta: "\x1b[45m",
  BgRed: "\x1b[41m",
  BgWhite: "\x1b[47m",
  BgYellow: "\x1b[43m",
  Blink: "\x1b[5m",
  Bright: "\x1b[1m",
  Dim: "\x1b[2m",
  FgBlack: "\x1b[30m",
  FgBlue: "\x1b[34m",
  FgCyan: "\x1b[36m",
  FgGreen: "\x1b[32m",
  FgMagenta: "\x1b[35m",
  FgRed: "\x1b[31m",
  FgWhite: "\x1b[37m",
  FgYellow: "\x1b[33m",
  Hidden: "\x1b[8m",
  Reset: "\x1b[0m",
  Reverse: "\x1b[7m",
  Underscore: "\x1b[4m",
} as const;
