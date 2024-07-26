// const apiUrl = "https://uptab.vercel.app/api/background";
const apiUrl = "http://localhost:3000/api/background";

export const getBackground = async (theme?: string) => {
  try {
    const url = theme ? `${apiUrl}?theme=${theme}` : apiUrl;

    const response = await fetch(url, {
      mode: "cors",
      headers: {
        "Uptab-Api-Key": import.meta.env.UPTAB_API_KEY ?? "",
      },
    });

    console.log(response);

    const image = await response.json();

    console.log(image);

    return image;
  } catch (error) {
    throw new Error(`Unable to get an image from the backend: ${error}`);
  }
};
