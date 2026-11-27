import { useEggStore } from "@/src/hooks/stores/useEggStore";
import { useModalStore } from "@/src/hooks/stores/useModalStore";
import { EggId, eggs } from "@/src/services/easterEggs/eggs";

import SettingRow from "./SettingRow";
import Select from "../../../ui/Select";
import { SettingEntry } from "../settingsRegistry";

const NONE = "none";

/** Development only: play any easter egg now, whatever the date or the odds. */
const DevEggs = ({ entry, query }: { entry: SettingEntry; query: string }) => {
  const forced = useEggStore((state) => state.forced);
  const forceEgg = useEggStore((state) => state.forceEgg);
  const closeModal = useModalStore((state) => state.closeModal);

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
          ...Object.keys(eggs).map((id) => ({ value: id, label: id })),
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
        onValueChange={() => {}}
      />
    </SettingRow>
  );
};

export default DevEggs;
