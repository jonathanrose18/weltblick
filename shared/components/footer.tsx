import Link from "next/link";
import { HomeIcon } from "lucide-react";

import { Dock, DockIcon, DockSeparator } from "@/shared/components/ui/dock";
import { ThemeSwitcher } from "@/shared/components/theme-switcher";

export function Footer() {
  return (
    <Dock>
      <DockIcon>
        <ThemeSwitcher />
      </DockIcon>
      <DockSeparator />
      <DockIcon>
        <Link href="/">
          <HomeIcon />
        </Link>
      </DockIcon>
    </Dock>
  );
}
