import React from "react";
import type { RoastedCoffeeBeanProduct } from "../types";

/**
 * Enzi coffee bag, drawn in CSS from brand assets.
 *
 * Every dimension is expressed in `cqw` (percent of the bag's own width) so the
 * whole thing — label text included — scales cleanly from a small grid tile up
 * to a large hero. The parent only needs to constrain the width.
 */

export type BagPalette = {
  /** Gusset colours, light → dark, painted left to right. */
  gussetFrom: string;
  gussetVia: string;
  gussetTo: string;
  /** Sourcing region printed under "SINGLE ORIGIN". */
  region: string;
  /** Accent colour used for the variety name on the label. */
  accent: string;
};

const CARD = {
  rule: "#E3DCD2",
  origin: "#97877A",
  notes: "#7A5230",
  pillBg: "#E4C6A8",
  pillText: "#A9713F",
};

const titleCase = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const CoffeeBag: React.FC<{
  product: RoastedCoffeeBeanProduct;
  palette: BagPalette;
  className?: string;
}> = ({ product, palette, className = "" }) => {
  const notes = (product.flavorNotes ?? []).map(titleCase).join(", ");

  return (
    <div
      className={`relative select-none ${className}`}
      style={{
        aspectRatio: "900 / 1380",
        containerType: "inline-size",
        // Fixed units: container-query units don't resolve against the element
        // that declares `container-type`, only against an ancestor container.
        filter: "drop-shadow(0 14px 22px rgba(58, 36, 21, 0.20))",
      }}
      role="img"
      aria-label={`${product.name} — ${product.weight} bag of Tanzanian ${product.roastLevel} roast coffee`}
    >
      {/* Heat-sealed top flap */}
      <div
        className="absolute"
        style={{
          left: "22.8%",
          width: "55%",
          top: 0,
          height: "8.7%",
          background: "linear-gradient(180deg, #FBF8F3 0%, #F4EEE5 100%)",
          borderRadius: "1cqw 1cqw 0 0",
          borderBottom: "0.9cqw solid #D8C3A8",
        }}
      />

      {/* Bag body */}
      <div
        className="absolute overflow-hidden"
        style={{
          left: "5.5%",
          width: "89%",
          top: "8%",
          bottom: 0,
          background: "linear-gradient(180deg, #F9F4EC 0%, #F8F3EB 55%, #F0E9DE 100%)",
        }}
      >
        {/* Side-gusset creases */}
        <div
          className="absolute top-0 bottom-0"
          style={{ left: "8.8%", width: 1, background: "rgba(58,36,21,0.07)" }}
        />
        <div
          className="absolute top-0 bottom-0"
          style={{ left: "91.2%", width: 1, background: "rgba(58,36,21,0.07)" }}
        />
      </div>

      {/* Patterned gusset */}
      <div
        className="absolute overflow-hidden"
        style={{
          left: 0,
          right: 0,
          top: "65.2%",
          bottom: 0,
          clipPath:
            "polygon(6.7% 0, 93.3% 0, 100% 12.5%, 100% 100%, 0 100%, 0 12.5%)",
          background: `linear-gradient(105deg, ${palette.gussetFrom} 0%, ${palette.gussetVia} 45%, ${palette.gussetTo} 100%)`,
        }}
      >
        <img
          src="/assets/Hze-logo.png"
          alt=""
          aria-hidden
          className="absolute left-1/2 -translate-x-1/2"
          style={{
            width: "34%",
            top: "43%",
            filter: "brightness(0) invert(1)",
            opacity: 0.95,
          }}
        />
      </div>

      {/* Label card */}
      <div
        className="absolute flex flex-col bg-white"
        style={{
          left: "22.8%",
          width: "54.4%",
          top: "26.1%",
          height: "32.3%",
          borderRadius: "3cqw",
          padding: "4.4cqw 5cqw",
          boxShadow: "0 1.2cqw 2.4cqw rgba(58, 36, 21, 0.10)",
        }}
      >
        {/* Name + origin */}
        <div className="flex items-start justify-between" style={{ gap: "2cqw" }}>
          <span
            className="font-display italic"
            style={{
              fontSize: "7cqw",
              lineHeight: 1,
              fontWeight: 600,
              color: palette.accent,
            }}
          >
            {product.name.toLowerCase()}
          </span>
          <span
            className="font-sans text-right uppercase"
            style={{
              fontSize: "2.6cqw",
              lineHeight: 1.35,
              letterSpacing: "0.06em",
              color: CARD.origin,
            }}
          >
            Single
            <br />
            Origin
            <br />
            {palette.region}
          </span>
        </div>

        <div
          style={{ height: 1, background: CARD.rule, margin: "3.2cqw 0 2.8cqw" }}
        />

        {/* Flavour notes */}
        <p
          className="font-sans"
          style={{ fontSize: "2.7cqw", lineHeight: 1.5, color: CARD.notes }}
        >
          {notes}
        </p>

        {/* Roundel + arabica pill */}
        <div
          className="mt-auto flex items-center"
          style={{ gap: "2.6cqw", paddingTop: "3cqw" }}
        >
          <img
            src="/assets/hze-e-housed.png"
            alt=""
            aria-hidden
            style={{ width: "8.4cqw", height: "8.4cqw", objectFit: "contain" }}
          />
          <span
            className="font-sans inline-flex flex-1 items-center justify-center uppercase"
            style={{
              fontSize: "2.5cqw",
              letterSpacing: "0.04em",
              color: CARD.pillText,
              background: CARD.pillBg,
              borderRadius: "999px",
              padding: "1.7cqw 2cqw",
            }}
          >
            100% Arabica
          </span>
        </div>
      </div>
    </div>
  );
};

export default CoffeeBag;
