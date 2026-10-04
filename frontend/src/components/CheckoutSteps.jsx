import { CheckIcon } from "./Icons";

const steps = ["Cart", "Address", "Review"];

export default function CheckoutSteps({ current }) {
  return (
    <ol className="mb-8 flex flex-wrap items-center gap-3 text-sm font-medium">
      {steps.map((label, i) => {
        const n = i + 1;
        const done = n < current;
        const active = n === current;
        return (
          <li
            key={label}
            className="flex items-center gap-3"
            aria-current={active ? "step" : undefined}
          >
            <span
              className={`grid h-7 w-7 place-items-center rounded-full text-xs font-bold ${
                done
                  ? "bg-ok text-white"
                  : active
                  ? "bg-cobalt text-white"
                  : "border border-line bg-white text-muted"
              }`}
            >
              {done ? <CheckIcon width={14} height={14} strokeWidth={2.6} /> : n}
            </span>
            <span className={active ? "text-ink" : "text-muted"}>{label}</span>
            {n < steps.length && <span className="h-px w-6 bg-line sm:w-10" />}
          </li>
        );
      })}
    </ol>
  );
}
