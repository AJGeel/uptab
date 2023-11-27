export const getRootDomain = (url: string) => {
  try {
    const parsedUrl = new URL(url);
    let domainParts = parsedUrl.hostname.split(".");

    // If the domain starts with 'www.', remove it
    if (domainParts.length > 1 && domainParts[0].toLowerCase() === "www") {
      domainParts.shift();
    }

    // If the domain has subdomains like 'dev.mywebsite.com', take the last two parts
    if (domainParts.length > 1) {
      domainParts = domainParts.slice(-2);
    }

    return domainParts.join(".");
  } catch (error) {
    console.error("Invalid URL:", url);
    return url;
  }
};
