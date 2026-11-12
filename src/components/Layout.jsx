import { useState, useEffect } from 'react';
import { NavLink, Link, Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { useContent } from './Content';

const links = [
  ['/work', 'Work'],
  ['/showreel', 'Showreel'],
  ['/about', 'About'],
  ['/contact', 'Contact'],
];

const socialIcons = [
  {
    key: 'instagram',
    label: 'Instagram',
    href: (v) => v,
    external: true,
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
      </svg>
    ),
  },
  {
    key: 'linkedin',
    label: 'LinkedIn',
    href: (v) => v,
    external: true,
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
      </svg>
    ),
  },
  {
    key: 'behance',
    label: 'Behance',
    href: (v) => v,
    external: true,
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
        <path d="M22 7h-7v-2h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14H15.97c.13 3.211 3.483 3.312 4.588 2.029h3.168zm-7.686-4h4.965c-.105-1.547-1.136-2.219-2.477-2.219-1.466 0-2.277.768-2.488 2.219zm-9.574 6.988H0V5.021h6.953c5.476.081 5.58 5.444 2.72 6.906 3.461 1.26 3.577 8.061-3.207 8.061zM3 11h3.584c2.508 0 2.906-3-.312-3H3v3zm3.391 3H3v3.016h3.341c3.055 0 2.868-3.016.05-3.016z" />
      </svg>
    ),
  },
  {
    key: 'youtube',
    label: 'YouTube',
    href: (v) => v,
    external: true,
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    key: 'email',
    label: 'Email',
    href: (v) => (v.startsWith('mailto:') ? v : `mailto:${v}`),
    external: false,
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5">
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
  },
  {
    key: 'whatsapp',
    label: 'WhatsApp',
    href: (v) => (/^https?:\/\//i.test(v) ? v : `https://wa.me/${v.replace(/\D/g, '')}`),
    external: true,
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
        <path d="M12.031 2c-5.516 0-9.969 4.453-9.969 9.969 0 1.766.469 3.484 1.344 5l-1.406 5.156 5.281-1.375c1.469.797 3.109 1.219 4.75 1.219 5.516 0 9.969-4.453 9.969-9.969S17.547 2 12.031 2zm5.813 14.125c-.25.703-1.438 1.344-2 1.422-.516.078-1.172.109-1.891-.125-.438-.141-1-.328-1.719-.641-3.016-1.297-4.984-4.344-5.141-4.547-.141-.203-1.219-1.625-1.219-3.094s.766-2.188 1.047-2.484c.281-.297.609-.375.813-.375h.578c.188 0 .438-.078.688.516.25.609.859 2.094.938 2.25.078.156.125.344.016.547-.094.203-.156.328-.297.5-.156.172-.313.391-.453.516-.156.156-.313.328-.141.641.172.313.781 1.281 1.672 2.078 1.156 1.031 2.125 1.344 2.438 1.5.313.156.484.125.672-.078.188-.203.781-.906.984-1.219.203-.313.406-.266.688-.156.281.109 1.781.844 2.094 1 .313.156.516.234.594.359.078.125.078.734-.172 1.438z" />
      </svg>
    ),
  },
];

export default function Layout() {
  const { site } = useContent();
  const [open, setOpen] = useState(false);
  const [sc, setSc] = useState(false);
  const loc = useLocation();

  useEffect(() => {
    const f = () => setSc(scrollY > 20);
    f();
    addEventListener('scroll', f, { passive: true });
    return () => removeEventListener('scroll', f);
  }, []);

  useEffect(() => {
    setOpen(false);
    scrollTo(0, 0);
  }, [loc.pathname]);

  const cls = ({ isActive }) =>
    `text-sm font-medium ${isActive ? 'text-accent' : 'hover:text-accent'}`;

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition ${sc || open ? 'bg-white/90 backdrop-blur border-b border-line' : ''
          }`}
      >
        <nav aria-label="Main" className="wrap h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 font-black tracking-tight text-lg">
            <img src="/ve_logo.png" alt="SARANSH.VE Logo" className="size-8 object-contain rounded" />
            <span>SARANSH<span className="text-accent">.VE</span></span>
          </Link>
          <div className="hidden md:flex gap-8">
            {links.map(([to, l]) => (
              <NavLink key={to} to={to} className={cls}>
                {l}
              </NavLink>
            ))}
          </div>
          <button
            className="md:hidden"
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </nav>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden bg-white border-b border-line"
            >
              <div className="wrap py-6 flex flex-col gap-5 text-2xl font-bold">
                {links.map(([to, l]) => (
                  <NavLink
                    key={to}
                    to={to}
                    className={({ isActive }) => (isActive ? 'text-accent' : '')}
                  >
                    {l}
                  </NavLink>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
      <motion.main
        key={loc.pathname}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="pt-16 min-h-[80vh]"
      >
        <Outlet />
      </motion.main>
      <footer className="border-t border-line mt-32 py-16">
        <div className="wrap grid gap-10 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2.5">
              <img src="/ve_logo.png" alt="SARANSH.VE Logo" className="size-8 object-contain rounded" />
              <p className="font-black text-2xl">SARANSH<span className="text-accent">.VE</span></p>
            </div>
            <p className="text-mute mt-2">I Make Ideas Move.</p>
          </div>
          <div className="flex flex-col gap-2 text-sm">
            {links.map(([to, l]) => (
              <Link key={to} to={to}>
                {l}
              </Link>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-4 self-start">
            {socialIcons.map(({ key, label, href, external, svg }) => {
              const val = site[key]?.trim();
              if (!val) return null;
              return (
                <a
                  key={key}
                  href={href(val)}
                  aria-label={label}
                  title={label}
                  {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="text-ink hover:opacity-65 transition p-1.5 rounded-lg"
                >
                  {svg}
                </a>
              );
            })}
          </div>
        </div>
        <p className="wrap mt-10 text-xs text-mute">
          © 2024 SARANSH.VE. All rights reserved.
        </p>
      </footer>
    </>
  );
}
