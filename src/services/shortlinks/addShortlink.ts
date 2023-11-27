import { storage } from "webextension-polyfill";
import { getShortlinks } from "./getShortlinks";
import { Shortlink } from "./types";

// const mockData: Shortlink[] = [
//   {
//     id: "d25dff0a-8d1b-11ee-b9d1-0242ac120002",
//     title: "Confluence",
//     subtitle: "Information",
//     url: "https://google.com",
//     favicon: "https://google.com",
//     date: new Date(),
//   },
//   {
//     id: "da1f5e64-8d1b-11ee-b9d1-0242ac120002",
//     title: "Jira",
//     subtitle: "To dos",
//     url: "https://google.com",
//     favicon: "https://google.com",
//     date: new Date(),
//   },
// ];

export const addShortlink = async (newItem: Shortlink) => {
  const existingItems = await getShortlinks();
  const updatedItems = [...existingItems, newItem];
  await storage.local.set({ shortlinks: updatedItems });
};
