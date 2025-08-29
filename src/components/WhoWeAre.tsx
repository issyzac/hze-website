import React from "react";

interface WhoWeAreProps {
  eyebrow?: string; 
  heading?: string;  
  body?: string;  
}

 
export default function WhoWeAre({
  eyebrow = "WHO WE ARE",
  heading = "From our hands to yours, Harakati na Enzi.",
  body =
    "Harakati was founded to create dignified work, especially for young Tanzanians often excluded from meaningful opportunity. Their barista and life-skills training programs have already reshaped dozens of lives, treating work as a redemptive calling. Enzi elevates everyone in the value chain from the woman farmer in Mbeya to the barista in Dar. We believe a well-poured cup is a form of service, and everyone who touches that process deserves dignity.",
}: WhoWeAreProps) {
  return (
    <section id="about" className="relative py-16 sm:py-20 lg:py-24 bg-white">
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
