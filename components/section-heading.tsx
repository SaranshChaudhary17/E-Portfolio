import { cn } from "@/lib/utils";

type Props = {
  eyebrow?: string;
  title: string;
  copy?: string;
  align?: "left" | "center";
};

export function SectionHeading({ eyebrow, title, copy, align = "left" }: Props) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center")}>
      {eyebrow ? <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-denim">{eyebrow}</p> : null}
      <h2 className="font-display text-4xl font-black uppercase leading-[0.95] text-pearl md:text-6xl">
        {title.split(" ").slice(0, -1).join(" ")}{" "}
        <span className="orange-text">{title.split(" ").slice(-1)}</span>
      </h2>
      {copy ? <p className="mt-5 text-base leading-7 text-parchment/78 md:text-lg">{copy}</p> : null}
    </div>
  );
}
