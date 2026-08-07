import { motion, useReducedMotion } from "framer-motion";
import {
  OTHER_SUFFIX,
  REFEREE_PARTS,
  answerStrength,
  type Answers,
  type Field,
} from "../../data/careers";

interface FormFieldProps {
  field: Field;
  answers: Answers;
  error?: string;
  onChange: (id: string, value: Answers[string]) => void;
  index: number;
}

const inputClass =
  "w-full px-4 py-3 bg-white border-2 border-bronze-deep/20 focus:border-enzi-db focus:outline-none font-sans text-ink placeholder:text-ink/35 transition-colors";

const Check = ({ round }: { round?: boolean }) => (
  <span
    className={`shrink-0 h-6 w-6 border-2 border-current flex items-center justify-center ${
      round ? "rounded-full" : ""
    }`}
    aria-hidden
  >
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5">
      <path d="M4 12.5 9.5 18 20 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </span>
);

const Empty = ({ round }: { round?: boolean }) => (
  <span
    className={`shrink-0 h-6 w-6 border-2 border-bronze-deep/30 ${round ? "rounded-full" : ""}`}
    aria-hidden
  />
);

/** Big tappable option row — used for radio, checkbox and yes/no. */
const Option = ({
  label,
  selected,
  onClick,
  round,
  disabled,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  round?: boolean;
  disabled?: boolean;
}) => (
  <motion.button
    type="button"
    role={round ? "radio" : "checkbox"}
    aria-checked={selected}
    disabled={disabled}
    onClick={onClick}
    whileTap={{ scale: 0.985 }}
    className={`w-full flex items-center gap-3 text-left px-4 py-3.5 border-2 font-sans transition-colors min-h-[56px] ${
      selected
        ? "border-hze-teal bg-hze-teal/8 text-hze-teal"
        : disabled
          ? "border-bronze-deep/10 text-ink/30 cursor-not-allowed"
          : "border-bronze-deep/20 text-ink hover:border-enzi-db hover:bg-enzi-db/5"
    }`}
  >
    {selected ? <Check round={round} /> : <Empty round={round} />}
    <span className="leading-snug">{label}</span>
  </motion.button>
);

