import { getGeocodedLocation } from "@/src/services/location";
import { getWeather } from "@/src/services/weather";
import { mapWeather } from "@/src/services/weather/mapWeather";
import { useQuery } from "@tanstack/react-query";

export const useLocationAndWeather = () => {
    const {
        isError: isLocationError,
        isPending: isLocationPending,
        data: locationData,
    } = useQuery({
        queryFn: getGeocodedLocation,
        queryKey: ["location"],
    });

    const hasLocation =
        locationData?.latitude != null && locationData?.longitude != null;

    const {
        isPending: isWeatherPending,
        isError: isWeatherError,
        data: weatherData,
    } = useQuery({
        enabled: hasLocation,
        queryFn: () =>
            getWeather({
                latitude: locationData!.latitude,
                longitude: locationData!.longitude,
            }),
        select: mapWeather,
        queryKey: ["weather", locationData?.latitude, locationData?.longitude],
    });

    return {
        data: {
            weatherData,
            locationData,
        },
        isPending: {
            isLocationPending,
            isWeatherPending,
        },
        isError: {
            isWeatherError,
            isLocationError,
        },
    };
};