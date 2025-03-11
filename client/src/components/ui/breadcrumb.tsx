import * as React from "react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  separator?: React.ReactNode;
}

interface BreadcrumbItemProps extends React.LiHTMLAttributes<HTMLLIElement> {
  href?: string;
  active?: boolean;
}

function Breadcrumb({ 
  children, 
  separator = <ChevronRight className="h-4 w-4 text-neutral-400" />, 
  className, 
  ...props 
}: BreadcrumbProps) {
  const validChildren = React.Children.toArray(children).filter((child) => 
    React.isValidElement(child)
  );

  const clonedChildren = validChildren.map((child, index) => {
    if (!React.isValidElement(child)) return null;

    return React.cloneElement(child, {
      separator,
      isLast: index === validChildren.length - 1,
    } as any);
  });

  return (
    <nav className={className} aria-label="Breadcrumb" {...props}>
      <ol className="flex items-center space-x-1 md:space-x-3">
        {clonedChildren}
      </ol>
    </nav>
  );
}

const BreadcrumbItem = React.forwardRef<HTMLLIElement, BreadcrumbItemProps & { separator?: React.ReactNode; isLast?: boolean }>(
  ({ className, href, children, active, separator, isLast, ...props }, ref) => {
    return (
      <li ref={ref} className={cn("inline-flex items-center", className)} {...props}>
        {!isLast && (
          <>
            {href ? (
              <Link href={href} className="text-sm text-neutral-500 hover:text-primary-500">
                {children}
              </Link>
            ) : (
              <span className="text-sm text-neutral-500">{children}</span>
            )}
            <span className="mx-1">{separator}</span>
          </>
        )}
        {isLast && (
          <span className="text-sm font-medium text-neutral-700">{children}</span>
        )}
      </li>
    );
  }
);

BreadcrumbItem.displayName = "BreadcrumbItem";

export { Breadcrumb, BreadcrumbItem };
