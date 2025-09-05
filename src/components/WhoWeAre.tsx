
interface WhoWeAreProps {
  eyebrow?: string; 
  heading?: string;  
  body?: string;  
}

 
export default function WhoWeAre({
  eyebrow = "WHO WE ARE",
  heading = "Coffee with Purpose: Join the Movement.",
  body =
    "At Harakati za ENZI, coffee is never just coffee. It’s a shared journey, from farmers in Tanzania to your cup, built on respect and artistry.  We’ve combined the innovative spirit of ENZI and the redemptive heart of Harakati to create a home for Tanzanian specialty coffee lovers.",
}: WhoWeAreProps) {
  return (
    <section id="who-we-are" className="relative py-16 sm:py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 sm:mb-8">
          <span className="text-enzi-db/80 text-sm font-['RoobertRegular'] tracking-[0.15em] uppercase">
            {eyebrow}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          <div className="lg:col-span-5">
            <h2 className="text-coffee-brown font-['GTAlpinaThin'] leading-tight text-4xl sm:text-5xl md:text-6xl">
              {heading}
            </h2>
          </div>

          <div className="lg:col-span-7">
            <p className="text-enzi-db text-lg sm:text-xl leading-8 font-['RoobertRegular'] sm:leading-9 max-w-3xl">
              {body}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
