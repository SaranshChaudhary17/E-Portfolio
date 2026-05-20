declare module "next" {
  export type Metadata = Record<string, unknown>;

  export namespace MetadataRoute {
    type Sitemap = Array<{
      url: string;
      lastModified?: string | Date;
      changeFrequency?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
      priority?: number;
    }>;

    type Robots = {
      rules:
        | {
            userAgent?: string | string[];
            allow?: string | string[];
            disallow?: string | string[];
          }
        | Array<{
            userAgent?: string | string[];
            allow?: string | string[];
            disallow?: string | string[];
          }>;
      sitemap?: string | string[];
      host?: string;
    };
  }
}

declare module "next/link" {
  import type { AnchorHTMLAttributes, ReactNode } from "react";

  type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
    prefetch?: boolean;
    replace?: boolean;
    scroll?: boolean;
    children?: ReactNode;
  };

  export default function Link(props: LinkProps): JSX.Element;
}
