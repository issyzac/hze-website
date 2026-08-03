// HZE WhatsApp bot — all interactive features deep-link here.
export const WA_NUMBER = "255743000403";

export const waLink = (text: string) =>
  `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;

export const openWhatsApp = (text: string) => {
  window.open(waLink(text), "_blank", "noopener,noreferrer");
};
