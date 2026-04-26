export const siteConfig = {
  launchKey: "coming-soon",
  comingSoonConfig: {
    title: "Goldicarat - Coming Soon",
    description: "Goldicarat - Premium Lab Grown Diamond Jewelry. Experience the brilliance of ethically created, stunning diamond jewelry.",
    ogTitle: "Goldicarat - Coming Soon",
    ogDescription: "Premium Lab Grown Diamond Jewelry. Experience the brilliance of ethically created, stunning diamond jewelry.",
  }
};

export const isComingSoon = () => {
  return siteConfig.launchKey === "coming-soon";
};
