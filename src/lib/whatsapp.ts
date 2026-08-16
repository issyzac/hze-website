// HZE WhatsApp bot — all interactive features deep-link here.
export const WA_NUMBER = "255743000403";

export const waLink = (text: string) =>
  `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;

export const openWhatsApp = (text: string) => {
  window.open(waLink(text), "_blank", "noopener,noreferrer");
};

/**
 * Share sheet link — no recipient, so WhatsApp asks the sender who to send to.
 * Distinct from `waLink`, which always opens a chat with the HZE bot.
 */
export const waShareLink = (text: string) =>
  `https://wa.me/?text=${encodeURIComponent(text)}`;
