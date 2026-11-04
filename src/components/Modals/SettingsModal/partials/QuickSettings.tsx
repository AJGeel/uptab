import { useSettings } from "@/src/hooks/useSettings";

import Button, { buttonVariants } from "../../../ui/Button";
import SegmentedControl from "../../../ui/SegmentedControl";
import { settingEntries } from "../settingEntries";
import { SegmentedEntry } from "../settingsRegistry";

type Props = {
  /** Ids of the preferences to show, which have to be choices from a few options. */
  ids: string[];
  /** Where to find these, and the rest of the preferences. */
  onOpenAll: () => void;
};

/** A few preferences, compact, for changing them where they matter. */
const QuickSettings = ({ ids, onOpenAll }: Props) => {
  const { data: settings, updateSettings } = useSettings();

  if (!settings) {
    return null;
  }

  const entries = ids
    .map((id) => settingEntries.find((entry) => entry.id === id))
    .filter((entry): entry is SegmentedEntry => entry?.kind === "segmented");

  return (
    <div className="mb-4 rounded-xl border bg-white/60 p-3">
      <div className="grid gap-x-8 gap-y-2 sm:grid-cols-2">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="flex items-center justify-between gap-3"
          >
            <span className="text-sm font-medium whitespace-nowrap">
              {entry.title}
            </span>
            <SegmentedControl
              compact
              ariaLabel={entry.title}
              value={entry.get(settings)}
              options={entry.options}
              onValueChange={(value) =>
                updateSettings(entry.set(settings, value))
              }
            />
          </div>
        ))}
      </div>

      <p className="mt-3 text-xs text-gray-600">
        These live in your preferences too.{" "}
        <Button
          label="Open all settings"
          variant={buttonVariants.inline}
          onClick={onOpenAll}
        />
      </p>
    </div>
  );
};

export default QuickSettings;
