import { readdirSync, readFileSync } from "fs";
import { resolve } from "path";

const LOCAL_URL = /\/\/(?:localhost|127\.0\.0\.1|\[::1\])(?![\w.-])/;

const TEXT_FILE = /\.(?:js|mjs|html|css|json)$/;

export const findLocalUrl = (content: string) => {
  const match = LOCAL_URL.exec(content);

  return match
    ? content.slice(Math.max(match.index - 20, 0), match.index + 40)
    : undefined;
};

export const findLocalUrlInBuild = (buildDir: string) => {
  for (const file of readdirSync(buildDir, { recursive: true }) as string[]) {
    if (TEXT_FILE.test(file)) {
      const context = findLocalUrl(
        readFileSync(resolve(buildDir, file), "utf8"),
      );

      if (context) {
        return { file, context };
      }
    }
  }
};
