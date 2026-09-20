import { format, isToday } from "date-fns";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useLocationAndWeather } from "@/src/hooks/queries/useLocationAndWeather";
import { Modals, useModalStore } from "@/src/hooks/stores/useModalStore";
import { mapWeatherCode } from "@/src/services/weather";

import Button from "../../ui/Button";
import Modal from "../../ui/Modal";

const getDayLabel = (date: Date) =>
  isToday(date) ? "Today" : format(date, "EEEE");

const WeatherForecastModal = () => {
  const activeModal = useModalStore((state) => state.activeModal);
  const setActiveModal = useModalStore((state) => state.setActiveModal);

  const {
    data: { weatherData, locationData },
    isPending: { isLocationPending, isWeatherPending },
    isError: { isLocationError, isWeatherError },
  } = useLocationAndWeather();

  const isPending = isLocationPending || isWeatherPending;
  const isError = isLocationError || isWeatherError;

  const forecast = weatherData?.hourly.filter((hour) => {
    const now = new Date();

    const currentHour = new Date(now);
    currentHour.setMinutes(0, 0, 0);

    const dayAfterTomorrow = new Date(currentHour);
    dayAfterTomorrow.setDate(currentHour.getDate() + 2);
    dayAfterTomorrow.setHours(23, 0, 0, 0);

    const hourTime = new Date(hour.time);

    return hourTime >= currentHour && hourTime <= dayAfterTomorrow;
  });

  const chartData = forecast?.map((hour) => {
    const date = new Date(hour.time);
    const weatherCode = mapWeatherCode(hour.weather_code);

    return {
      time: hour.time,
      temperature: Math.round(hour.temperature_2m),
      rain: Number(hour.rain.toFixed(1)),
      weatherImage: weatherCode?.image,
      weatherDescription: weatherCode?.description,
      timeLabel: date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      dayLabel: getDayLabel(date),
    };
  });

  return (
    <Modal
      isVisible={activeModal === Modals.weather_forecast}
      onClose={() => setActiveModal(null)}
      title="Weather Forecast"
      subtitle={
        locationData?.area
          ? `Here's what to expect in ${locationData.area}.`
          : undefined
      }
      className="max-w-4xl"
    >
      {isPending && <p className="text-sm text-gray-500">Loading weather...</p>}

      {isError && (
        <p className="text-sm text-red-500">Unable to load weather data.</p>
      )}

      {!isPending && !isError && chartData && (
        <div className="mt-4 h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData}>
              <CartesianGrid
                strokeDasharray="10 5"
                stroke="currentColor"
                horizontal={false}
                className="text-black/10"
              />

              <XAxis
                dataKey="time"
                tickLine={false}
                axisLine={false}
                minTickGap={60}
                tick={{ fontSize: 12 }}
                tickFormatter={(value) =>
                  new Date(value).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                }
              />

              {/* Rain */}
              <YAxis
                yAxisId="rain"
                orientation="right"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12 }}
                width={40}
                tickFormatter={(value) => `${value} mm`}
              />

              {/* Temperature */}
              <YAxis
                yAxisId="temperature"
                orientation="left"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12 }}
                width={40}
                tickFormatter={(value) => `${value}°`}
              />

              <Tooltip
                cursor={{
                  fill: "currentColor",
                  className: "text-black/5",
                }}
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length || !label) {
                    return null;
                  }

                  const data = payload[0]?.payload;

                  if (!data) {
                    return null;
                  }

                  const date = new Date(label);

                  return (
                    <div className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm shadow-lg">
                      <div className="mb-2 flex items-center gap-2">
                        {data.weatherImage && (
                          <img
                            src={data.weatherImage}
                            alt={data.weatherDescription ?? ""}
                            className="size-10 shrink-0"
                          />
                        )}

                        <div>
                          {data.weatherDescription && (
                            <p className="font-medium">
                              {data.weatherDescription}
                            </p>
                          )}
                          <p className="text-xs text-black/50">
                            {getDayLabel(date)} ·{" "}
                            {date.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-0.5 text-black/70">
                        <p>
                          Temperature:{" "}
                          <span className="font-medium text-black">
                            {
                              payload.find(
                                (item) => item.dataKey === "temperature",
                              )?.value
                            }
                            °
                          </span>
                        </p>

                        <p>
                          Rain:{" "}
                          <span className="font-medium text-black">
                            {
                              payload.find((item) => item.dataKey === "rain")
                                ?.value
                            }{" "}
                            mm
                          </span>
                        </p>
                      </div>
                    </div>
                  );
                }}
              />

              <Bar
                yAxisId="rain"
                dataKey="rain"
                name="Rain"
                fill="currentColor"
                className="text-sky-400"
                radius={[3, 3, 0, 0]}
                maxBarSize={12}
              />

              <Line
                yAxisId="temperature"
                type="monotone"
                dataKey="temperature"
                name="Temperature"
                stroke="currentColor"
                className="text-orange-500"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 4 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="mt-8 flex justify-end">
        <Button label="Got it, thanks." onClick={() => setActiveModal(null)} />
      </div>
    </Modal>
  );
};

export default WeatherForecastModal;
