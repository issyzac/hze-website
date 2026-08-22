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
  /**
   * Which label the bag wears. `card` is the white Enzi label card the house
   * origins share; `kigoma` is the Mirumbani die-cut sticker — green ground,
   * cream arch, lake kept to a rule along the bottom edge.
   */
  labelStyle?: "card" | "kigoma";
};

/** Mirumbani label colours, as the label concept names them. */
const KIGOMA = {
  ground: "#2E4B34",
  cream: "#F2E8D5",
  olive: "#74804B",
  bark: "#5C3A21",
  cherry: "#B5402F",
  ziwa: "#2E7D6B",
};

const CARD = {
  rule: "#E3DCD2",
  origin: "#97877A",
  notes: "#7A5230",
  pillBg: "#E4C6A8",
  pillText: "#A9713F",
};

const titleCase = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/* ------------------------------------------------------- house label --- */

/** The white Enzi label card worn by Nguvu, Tunu and Amka. */
const LabelCard: React.FC<{
  product: RoastedCoffeeBeanProduct;
  palette: BagPalette;
  notes: string;
}> = ({ product, palette, notes }) => (
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
);

/* ----------------------------------------------------- kigoma label --- */

/** One dotted-rule row of the Mirumbani spec block. */
const SpecRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div
    style={{
      borderBottom: `1px dotted ${KIGOMA.cream}61`,
      paddingBottom: "1.4cqw",
    }}
  >
    <div
      className="font-sans uppercase"
      style={{
        fontSize: "1.35cqw",
        letterSpacing: "0.2em",
        fontWeight: 600,
        color: KIGOMA.cream,
      }}
    >
      {label}
    </div>
    <div
      className="font-sans"
      style={{
        fontSize: "1.75cqw",
        lineHeight: 1.45,
        marginTop: "0.5cqw",
        color: `${KIGOMA.cream}EB`,
      }}
    >
      {value}
    </div>
  </div>
);

/**
 * Mirumbani's die-cut sticker: Kigoma green ground, the Mrumba tree held in a
 * cream arch with the hills drawn behind it, and Lake Tanganyika kept to a
 * single teal rule along the bottom edge — present, but distant.
 */
