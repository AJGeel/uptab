import { useState } from "react";

import { useEggStore } from "@/src/hooks/stores/useEggStore";
import { useModalStore } from "@/src/hooks/stores/useModalStore";
import { EggId } from "@/src/services/easterEggs/eggs";
import {
  EggSchedule,
  getEggSchedule,
} from "@/src/services/easterEggs/eggSchedule";

import SettingRow from "./SettingRow";
import Select from "../../../ui/Select";
import { SettingEntry } from "../settingsRegistry";

const NONE = "none";

/** When an egg can show, a row per range, with its odds as a bar and a percentage. */
const Odds = ({ rows }: { rows: EggSchedule["rows"] }) => (
  <div className="flex flex-col gap-0.5">
    {rows.map(({ dates, chance }) => (
      <div
        key={dates}
        className="grid grid-cols-[6.5rem_2rem_2.25rem] items-center gap-2"
      >
        <span className="whitespace-nowrap">{dates}</span>
        <span className="h-1 overflow-hidden rounded-full bg-black/5">
          <span
            className="block h-full rounded-full bg-gray-500"
            style={{ width: `${chance * 100}%` }}
          />
        </span>
        <span className="text-right tabular-nums">
          {Math.round(chance * 100)}%
        </span>
      </div>
    ))}
  </div>
);

/** Development only: play any easter egg now, whatever the date or the odds. */
const DevEggs = ({ entry, query }: { entry: SettingEntry; query: string }) => {
  const forced = useEggStore((state) => state.forced);
  const forceEgg = useEggStore((state) => state.forceEgg);
  const closeModal = useModalStore((state) => state.closeModal);
  // In the order of the calendar, with when each can show and the odds.
  const [schedule] = useState(() => getEggSchedule(new Date().getFullYear()));

  return (
    <SettingRow
      settingId={entry.id}
      icon={entry.icon}
      title={entry.title}
      description={entry.description}
      query={query}
    >
      <Select
        ariaLabel={entry.title}
        value={forced?.egg ?? NONE}
        options={[
          { value: NONE, label: "Off" },
          ...schedule.map(({ egg, rows }) => ({
            value: egg,
            label: egg,
            hint: <Odds rows={rows} />,
          })),
        ].map((option) => ({
          ...option,
          // On every click, so picking the egg that's playing plays it again.
          onClick: () => {
            forceEgg(
              option.value === NONE ? undefined : (option.value as EggId),
            );
            // The modal's backdrop would hide the particles.
            closeModal();
          },
        }))}
        // The trigger shows just the name, not the dates.
        triggerLabel={forced?.egg ?? "Off"}
        onValueChange={() => {}}
      />
    </SettingRow>
  );
};

export default DevEggs;
