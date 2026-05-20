import { Github, Home, Images, Mail, PanelsTopLeft, PlaySquare, UserRound } from "lucide-react";

export const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/projects", label: "Projects", icon: PanelsTopLeft },
  { href: "/github", label: "GitHub", icon: Github },
  { href: "/videos", label: "Videos", icon: PlaySquare },
  { href: "/gallery", label: "Gallery", icon: Images },
  { href: "/profile", label: "Profile", icon: UserRound },
  { href: "/contact", label: "Contact", icon: Mail }
];

export const identity = {
  name: "Saransh Chaudhary",
  roles: ["Creative Developer", "Video Editor", "Cinematic UI Designer", "Motion Graphics Creator"],
  github: "SaranshChaudhary17",
  email: "hello@saransh.dev"
};

export const stats = [
  { value: "15+", label: "Projects" },
  { value: "10K+", label: "Lines of code" },
  { value: "3+", label: "Years experience" },
  { value: "100%", label: "Passion" }
];
