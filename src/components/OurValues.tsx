interface AboutUsProps {
  imageSrc?: string;
  imageAlt?: string;
  eyebrow?: string;
  heading?: string;
  body?: Array<{ title: string; description: string }>;
}

 
export default function AboutUs({
  imageSrc = "/assets/images/about_us.png",
  imageAlt = "Coffee cups and latte art",
  eyebrow = "OUR VALUES",
  heading = "A movement, not just a brand.", 
  body = [
    {
      title: "People over Profit (Utu Kwanza)",
      description: "We exist to create dignified work, especially for those excluded from opportunity. Every decision; sourcing, roasting, customer service, is made with people in mind."
    },
    {
      title: "Movement, Not Just a Brand",
      description: "Excellence is an ethic, not a performance. We see coffee as a community platform, whether at Mbezi, Victoria, or a pop‑up."
    },
    {
      title: "Community Is the Culture (Ujamaa ndio utamaduni)",
      description: "Our cafés are neighbourhood living rooms. We believe a well‑poured cup is an act of care, and conversation around a table can spark change."
    }
  ],
}: AboutUsProps) {
  return (
    <section id="our-values" className="relative py-16 sm:py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <div className="lg:col-span-5">
            <div className="mb-4">
              <span className="text-enzi-db/90 text-sm font-['RoobertRegular'] tracking-[0.15em] uppercase">
                {eyebrow}
              </span>
            </div>
            <h2 className="text-coffee-brown font-['GTAlpinaThin'] leading-tight text-4xl sm:text-5xl md:text-6xl mb-6">
              {heading}
            </h2>
            <p className="text-enzi-db text-lg sm:text-xl font-['RoobertRegular'] leading-8 sm:leading-9 max-w-2xl">
               <div className="space-y-8">
              {body?.map((item, index) => (
                <div key={index} className="space-y-2">
                  <h3 className="text-coffee-brown font-['RoobertMedium'] text-xl sm:text-2xl">
                    {item.title}
                  </h3>
                  <p className="text-enzi-db text-lg sm:text-xl font-['RoobertRegular'] leading-8 sm:leading-9">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
            </p>
          </div>
           <div className="lg:col-span-6">
            <div className="rounded-[36px] overflow-hidden shadow-sm border border-coffee-brown/15">
              <img
                src={imageSrc}
                alt={imageAlt}
                className="w-full h-full max-h-[560px] object-cover"
              />
            </div>
          </div> 
        </div>
      </div>
    </section>
  );
}
