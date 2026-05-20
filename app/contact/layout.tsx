import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Saransh Chaudhary: cinematic developer, video editor, and motion designer. Start a collaboration signal."
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
