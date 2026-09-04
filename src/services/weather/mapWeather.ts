import {
    OpenMeteoResponse,
    Weather,
    HourlyWeather,
} from "./types";

export const mapWeather = (data: OpenMeteoResponse): Weather => {
    const hourly: HourlyWeather[] = data.hourly.time.map((time, index) => ({
        time,
        temperature_2m: data.hourly.temperature_2m[index],
        relative_humidity_2m: data.hourly.relative_humidity_2m[index],
        apparent_temperature: data.hourly.apparent_temperature[index],
        precipitation: data.hourly.precipitation[index],
        rain: data.hourly.rain[index],
        showers: data.hourly.showers[index],
        snowfall: data.hourly.snowfall[index],
        weather_code: data.hourly.weather_code[index],
    }));

    return {
        latitude: data.latitude,
        longitude: data.longitude,
        elevation: data.elevation,
        timezone: data.timezone,
        timezone_abbreviation: data.timezone_abbreviation,
        current: data.current,
        hourly,
    };
};