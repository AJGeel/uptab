const addCheekyTitle = () => {
  const RNG = Math.random();
  if (RNG >= 0.95) {
    document.title = "What's UpTab? 🥕";
  }
};

export const addEasterEggs = () => {
  addCheekyTitle();
};
