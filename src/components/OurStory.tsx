import { motion, useReducedMotion } from "framer-motion";

const easeSoft = [0.25, 1, 0.5, 1] as const;

interface OurStoryProps {
  imageSrc?: string;
  imageAlt?: string;
  eyebrow?: string;
  heading?: string;
  description?: string | string[];
} 
 
export default function OurStory({
  imageSrc = "/assets/images/community/brew-class-workshop.jpg",
  imageAlt = "A barista trainer guiding a pour-over brewing class at Harakati za Enzi",
  eyebrow = "OUR STORY",
  heading = "Harakati meets ENZI",
  description = [
    "Harakati was born with a mission to do more than roast beans—it exists to dignify labor, empower youth, and create a future where coffee is not just a product, but a pathway to opportunity.",
    "Founded to create dignified work for young Tanzanians often excluded from meaningful opportunities, Harakati meets Enzi to bring this vision to life.",
    "Enzi invites Tanzanians to not only drink their heritage but to feel proud of it, to taste their story in every cup, and to share it with the world."
  ],
}: OurStoryProps) {
  const reduceMotion = useReducedMotion();
  return (
    <section id="our-story" className="relative py-16 sm:py-20 lg:py-24 bg-white overflow-hidden">

      <div className="w-full px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center max-w-screen-2xl mx-auto">
           <motion.div
            className="lg:col-span-7 xl:col-span-6"
            initial={reduceMotion ? undefined : { opacity: 0, x: -32 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9, ease: easeSoft }}
          >
            <div className="overflow-hidden">
              <motion.img
                src={imageSrc}
                alt={imageAlt}
                className="w-full h-full max-h-[560px] object-cover"
                initial={reduceMotion ? undefined : { scale: 1.08 }}
                whileInView={reduceMotion ? undefined : { scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 1.2, ease: easeSoft }}
                onError={(e) => {
                  const t = e.target as HTMLImageElement;
                  if (!t.src.includes("legends-run")) {
                    t.src = "/assets/images/community/legends-run-on-more-than-fuel.jpg";
                  }
                }}
              />
            </div>
          </motion.div>

           <motion.div
            className="lg:col-span-5 xl:col-span-5"
            initial={reduceMotion ? undefined : { opacity: 0, y: 24 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: easeSoft, delay: 0.15 }}
          >
            <div className="mb-4">
              <span className="text-enzi-db/90 text-sm font-['RoobertRegular'] tracking-[0.15em] uppercase">
                {eyebrow}
              </span>
            </div>
            
            {/* Artistic heading with coffee beans */}
            <div className="relative mb-6">
              <div className="flex items-center justify-left gap-3 mb-2"> 
              </div>
              <h2 className="text-coffee-brown font-['GTAlpinaThin'] leading-tight text-4xl sm:text-5xl md:text-6xl text-left">
                {heading}
              </h2>
            </div>

            <div className="space-y-6">
              {(() => {
                const paragraphs = Array.isArray(description) ? description : [description];
                const [first, ...rest] = paragraphs;
                return (
                  <>
                    <p className="text-coffee-dark/75 text-lg font-sans leading-8">
                      {first}
                    </p>
                    {rest.length > 0 && (
                      <details className="group">
                        <summary className="cursor-pointer list-none inline-flex items-center gap-2 font-sans font-medium text-enzi-db hover:text-coffee-bean transition-colors min-h-[44px]">
                          <span className="group-open:hidden">Read our full story</span>
                          <span className="hidden group-open:inline">Show less</span>
                          <span aria-hidden className="transition-transform group-open:rotate-180">↓</span>
                        </summary>
                        <div className="mt-4 space-y-4">
                          {rest.map((paragraph, index) => (
                            <p key={index} className="text-coffee-dark/75 text-lg font-sans leading-8">
                              {paragraph}
                            </p>
                          ))}
                        </div>
                      </details>
                    )}
                  </>
                );
              })()}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
