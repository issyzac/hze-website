import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { openWhatsApp } from "../lib/whatsapp";

const easeSoft = [0.25, 1, 0.5, 1] as const;

export default function ContactUs() {
  const reduceMotion = useReducedMotion();
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Habari HZE! ${message.trim() || "Nataka kuwasiliana nanyi."} — ${name.trim() || "___"}`;
    openWhatsApp(text);
  };

  return (
    <section id="contact" className="py-16 px-4 bg-[#F7F3ED]">
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="text-center mb-10"
          initial={reduceMotion ? undefined : { opacity: 0, y: 20 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: easeSoft }}
        >
          <h2
            className="uppercase text-ink text-5xl sm:text-6xl leading-[0.95] mb-3"
            style={{ fontFamily: "var(--font-condensed)", fontWeight: 700 }}
          >
            Karibu — Visit Us
          </h2>
          <p className="font-display font-light italic text-bronze-deep text-xl">
            HZE Mbezi, Dar es Salaam · Monday – Saturday, 7:30 AM – 10:00 PM
          </p>
        </motion.div>

        <motion.div
          className="max-w-2xl mx-auto"
          initial={reduceMotion ? undefined : { opacity: 0, y: 20 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: easeSoft, delay: 0.15 }}
        >
          <form
            onSubmit={handleSubmit}
            className="bg-white/80 border border-bronze-deep/20 shadow-sm p-6 sm:p-8 space-y-5"
          >
            <div>
              <label htmlFor="contact-name" className="block text-sm font-sans font-medium text-ink mb-2">
                Jina lako — your name
              </label>
              <input
                id="contact-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Andika jina lako"
                className="w-full px-4 py-3 border-2 border-bronze-deep/20 focus:border-enzi-db focus:outline-none font-sans"
              />
            </div>

            <div>
              <label htmlFor="contact-message" className="block text-sm font-sans font-medium text-ink mb-2">
                Ujumbe wako — your message
              </label>
              <textarea
                id="contact-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                placeholder="Kahawa, events, wholesale — chochote!"
                className="w-full px-4 py-3 border-2 border-bronze-deep/20 focus:border-enzi-db focus:outline-none font-sans resize-vertical"
              />
            </div>

            <button
              type="submit"
              className="btn-press w-full inline-flex items-center justify-center gap-2 py-4 px-6 bg-hze-teal text-white font-sans font-medium text-lg rounded-full hover:bg-[#236458] transition-colors min-h-[56px]"
            >
              Endelea kwa WhatsApp <span aria-hidden>→</span>
            </button>

            <p className="text-center font-sans text-sm text-ink/50">
              Inafungua WhatsApp na ujumbe wako tayari umeandikwa.
            </p>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
