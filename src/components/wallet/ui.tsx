"use client";
import type { ButtonHTMLAttributes, ComponentType, CSSProperties, HTMLAttributes, ReactNode } from "react";
import { AlertTriangle, Info, ShieldAlert, ShieldCheck } from "lucide-react";
import { Odometer } from "./Odometer";
import { vt } from "@/lib/vt";

/** Short tick on supporting devices. Silently does nothing elsewhere. */
export function haptic(ms = 8) {
  try {
    navigator.vibrate?.(ms);
  } catch {
    // Not available here.
  }
}

/** Inline style that sets how far a .pressable shrinks when held. */
export const press = (scale: number) => ({ "--press": scale }) as CSSProperties;

export const Spinner = ({ size = 18, className = "" }: { size?: number; className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden
    className={`keep-motion animate-spin-fast ${className}`}
  >
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" strokeOpacity="0.22" />
    <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "ink";
type ButtonSize = "lg" | "md" | "sm";

const BUTTON_VARIANT: Record<ButtonVariant, string> = {
  // Mint fill, dark text: the one thing to do on a screen.
  primary: "bg-accent text-accent-ink",
  secondary: "bg-raised text-ink",
  ghost: "text-accent-soft",
  danger: "bg-down text-white",
  ink: "bg-ink text-canvas",
};

const BUTTON_SIZE: Record<ButtonSize, string> = {
  lg: "h-14 w-full rounded-full px-6 text-[16px]",
  md: "h-12 rounded-full px-5 text-[15px]",
  sm: "h-10 rounded-full px-4 text-[14px]",
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: ReactNode;
};

export const Button = ({
  variant = "primary",
  size = "lg",
  loading = false,
  icon,
  children,
  className = "",
  disabled,
  onPointerDown,
  type = "button",
  ...rest
}: ButtonProps) => (
  <button
    type={type}
    disabled={disabled || loading}
    aria-busy={loading || undefined}
    onPointerDown={(e) => {
      if (variant === "primary" || variant === "danger") haptic();
      onPointerDown?.(e);
    }}
    style={press(0.97)}
    className={`pressable inline-flex shrink-0 items-center justify-center gap-2.5 font-bold tracking-[-0.005em] ${
      variant === "primary" || variant === "danger" ? "disabled:bg-raised disabled:text-faint" : "disabled:opacity-35"
    } ${BUTTON_VARIANT[variant]} ${BUTTON_SIZE[size]} ${className}`}
    {...rest}
  >
    {loading ? <Spinner /> : icon}
    {children}
  </button>
);

/** Round 48px icon control on a raised disc. `label` is required: there is
 *  no visible text. `plain` drops the disc for controls inside a field. */
export const IconButton = ({
  label,
  children,
  className = "",
  plain = false,
  type = "button",
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { label: string; plain?: boolean }) => (
  <button
    type={type}
    aria-label={label}
    style={press(0.96)}
    className={`pressable grid size-12 shrink-0 place-items-center rounded-full text-ink disabled:opacity-40 ${
      plain ? "active:bg-raised" : "bg-raised"
    } ${className}`}
    {...rest}
  >
    {children}
  </button>
);

export const Card = ({ children, className = "", ...rest }: HTMLAttributes<HTMLDivElement>) => (
  <div className={`rounded-[26px] bg-surface ${className}`} {...rest}>
    {children}
  </div>
);

/** A group of rows on one surface, split by inset hairlines. */
export const CardList = ({ children, className = "", ...rest }: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={`overflow-hidden rounded-[26px] bg-surface [&>*+*]:shadow-[inset_0_1px_0_rgb(var(--line)/0.55)] ${className}`}
    {...rest}
  >
    {children}
  </div>
);

/** A group heading: the wide face, quiet, in sentence case. */
export const SectionTitle = ({
  children,
  action,
  className = "",
}: {
  children: ReactNode;
  action?: ReactNode;
  className?: string;
}) => (
  <div className={`flex min-h-10 items-center justify-between gap-3 ${className}`}>
    <h2 className="display text-[15px] font-semibold text-mute">{children}</h2>
    {action}
  </div>
);

/** A titled group: the heading sits 8px over what it names. Pages stack
 *  sections 24px apart (`gap-6`), so no heading needs its own margin. */
export const Section = ({
  title,
  action,
  children,
  className = "",
}: {
  title: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) => (
  <section className={`flex flex-col gap-2 ${className}`}>
    <SectionTitle action={action}>{title}</SectionTitle>
    {children}
  </section>
);

/** Small text button beside a section title. */
export const TextAction = ({ children, onClick }: { children: ReactNode; onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    style={press(0.96)}
    className="pressable -mr-2 h-10 rounded-full px-3 text-[14px] font-bold text-accent-soft active:bg-raised"
  >
    {children}
  </button>
);

type Tone = "info" | "warn" | "danger" | "success";

const TONE: Record<Tone, { dot: string; text: string; icon: typeof Info }> = {
  info: { dot: "bg-sky/15 text-sky", text: "text-ink", icon: Info },
  warn: { dot: "bg-warn/15 text-warn", text: "text-warn", icon: AlertTriangle },
  danger: { dot: "bg-down/15 text-down", text: "text-down", icon: ShieldAlert },
  success: { dot: "bg-up/15 text-up", text: "text-up", icon: ShieldCheck },
};

export const Callout = ({
  tone = "info",
  title,
  children,
  className = "",
  role,
}: {
  tone?: Tone;
  title?: string;
  children?: ReactNode;
  className?: string;
  role?: "alert" | "status" | "note";
}) => {
  const t = TONE[tone];
  const Icon = t.icon;
  // Plain information is a quiet note; only warnings get a box.
  if (tone === "info")
    return (
      <aside role={role} className={`flex gap-2.5 px-1 ${className}`}>
        <Icon size={16} className="mt-0.5 shrink-0 text-mute" aria-hidden />
        <p className="min-w-0 flex-1 text-[13px] leading-[1.55] text-mute">
          {title && <span className="font-bold text-ink">{title}. </span>}
          {children}
        </p>
      </aside>
    );
  return (
    <aside role={role} className={`flex gap-3.5 rounded-[22px] bg-surface p-4 ${className}`}>
      <span className={`grid size-9 shrink-0 place-items-center rounded-full ${t.dot}`} aria-hidden>
        <Icon size={18} />
      </span>
      <div className="min-w-0 flex-1 pt-1">
        {title && <p className={`text-[15px] font-bold leading-tight ${t.text}`}>{title}</p>}
        {children && <p className={`text-[13px] leading-[1.55] text-mute ${title ? "mt-1" : ""}`}>{children}</p>}
      </div>
    </aside>
  );
};

const HERO_TONE = {
  accent: "bg-accent text-accent-ink",
  warn: "bg-warn/15 text-warn",
  danger: "bg-down/15 text-down",
  success: "bg-up/15 text-up",
  quiet: "bg-raised text-ink",
} as const;

/** Icon disc, title and subtitle at the top of a flow. Left-aligned by
 *  default; `center` for result screens. */
export const Hero = ({
  icon,
  title,
  subtitle,
  tone = "quiet",
  center = false,
  className = "",
}: {
  icon?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  tone?: keyof typeof HERO_TONE;
  center?: boolean;
  className?: string;
}) => (
  <div className={`flex flex-col ${center ? "items-center text-center" : "items-start"} ${className}`}>
    {icon && (
      <div className={`animate-pop grid size-[68px] place-items-center rounded-full ${HERO_TONE[tone]}`} aria-hidden>
        {icon}
      </div>
    )}
    <h2 className={`display text-balance text-[27px] font-bold leading-[1.08] text-ink ${icon ? "mt-6" : ""}`}>{title}</h2>
    {subtitle && (
      <p className={`mt-2.5 text-pretty text-[15px] leading-[1.55] text-mute ${center ? "max-w-[320px]" : "max-w-[360px]"}`}>
        {subtitle}
      </p>
    )}
  </div>
);

/** Short rules or facts, each beside its icon on a round disc. */
export const IconList = ({
  items,
  label,
}: {
  items: { icon: ComponentType<{ size?: number }>; title: string; detail: ReactNode }[];
  label?: string;
}) => (
  <ul className="flex flex-col gap-5" aria-label={label}>
    {items.map((item) => (
      <li key={item.title} className="flex items-center gap-4">
        <span className="grid size-12 shrink-0 place-items-center rounded-full bg-surface text-ink ring-1 ring-line" aria-hidden>
          <item.icon size={20} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[16px] font-extrabold text-ink">{item.title}</span>
          <span className="mt-0.5 block text-[14px] leading-[1.5] text-mute">{item.detail}</span>
        </span>
      </li>
    ))}
  </ul>
);

/** Label on the left, value on the right. */
export const KeyValue = ({
  label,
  children,
  strong = false,
  stacked = false,
}: {
  label: ReactNode;
  children: ReactNode;
  strong?: boolean;
  /** Value on its own line: for addresses and hashes that need full width. */
  stacked?: boolean;
}) =>
  stacked ? (
    <div className="px-5 py-4">
      <p className="text-[13px] font-semibold text-mute">{label}</p>
      <p className="selectable mt-1.5 break-all font-mono text-[13px] leading-[1.55] text-ink">{children}</p>
    </div>
  ) : (
    <div className="flex items-start justify-between gap-4 px-5 py-4">
      <span className="shrink-0 text-[14px] text-mute">{label}</span>
      <span
        className={`tabular min-w-0 text-right text-[14px] [overflow-wrap:anywhere] ${
          strong ? "font-extrabold text-ink" : "font-semibold text-ink"
        }`}
      >
        {children}
      </span>
    </div>
  );

/** Filter pill. Selected is the ink fill: "this is where you are". */
export const Chip = ({
  selected,
  children,
  className = "",
  type = "button",
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { selected?: boolean }) => (
  <button
    type={type}
    aria-pressed={selected}
    style={press(0.96)}
    className={`pressable inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full px-4 text-[14px] font-bold ${
      selected ? "bg-ink text-canvas" : "bg-raised text-mute"
    } ${className}`}
    {...rest}
  >
    {children}
  </button>
);

/** A horizontal, edge-to-edge row of chips that scrolls on its own. */
export const ChipRail = ({ children, className = "", ...rest }: HTMLAttributes<HTMLDivElement>) => (
  <div role="group" className={`-mx-5 flex gap-2 overflow-x-auto px-5 [touch-action:pan-x_pan-y] ${className}`} {...rest}>
    {children}
  </div>
);

export const EmptyState = ({
  icon,
  title,
  children,
  action,
  className = "",
}: {
  icon?: ReactNode;
  title: string;
  children?: ReactNode;
  action?: ReactNode;
  className?: string;
}) => (
  <div className={`flex flex-col items-center px-6 py-10 text-center ${className}`}>
    {icon && (
      <div className="mb-4 grid size-14 place-items-center rounded-full bg-surface text-mute" aria-hidden>
        {icon}
      </div>
    )}
    <p className="display text-[16px] font-semibold text-ink">{title}</p>
    {children && <p className="mt-1.5 max-w-[280px] text-pretty text-[14px] leading-[1.5] text-mute">{children}</p>}
    {action && <div className="mt-5">{action}</div>}
  </div>
);

/** Labelled input. The label sits above the box; put an
 *  <input className="field-input"> inside. */
export const Field = ({
  label,
  hint,
  error,
  trailing,
  children,
  className = "",
}: {
  label: string;
  hint?: ReactNode;
  error?: ReactNode;
  trailing?: ReactNode;
  children: ReactNode;
  className?: string;
}) => (
  <div className={className}>
    <label className="block">
      <span className="mb-2 block px-1 text-[13px] font-bold text-mute">{label}</span>
      <span
        className={`flex min-h-14 items-center gap-2 rounded-[22px] bg-surface py-2 pl-4 pr-2 ring-1 transition-shadow duration-200 focus-within:ring-2 ${
          error ? "ring-down focus-within:ring-down" : "ring-line/80 focus-within:ring-accent"
        }`}
      >
        <span className="min-w-0 flex-1">{children}</span>
        {trailing}
      </span>
    </label>
    {error ? (
      <p role="alert" className="animate-rise mt-2 px-1 text-[13px] font-semibold text-down">
        {error}
      </p>
    ) : hint ? (
      <p className="mt-2 px-1 text-[13px] text-mute">{hint}</p>
    ) : null}
  </div>
);

/** Animated result mark for status screens. */
export const StatusMark = ({ status }: { status: "success" | "failure" | "pending" }) => (
  <div key={status} className="relative grid size-[132px] place-items-center" aria-hidden>
    {status === "pending" ? (
      <>
        {/* A turning arc in the logo gradient. */}
        <span
          className="keep-motion animate-spin-fast absolute inset-0 rounded-full [animation-duration:1.1s]"
          style={{
            background: "conic-gradient(from 0deg, transparent 0deg, #1359a8 120deg, #128aa3 220deg, #1bec8a 330deg, transparent 360deg)",
            WebkitMask: "radial-gradient(farthest-side, transparent calc(100% - 6px), #000 calc(100% - 5px))",
            mask: "radial-gradient(farthest-side, transparent calc(100% - 6px), #000 calc(100% - 5px))",
          }}
        />
        <span className="grid size-[96px] place-items-center rounded-full bg-raised text-warn">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
            <path d="M12 7v5l3 2" />
          </svg>
        </span>
      </>
    ) : (
      <>
        {/* Six sparks thrown out on success. */}
        {status === "success" &&
          [0, 60, 120, 180, 240, 300].map((deg) => (
            <span key={deg} className="absolute left-1/2 top-1/2 size-0" style={{ transform: `rotate(${deg}deg)` }}>
              <span className="animate-burst absolute -left-1 -top-1 block size-2 rounded-full bg-accent" />
            </span>
          ))}
        <span
          className={`animate-pop relative grid size-[104px] place-items-center rounded-full ${
            status === "success" ? "bg-accent text-accent-ink" : "bg-down text-white"
          }`}
        >
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
            {status === "success" ? (
              <path pathLength={1} className="animate-draw" d="M5 12.5l4.5 4.5L19 7.5" />
            ) : (
              <>
                <path pathLength={1} className="animate-draw" d="M7 7l10 10" />
                <path pathLength={1} className="animate-draw" d="M17 7L7 17" />
              </>
            )}
          </svg>
        </span>
      </>
    )}
  </div>
);

/** The top of every result page: the mark (or the item itself), a title,
 *  and one line on what happens next. */
export const Outcome = ({
  status,
  title,
  children,
  media,
}: {
  status: "success" | "failure" | "pending";
  title: ReactNode;
  children?: ReactNode;
  /** Shown instead of the plain mark, e.g. the NFT that was sent. */
  media?: ReactNode;
}) => (
  <section className="flex flex-col items-center pt-6 text-center" aria-live="polite">
    {media ?? <StatusMark status={status} />}
    <h2 key={status} className="display animate-rise mt-7 text-balance text-[28px] font-bold leading-[1.1] text-ink">
      {title}
    </h2>
    {children && (
      <p className="animate-rise mt-2.5 max-w-[320px] text-balance text-[15px] leading-[1.55] text-mute [animation-delay:60ms]">
        {children}
      </p>
    )}
  </section>
);

export const usd = (value: number) =>
  `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

/** A dollar figure with the sign and cents set back, as on a statement:
 *  "$ 12,240.50" where only "12,240" is at full strength. */
export const Money = ({
  value,
  masked = false,
  roll = false,
  className = "",
}: {
  value: number;
  masked?: boolean;
  /** Digits roll into place when the value changes. */
  roll?: boolean;
  className?: string;
}) => {
  const [whole, cents] = value
    .toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    .split(".");
  return (
    <span className={`display tabular inline-flex items-baseline whitespace-nowrap font-bold ${className}`}>
      <span className="mr-[0.18em] text-[0.62em] text-faint">$</span>
      {masked ? (
        <span aria-label="Hidden">••••••</span>
      ) : (
        <>
          {roll ? <Odometer text={whole} /> : whole}
          <span className="text-[0.62em] text-faint">.{roll ? <Odometer text={cents} /> : cents}</span>
        </>
      )}
    </span>
  );
};

export const shortAddress = (address: string, head = 6, tail = 4) =>
  address.length > head + tail + 3 ? `${address.slice(0, head)}…${address.slice(-tail)}` : address;

/** Progress through a multi-step flow, drawn as slanted bars: the N's diagonal. */
export const Steps = ({ current, total, label }: { current: number; total: number; label?: string }) => (
  // Named, so the rail holds still while the pages of a flow change around it.
  <div role="img" aria-label={label ?? `Step ${current} of ${total}`} className="flex w-full max-w-[148px] gap-1.5" {...vt("flow-steps")}>
    {Array.from({ length: total }, (_, i) => (
      <span key={i} className="h-1.5 flex-1 -skew-x-[30deg] overflow-hidden rounded-[2px] bg-raised">
        <span
          className={`brand-fill block h-full origin-left transition-transform duration-300 ease-out ${
            i < current ? "scale-x-100" : "scale-x-0"
          }`}
        />
      </span>
    ))}
  </div>
);

/** Small rounded label: a status or a count. */
export const Tag = ({
  children,
  tone = "quiet",
  className = "",
}: {
  children: ReactNode;
  tone?: "quiet" | "accent" | "warn" | "down" | "up";
  className?: string;
}) => {
  const color = {
    quiet: "bg-raised text-mute",
    accent: "bg-accent/15 text-accent-soft",
    warn: "bg-warn/15 text-warn",
    down: "bg-down/15 text-down",
    up: "bg-up/15 text-up",
  }[tone];
  return (
    <span className={`inline-flex h-6 shrink-0 items-center gap-1 rounded-full px-2.5 text-[12px] font-bold ${color} ${className}`}>
      {children}
    </span>
  );
};
