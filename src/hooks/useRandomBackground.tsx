import { dailyRandomNumber } from "@src/utils/dailyRandomNumber";
import { useState } from "react";

type Background = {
  src: string;
  author?: string;
  link?: string;
};

const backgrounds: Background[] = [
  {
    src: "/images/backgrounds/body-of-water-beside-wind-mills.jpg",
    author: "Vishwas Katti",
    link: "https://unsplash.com/photos/body-of-water-beside-green-trees-and-wind-mills-x2XDMf-rirc",
  },
  {
    src: "/images/backgrounds/white-sheep-on-green-grass-field.jpg",
    author: "Kwakus",
    link: "https://unsplash.com/photos/white-sheep-on-green-grass-field-during-daytime-yEpUny1hxoE",
  },
  {
    src: "/images/backgrounds/kubuswoningen.jpg",
    author: "Nicole Baster",
    link: "https://unsplash.com/photos/yellow-and-gray-houses-_SD9XBRFig8",
  },
  {
    src: "/images/backgrounds/green-grass-field-kinderdijk.jpg",
    author: "Thomas Bormans",
    link: "https://unsplash.com/photos/green-grass-field-near-body-of-water-during-sunset-kNmlCjM3apA",
  },
  {
    src: "/images/backgrounds/ns-is-not-even-that-late.jpg",
    author: "Lukas Boekhout",
    link: "https://unsplash.com/photos/yellow-train-cqyF7x7gFDI",
  },
  {
    src: "/images/backgrounds/green-grass-field-near-sea.jpg",
    author: "Dana Marin",
    link: "https://unsplash.com/photos/green-grass-field-near-sea-during-daytime-Sa9msnED0RA",
  },
  {
    src: "/images/backgrounds/gray-windmill-photo.jpg",
    author: "Peter Hall",
    link: "https://unsplash.com/photos/gray-windmill-faZ73Tck8Wc",
  },
  {
    src: "/images/backgrounds/a-field-with-a-house-in-the-distance.jpg",
    author: "Tim Cristopher Klonk",
    link: "https://unsplash.com/photos/a-field-with-a-house-in-the-distance-aYxDQzYmjLQ",
  },
  {
    src: "/images/backgrounds/white-highrise-building.jpg",
    author: "Victor",
    link: "https://unsplash.com/photos/white-high-rise-building-at-daytime-qm9pHqVt7KA",
  },
  {
    src: "/images/backgrounds/red-flower-field-near-wind-turbines.jpg",
    author: "Martijn Baudoin",
    link: "https://unsplash.com/photos/red-flower-field-near-wind-turbines-C4rDHqqmu4w",
  },
];

export const useRandomBackground = () => {
  const randomIndex = dailyRandomNumber(1, backgrounds.length);
  const [activeBg, setActiveBg] = useState(backgrounds[randomIndex]);

  return {
    activeBg,
    setActiveBg,
  };
};