const KigomaLabel: React.FC<{
  product: RoastedCoffeeBeanProduct;
  notes: string;
}> = ({ product, notes }) => (
  <div
    className="absolute overflow-hidden"
    style={{
      left: "22.8%",
      width: "54.4%",
      top: "26.1%",
      aspectRatio: "1 / 1",
      background: KIGOMA.ground,
      borderRadius: "0.8cqw",
      boxShadow: "0 1.2cqw 2.4cqw rgba(28, 20, 8, 0.28)",
    }}
  >
    {/* Kanga ground, barely there */}
    <div
      className="absolute inset-0 pattern-cream"
      style={{ opacity: 0.06, mixBlendMode: "overlay" }}
      aria-hidden
    />

    {/* Ziwa Tanganyika — the lake, seen from the hills */}
    <div
      className="absolute inset-x-0 bottom-0"
      style={{ height: "1.3cqw", background: KIGOMA.ziwa }}
      aria-hidden
    />

    {/* Double keyline */}
    <div
      className="absolute"
      style={{
        inset: "1.3cqw 1.3cqw 2.4cqw",
        border: `1px solid ${KIGOMA.cream}8C`,
        borderRadius: "0.4cqw",
      }}
      aria-hidden
    />
    <div
      className="absolute"
      style={{
        inset: "1.9cqw 1.9cqw 3cqw",
        border: `1px solid ${KIGOMA.cream}4D`,
        borderRadius: "0.3cqw",
      }}
      aria-hidden
    />

    {/* Content */}
    <div
      className="absolute flex flex-col"
      style={{ inset: "3.1cqw 3.5cqw 4.7cqw" }}
    >
      {/* Name · origin */}
      <div className="flex items-start justify-between" style={{ gap: "1.6cqw" }}>
        <span
          className="font-display"
          style={{
            fontSize: "5.6cqw",
            lineHeight: 0.85,
            fontWeight: 500,
            letterSpacing: "-0.01em",
            color: KIGOMA.cream,
          }}
        >
          {product.name.toLowerCase()}
        </span>
        <div className="flex items-start" style={{ gap: "1.1cqw" }}>
          {/* Ripe cherry — the accent, used once */}
          <span
            className="shrink-0 rounded-full"
            style={{
              width: "2.1cqw",
              height: "2.1cqw",
              background: KIGOMA.cherry,
              marginTop: "0.3cqw",
            }}
            aria-hidden
          />
          <span
            className="font-sans"
            style={{
              fontSize: "1.7cqw",
              lineHeight: 1.4,
              borderLeft: `1px solid ${KIGOMA.cream}73`,
              paddingLeft: "1.2cqw",
              color: KIGOMA.cream,
            }}
          >
            Single
            <br />
            Origin
            <br />
            Kigoma
          </span>
        </div>
      </div>

      {/* Spec block · the arch */}
      <div className="flex min-h-0 flex-1" style={{ gap: "2.6cqw", marginTop: "2cqw" }}>
        <div
          className="flex flex-1 flex-col"
          style={{
            gap: "1.4cqw",
            borderTop: `1px solid ${KIGOMA.cream}73`,
            paddingTop: "1.6cqw",
          }}
        >
          <SpecRow label="Ladha" value={notes} />
          <SpecRow label="Mchakato" value="Washed · African beds" />
          <SpecRow label="Mashamba" value={"Josina & Alaa · 1,200–1,300\u00A0m"} />
        </div>

        {/* Mti wa Mrumba, framed the way a frame holds a memory */}
        <div className="flex flex-col items-center" style={{ width: "21.6cqw" }}>
        {/* Sized off the available height so the arch never crowds the band */}
        <div className="flex min-h-0 w-full flex-1 justify-center">
        <div
          style={{
            height: "100%",
            aspectRatio: "202 / 272",
            boxSizing: "border-box",
            border: `1px solid ${KIGOMA.cream}99`,
            borderRadius: "999px 999px 0.4cqw 0.4cqw",
            padding: "0.7cqw",
          }}
        >
          <div
            className="relative h-full w-full overflow-hidden"
            style={{
              background: KIGOMA.cream,
              borderRadius: "999px 999px 0.3cqw 0.3cqw",
            }}
          >
            {/* Low hills, held at a distance */}
            <svg
              viewBox="0 0 200 120"
              preserveAspectRatio="none"
              className="absolute inset-x-0"
              style={{ bottom: "5%", height: "42%" }}
              aria-hidden
            >
              <path
                d="M0,64 C34,46 66,58 104,44 C138,32 172,42 200,30 L200,120 L0,120 Z"
                fill={KIGOMA.olive}
                opacity="0.22"
              />
              <path
                d="M0,86 C42,68 84,80 126,68 C158,60 182,66 200,58 L200,120 L0,120 Z"
                fill={KIGOMA.olive}
                opacity="0.34"
              />
              <path d="M0,104 L200,104" stroke={KIGOMA.bark} strokeWidth="1" opacity="0.4" />
            </svg>
            <img
              src="/assets/images/mirumbani/mrumba-tree.png"
              alt=""
              aria-hidden
              className="absolute"
              style={{
                left: "4%",
                right: "4%",
                bottom: "3%",
                width: "92%",
                height: "76%",
                objectFit: "contain",
                objectPosition: "bottom",
              }}
            />
          </div>
        </div>
        </div>

          {/* The lament the coffee is named for */}
          <p
            className="font-display text-center italic"
            style={{
              fontSize: "1.45cqw",
              lineHeight: 1.4,
              marginTop: "0.9cqw",
              color: `${KIGOMA.cream}D1`,
            }}
          >
            Ningekuwa kwetu Mirumbani, ningemlilia mama.
          </p>
        </div>
      </div>

      {/* Enzi band */}
      <div
        className="flex items-center"
        style={{
          gap: "1.1cqw",
          borderTop: `1px solid ${KIGOMA.cream}73`,
          marginTop: "1.6cqw",
          paddingTop: "1.3cqw",
        }}
      >
        <img
          src="/assets/hze-e-housed.png"
          alt=""
          aria-hidden
          style={{
            width: "2.8cqw",
            height: "2.8cqw",
            objectFit: "contain",
            filter: "brightness(0) invert(1)",
            opacity: 0.92,
          }}
        />
        <span
          className="font-sans"
          style={{ fontSize: "2cqw", fontWeight: 500, color: KIGOMA.cream }}
        >
          100% Arabica
        </span>
        <span className="flex-1" />
        <span
          className="font-sans uppercase"
          style={{
            fontSize: "1.35cqw",
            letterSpacing: "0.22em",
            color: `${KIGOMA.cream}BF`,
          }}
        >
          {product.weight}
        </span>
      </div>
    </div>
  </div>
);

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

      {palette.labelStyle === "kigoma" ? (
        <KigomaLabel product={product} notes={notes} />
      ) : (
        <LabelCard product={product} palette={palette} notes={notes} />
      )}
    </div>
  );
};

export default CoffeeBag;
