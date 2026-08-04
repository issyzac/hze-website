const phrases = [
  "DEATH TO BASIC COFFEE",
  "KAHAWA KAMA KAWA",
  "KAHAWA NA HARAKATI",
  "A MOVEMENT BUILT THROUGH COFFEE",
];

export default function Marquee() {
  const sequence = [...phrases, ...phrases, ...phrases];
  return (
    <div aria-hidden className="bg-bronze-deep py-4 overflow-hidden select-none">
      <div className="marquee-track flex items-center gap-10 whitespace-nowrap w-max">
        {sequence.map((phrase, i) => (
          <span key={i} className="flex items-center gap-10">
            <span
              className="text-cream-aged text-xl sm:text-2xl tracking-wide"
              style={{ fontFamily: "var(--font-condensed)", fontWeight: 700 }}
            >
              {phrase}
            </span>
            <span className="text-enzi-lb text-lg">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
