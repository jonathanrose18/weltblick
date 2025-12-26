import { type ReactNode } from "react";

import { Footer } from "@/shared/components/footer";

export function Layout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="flex w-full flex-col">
      <div className="relative mx-auto w-full max-w-screen-sm flex-1 px-4 py-20">
        {children}
        <Footer />
      </div>
    </div>
  );
}
