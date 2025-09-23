"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";

type Props = {
  label: string;
  iconSrc: string;
  href: string;
  onBeforeNavigate?: (href: string) => boolean | void;
};

export const SidebarItem = ({
  label,
  iconSrc,
  href,
  onBeforeNavigate,
}: Props) => {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Button
      variant={active ? "sidebarOutline"  : "sidebar"}
      className="justify-start h-[52px]"
      asChild
    >
      <a
        href={href}
        onClick={(e) => {
          try {
            if (onBeforeNavigate) {
              const result = onBeforeNavigate(href);
              if (result === false) {
                e.preventDefault();
              }
            }
          } catch (err) {
            // swallow
          }
        }}
      >
        <Image
          src={iconSrc}
          alt={label}
          className="mr-5"
          height={32}
          width={32}
        />
        {label}
      </a>
    </Button>
  );
};