const StrengthMeter = ({ text, target }: { text: string; target: number }) => {
  const { words, ratio, label } = answerStrength(text, target);
  if (!words) return null;
  return (
    <div className="mt-2 flex items-center gap-3">
      <div className="h-1.5 w-24 bg-bronze-deep/15 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${ratio >= 0.6 ? "bg-hze-teal" : "bg-enzi-db"}`}
          initial={false}
          animate={{ width: `${Math.max(8, ratio * 100)}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
      <span className={`font-sans text-xs ${ratio >= 0.6 ? "text-hze-teal" : "text-ink/50"}`}>{label}</span>
    </div>
  );
};

export default function FormField({ field, answers, error, onChange, index }: FormFieldProps) {
  const reduceMotion = useReducedMotion();
  const value = answers[field.id];
  const otherId = field.id + OTHER_SUFFIX;
  const otherValue = (answers[otherId] as string) || "";
  const describedBy = error ? `${field.id}-error` : field.helper ? `${field.id}-helper` : undefined;

  const toggleInList = (option: string) => {
    const list = Array.isArray(value) ? [...(value as string[])] : [];
    const at = list.indexOf(option);
    if (at >= 0) list.splice(at, 1);
    else {
      if (field.maxSelect && list.length >= field.maxSelect) return;
      list.push(option);
    }
    onChange(field.id, list);
  };

  const selectedList = Array.isArray(value) ? (value as string[]) : [];
  const options = field.options ?? [];
  const withOther = field.allowOther ? [...options, "Other"] : options;
  const atLimit = !!field.maxSelect && selectedList.length >= field.maxSelect;

  const renderControl = () => {
    switch (field.type) {
      case "short":
      case "email":
      case "tel":
      case "date":
        return (
          <input
            id={field.id}
            type={field.type === "short" ? "text" : field.type}
            inputMode={field.type === "tel" ? "tel" : undefined}
            autoComplete={
              field.type === "email" ? "email" : field.type === "tel" ? "tel" : undefined
            }
            value={(value as string) || ""}
            placeholder={field.placeholder}
            aria-invalid={!!error}
            aria-describedby={describedBy}
            onChange={(e) => onChange(field.id, e.target.value)}
            className={inputClass}
          />
        );

      case "paragraph":
        return (
          <>
            <textarea
              id={field.id}
              rows={4}
              value={(value as string) || ""}
              placeholder={field.placeholder || "Kwa maneno yako mwenyewe…"}
              aria-invalid={!!error}
              aria-describedby={describedBy}
              onChange={(e) => onChange(field.id, e.target.value)}
              className={`${inputClass} resize-y leading-relaxed`}
            />
            <StrengthMeter text={(value as string) || ""} target={field.strongWords || 40} />
          </>
        );

      case "yesno":
        return (
          <div role="radiogroup" aria-label={field.label} className="grid grid-cols-2 gap-3">
            {["Yes", "No"].map((option) => (
              <Option
                key={option}
                round
                label={option}
                selected={value === option}
                onClick={() => onChange(field.id, option)}
              />
            ))}
          </div>
        );

      case "radio":
        return (
          <div role="radiogroup" aria-label={field.label} className="space-y-2.5">
            {withOther.map((option) => (
              <Option
                key={option}
                round
                label={option}
                selected={value === option}
                onClick={() => onChange(field.id, option)}
              />
            ))}
            {field.allowOther && value === "Other" && (
              <input
                type="text"
                value={otherValue}
                placeholder="Tell us which one"
                aria-label={`${field.label} — other`}
                onChange={(e) => onChange(otherId, e.target.value)}
                className={inputClass}
              />
            )}
          </div>
        );

      case "checkbox":
        return (
          <div className="space-y-2.5">
            {field.maxSelect && (
              <p className="font-sans text-xs text-ink/50">
                {selectedList.length}/{field.maxSelect} chosen
              </p>
            )}
            {withOther.map((option) => {
              const selected = selectedList.includes(option);
              return (
                <Option
                  key={option}
                  label={option}
                  selected={selected}
                  disabled={!selected && atLimit}
                  onClick={() => toggleInList(option)}
                />
              );
            })}
            {field.allowOther && selectedList.includes("Other") && (
              <input
                type="text"
                value={otherValue}
                placeholder="Which language?"
                aria-label={`${field.label} — other`}
                onChange={(e) => onChange(otherId, e.target.value)}
                className={inputClass}
              />
            )}
            {field.requireAll && field.options && (
              <button
                type="button"
                onClick={() =>
                  onChange(
                    field.id,
                    selectedList.length === field.options!.length ? [] : [...field.options!],
                  )
                }
                className="font-sans text-sm text-enzi-db underline underline-offset-4 hover:text-bronze-deep pt-1"
              >
                {selectedList.length === field.options.length
                  ? "Clear all"
                  : "Niko tayari kwa yote — I'm willing to do all of these"}
              </button>
            )}
          </div>
        );

      case "consent":
        return (
          <Option
            label={field.label}
            selected={value === "yes"}
            onClick={() => onChange(field.id, value === "yes" ? "" : "yes")}
          />
        );

      case "referee":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {REFEREE_PARTS.map((part) => {
              const parts = (value as Record<string, string>) || {};
              return (
                <label key={part.key} className="block">
                  <span className="block font-sans text-sm text-ink/65 mb-1.5">{part.label}</span>
                  <input
                    type={part.key === "phone" ? "tel" : "text"}
                    value={parts[part.key] || ""}
                    placeholder={part.placeholder}
                    onChange={(e) => onChange(field.id, { ...parts, [part.key]: e.target.value })}
                    className={inputClass}
                  />
                </label>
              );
            })}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={reduceMotion ? undefined : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.05, 0.3) }}
      className={`border-l-4 pl-4 sm:pl-5 py-1 transition-colors ${
        error ? "border-hze-red" : "border-bronze-deep/15"
      }`}
    >
      {field.type !== "consent" && (
        <label
          htmlFor={["short", "email", "tel", "date", "paragraph"].includes(field.type) ? field.id : undefined}
          className="block mb-1"
        >
          <span className="font-sans text-xs tracking-[0.18em] text-enzi-db/80 uppercase">
            {String(field.n).padStart(2, "0")}
          </span>
          <span className="block font-display text-lg sm:text-xl text-coffee-dark leading-snug mt-0.5">
            {field.label}
          </span>
        </label>
      )}

      {field.helper && (
        <p id={`${field.id}-helper`} className="font-sans text-sm text-ink/55 mb-3 leading-relaxed">
          {field.helper}
        </p>
      )}

      <div className={field.helper ? "" : "mt-3"}>{renderControl()}</div>

      {error && (
        <p id={`${field.id}-error`} role="alert" className="mt-2 font-sans text-sm text-hze-red">
          {error}
        </p>
      )}
    </motion.div>
  );
}
