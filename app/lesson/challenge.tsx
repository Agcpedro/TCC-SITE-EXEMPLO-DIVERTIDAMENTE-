import { cn } from "@/lib/utils";
import { challengeOptions, challenges } from "@/db/schema";

import { Card } from "./card";

type Props = {
  options: typeof challengeOptions.$inferSelect[];
  onSelect: (id: number) => void;
  status: "correct" | "wrong" | "none";
  selectedOption?: number;
  disabled?: boolean;
  optionStatuses?: Record<number, "correct" | "wrong" | "none">;
  type: typeof challenges.$inferSelect["type"];
};

export const Challenge = ({
  options,
  onSelect,
  status,
  selectedOption,
  disabled,
  optionStatuses,
  type,
}: Props) => {
  return (
    <div className={cn(
      "grid gap-2",
      type === "ASSIST" && "grid-cols-1",
      type === "SELECT" && "grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(0,1fr))]"
    )}>
      {options.map((option, i) => {
        const perOptionStatus = optionStatuses && optionStatuses[option.id] ? optionStatuses[option.id] : (selectedOption === option.id ? status : 'none');
        return (
          <Card
            key={option.id}
            id={option.id}
            text={option.text}
            imageSrc={option.imageSrc}
            shortcut={`${i + 1}`}
            selected={selectedOption === option.id}
            onClick={() => onSelect(option.id)}
            status={perOptionStatus}
            audioSrc={option.audioSrc}
            disabled={disabled}
            type={type}
          />
        );
      })}
    </div>
  );
};
