import { useEffect, useState } from "react";

import {
  getUpdateNotification,
  setUpdateNotification,
} from "@/src/services/updateNotification";

export const useUpdateNotification = () => {
  const [isVisible, setIsVisible] = useState(false);

  const onOpen = () => {
    setIsVisible(false);
    setUpdateNotification(false);
  };

  const onHide = () => {
    setIsVisible(false);
    setUpdateNotification(false);
  };

  // TODO: Refactor in TanStack Query
  useEffect(() => {
    const fetchData = async () => {
      const data = await getUpdateNotification();

      setIsVisible(!!data.newUpdate);
    };

    fetchData();
  }, []);

  return {
    isVisible,
    onOpen,
    onHide,
  };
};
