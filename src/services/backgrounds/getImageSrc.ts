import { pickRendition } from "./pickRendition";
import { BackgroundImage } from "./types";

/** The photo's URL at the size that suits this screen. */
export const getImageSrc = (image: BackgroundImage) =>
  pickRendition(
    image.sources,
    Math.round(window.screen.width * window.devicePixelRatio),
  )?.url;
