
interface OurStoryProps {
  imageSrc?: string;
  imageAlt?: string;
  eyebrow?: string;
  heading?: string;
  description?: string | string[];
} 
 
export default function OurStory({
  imageSrc = "/assets/images/our_story_bg.png",
  imageAlt = "Coffee cups and latte art",
  eyebrow = "OUR STORY",
  heading = "Harakati meets ENZI",
  description = [
    "Harakati was born with a mission to do more than roast beans—it exists to dignify labor, empower youth, and create a future where coffee is not just a product, but a pathway to opportunity.",
    "Founded to create dignified work for young Tanzanians often excluded from meaningful opportunities, Harakati meets Enzi to bring this vision to life.",
    "Enzi invites Tanzanians to not only drink their heritage but to feel proud of it, to taste their story in every cup, and to share it with the world."
  ],
}: OurStoryProps) {
  return (
    <section id="our-story" className="relative py-16 sm:py-20 lg:py-24 bg-white overflow-hidden">
      
      <div className="w-full px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center max-w-screen-2xl mx-auto">
           <div className="lg:col-span-7 xl:col-span-6">
            <div className="overflow-hidden shadow-sm border border-coffee-brown/15">
              <img
                src={imageSrc}
                alt={imageAlt}
                className="w-full h-full max-h-[560px] object-cover"
              />
            </div>
          </div>

           <div className="lg:col-span-5 xl:col-span-5">
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

            <div className="space-y-8">
              {description && (
                <div className="space-y-6">
                  {Array.isArray(description) ? (
                    description.map((paragraph, index) => (
                      <div key={index}>
                        <p className="text-enzi-db text-lg sm:text-xl font-['RoobertRegular'] leading-8 sm:leading-9">
                          {paragraph}
                        </p> 
                      </div>
                    ))
                  ) : (
                    <p className="text-enzi-db text-lg sm:text-xl font-['RoobertRegular'] leading-8 sm:leading-9">
                      {description}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
