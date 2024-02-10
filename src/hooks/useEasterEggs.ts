import { useEffect } from "react";

import { addEasterEggs } from "../services/addEasterEggs";

// This hook initializes easter egg features when the component mounts
export const useEasterEggs = () => {
  useEffect(() => {
    addEasterEggs();
  }, []);
};
