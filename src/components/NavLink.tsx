import Link, { LinkProps } from "next/link";
import { useRouter } from "next/router";
import { forwardRef, useMemo } from "react";
import { cn } from "@/lib/utils";

interface NavLinkCompatProps extends Omit<LinkProps, "href"> {
  className?: string;
  activeClassName?: string;
  pendingClassName?: string;
  href: string;
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkCompatProps>(
  ({ href, activeClassName, pendingClassName, className, ...props }, ref) => {
    const router = useRouter();
    const isActive = useMemo(
      () => router.pathname === href,
      [router.pathname, href]
    );

    return (
      <Link
        href={href}
        ref={ref}
        className={cn(className, isActive ? activeClassName : pendingClassName)}
        {...props}
      />
    );
  }
);

NavLink.displayName = "NavLink";

export { NavLink };
