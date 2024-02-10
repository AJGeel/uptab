import { useEffect, useState } from "react";

import { getUpdateNotification } from "@/src/services/updateNotification/getUpdateNotification";
import { setUpdateNotification } from "@/src/services/updateNotification/setUpdateNotification";

export const useUpdateNotification = () => {
  const [isVisible, setIsVisible] = useState(false);

  const onOpen = () => {
    window.open("/src/pages/changelog/index.html");
    setIsVisible(false);
    setUpdateNotification(false);
  };

  const onHide = () => {
    setIsVisible(false);
    setUpdateNotification(false);
  };

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
