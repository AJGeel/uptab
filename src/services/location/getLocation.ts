import { GpsFailure, Location } from "./types";

export class GpsError extends Error {
  constructor(readonly reason: GpsFailure) {
    super(`Unable to get the current location: ${reason}.`);
  }
}

const PERMISSION_DENIED = 1;
const TIMEOUT = 3;

/**
 * A fast, high accuracy attempt first, then low accuracy: that's quicker and
 * plenty for weather. The delay is the backoff before each attempt.
 */
export const GPS_ATTEMPTS = [
  { delay: 0, enableHighAccuracy: true },
  { delay: 500, enableHighAccuracy: false },
  { delay: 1500, enableHighAccuracy: false },
] as const;

const GPS_TIMEOUT = 4000;
const GPS_MAX_AGE = 3600000;

const getFailure = ({ code }: GeolocationPositionError): GpsFailure => {
  if (code === PERMISSION_DENIED) {
    return "denied";
  }

  return code === TIMEOUT ? "timeout" : "unavailable";
};

const getPosition = (enableHighAccuracy: boolean): Promise<Location> =>
  new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new GpsError("unavailable"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        resolve({ latitude: coords.latitude, longitude: coords.longitude });
      },
      (error) => {
        reject(new GpsError(getFailure(error)));
      },
      { enableHighAccuracy, maximumAge: GPS_MAX_AGE, timeout: GPS_TIMEOUT },
    );
  });

/**
 * Retries timeouts and unavailable positions. A denied permission isn't
 * retried: the browser won't ask again, so it would only delay the failure.
 */
export const getLocation = async (): Promise<Location> => {
  let failure = new GpsError("unavailable");

  for (const { delay, enableHighAccuracy } of GPS_ATTEMPTS) {
    if (delay) {
      await new Promise((resolve) => setTimeout(resolve, delay));
    }

    try {
      return await getPosition(enableHighAccuracy);
    } catch (error) {
      failure = error as GpsError;

      if (failure.reason === "denied") {
        break;
      }
    }
  }

  throw failure;
};
