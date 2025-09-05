"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function NavigationLoader() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 500);

    return () => clearTimeout(timeout);
  }, [pathname, mounted]);

  if (!mounted || !loading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-[var(--muted)] border-t-[var(--secondary-foreground)]"></div>
    </div>
  );
}
