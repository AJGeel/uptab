export type DailyWeatherDescription = {
  description: string;
  image: string;
};

export type WeatherDescription = {
  [code: string]: {
    day: DailyWeatherDescription;
    night: DailyWeatherDescription;
  };
};

export type OpenMeteoResponse = {
  longitude: number;
  latitude: number;
  elevation: number;
  current_units: {
    time: "iso8601";
    temperature_2m: string;
  };
  current: {
    time: string;
    temperature_2m: number;
    weather_code: number;
  };
};
