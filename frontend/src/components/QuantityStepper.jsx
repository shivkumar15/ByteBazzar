import { MinusIcon, PlusIcon } from "./Icons";

export default function QuantityStepper({ value, onChange, max }) {
  const atMax = typeof max === "number" && value >= max;
  return (
    <div className="inline-flex items-center rounded-full border border-line bg-white">
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        aria-label={value === 1 ? "Remove item" : "Decrease quantity"}
        className="grid h-9 w-9 cursor-pointer place-items-center rounded-full hover:bg-mist"
      >
        <MinusIcon width={16} height={16} />
      </button>
      <span className="w-8 text-center text-sm font-semibold" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        disabled={atMax}
        aria-label="Increase quantity"
        className="grid h-9 w-9 cursor-pointer place-items-center rounded-full hover:bg-mist disabled:cursor-not-allowed disabled:opacity-40"
      >
        <PlusIcon width={16} height={16} />
      </button>
    </div>
  );
}
