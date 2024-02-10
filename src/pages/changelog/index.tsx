import { createRoot } from "react-dom/client";

import Changelog from "@/pages/changelog/Changelog";
import "@/assets/styles/tailwind.css";
import "@/pages/newtab/index.css";
import { initSentry } from "@/src/services/initSentry";

initSentry();

const init = () => {
  const rootContainer = document.querySelector("#__root");

  if (!rootContainer) {
    throw new Error("Can't find Changelog root element");
  }

  const root = createRoot(rootContainer);
  root.render(<Changelog />);
};

init();
