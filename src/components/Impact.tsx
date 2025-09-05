
interface ImpactSectionProps {
  eyebrow?: string;
  heading?: string;
  body?: string;
  imageSrc?: string;
  imageAlt?: string;
}

 
export default function ImpactSection({
  eyebrow = "IMPACT",
  heading = "From our hands to yours, Harakati na Enzi.",
  body =
    "Harakati was founded to create dignified work, especially for young Tanzanians often excluded from meaningful opportunity. Their barista and life-skills training programs have already reshaped dozens of lives, treating work as a redemptive calling.",
  imageSrc = "/assets/images/impact.png",
  imageAlt = "A hand holding an Enzi cup",
}: ImpactSectionProps) {
  return (
    <section id="impact" className="relative">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Left panel */}
        <div className="bg-coffee-brown text-white">
          <div className="max-w-3xl px-6 sm:px-10 lg:px-16 py-14 sm:py-20 lg:py-28">
            <div className="mb-6">
              <span className="text-white/90 text-sm font-['RoobertRegular'] tracking-[0.15em] uppercase">
                {eyebrow}
              </span>
            </div>
            <h2 className="font-['GTAlpinaThin'] leading-tight text-4xl sm:text-5xl lg:text-6xl xl:text-7xl">
              {heading}
            </h2>
            <p className="mt-6 text-base sm:text-lg lg:text-xl leading-7 font-['RoobertRegular'] sm:leading-8 max-w-2xl text-white/95">
              {body}
            </p>
          </div>
        </div>

        {/* Right image */}
        <div className="min-h-[48vh] lg:min-h-[70vh] relative">
          <img
            src={imageSrc}
            alt={imageAlt}
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}
