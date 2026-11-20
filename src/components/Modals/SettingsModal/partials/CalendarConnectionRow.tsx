import { useState } from "react";

import { Modals, useModalStore } from "@/src/hooks/stores/useModalStore";
import { useCalendarConnection } from "@/src/hooks/useCalendarConnection";

import SettingRow from "./SettingRow";
import Button, { buttonVariants } from "../../../ui/Button";
import Modal from "../../../ui/Modal";
import { CustomEntry } from "../settingsRegistry";

type Props = {
  entry: CustomEntry;
  query: string;
};

/** Connects or disconnects the calendar, which asks first before forgetting it. */
const CalendarConnectionRow = ({ entry, query }: Props) => {
  const openModal = useModalStore((state) => state.openModal);
  const { isConnected, connection, disconnect } = useCalendarConnection();
  const [isConfirming, setIsConfirming] = useState(false);

  return (
    <>
      <SettingRow
        settingId={entry.id}
        icon={entry.icon}
        title={connection?.label ?? entry.title}
        description={isConnected ? "Connected." : entry.description}
        query={query}
      >
        {isConnected ? (
          <Button
            label="Disconnect"
            variant={buttonVariants.secondary}
            className="shrink-0 border bg-surface whitespace-nowrap"
            onClick={() => setIsConfirming(true)}
          />
        ) : (
          <Button
            label="Connect…"
            variant={buttonVariants.secondary}
            className="shrink-0 border bg-surface whitespace-nowrap"
            onClick={() => openModal(Modals.calendarConnect)}
          />
        )}
      </SettingRow>

      {isConnected === false && (
        <p className="px-3 pb-2 text-sm text-gray-700">
          The address you paste stays on this device. UpTab only reads your
          events and never changes them.
        </p>
      )}

      <Modal
        isVisible={isConfirming}
        onClose={() => setIsConfirming(false)}
        title="Disconnect your calendar?"
        subtitle={`UpTab forgets the address and saved events, and gives up access to ${connection?.host ?? "your calendar"}.`}
        footer={
          <div className="flex items-center justify-end gap-2">
            <Button
              label="Cancel"
              variant={buttonVariants.secondary}
              onClick={() => setIsConfirming(false)}
            />
            <Button
              label="Disconnect"
              className="bg-red-500 ring-red-500"
              onClick={() => {
                void disconnect();
                setIsConfirming(false);
              }}
            />
          </div>
        }
      />
    </>
  );
};

export default CalendarConnectionRow;
