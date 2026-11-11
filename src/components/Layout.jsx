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
          <div className="flex flex-col gap-2 text-sm">
            {site.instagram && <a href={site.instagram}>Instagram</a>}
            {site.linkedin && <a href={site.linkedin}>LinkedIn</a>}
            {site.behance && <a href={site.behance}>Behance</a>}
            {site.email && <a href={`mailto:${site.email}`}>{site.email}</a>}
          </div>
        </div>
        <p className="wrap mt-10 text-xs text-mute">
          © {new Date().getFullYear()} SARANSH.VE. All rights reserved.
        </p>
      </footer>
    </>
  );
}
