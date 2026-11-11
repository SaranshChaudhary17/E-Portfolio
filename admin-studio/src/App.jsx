import { useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { auth, ADMIN } from './fb';
import Dashboard from './Dashboard';
import Media from './Media';
import Crud, { Single } from './Crud';
import { S } from './schemas';

const nav = [
  ['WORKSPACE', [['Dashboard', Dashboard], ['Projects', S.projects], ['Media Library', Media], ['Categories', S.categories], ['Showreel', S.showreel]]],
  ['CONTENT MANAGEMENT', [['About Me', S.profile], ['Services', S.services], ['Skills & Tools', S.skills], ['Testimonials', S.testimonials], ['Enquiries', S.enquiries]]],
  ['CONFIGURATION', [['Social Links', S.social], ['SEO & Site Settings', S.settings]]]
];

const renderPage = (item) => {
  if (!item) return <p className="text-mute">Select an item from the sidebar.</p>;
  if (typeof item === 'function') {
    const Component = item;
    return <Component />;
  }
  if (item.single) {
    return <Single {...item} />;
  }
  return <Crud {...item} />;
};

export default function App() {
  const [u, setU] = useState(undefined);
  const [page, setPage] = useState('Dashboard');
  const [err, setErr] = useState('');

  useEffect(() => {
    let resolved = false;
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        resolved = true;
        setU(user);
      },
      (error) => {
        console.error('Firebase Auth error:', error);
        resolved = true;
        setErr(error.message);
        setU(null);
      }
    );

    const timer = setTimeout(() => {
      if (!resolved) {
        setU((curr) => (curr === undefined ? null : curr));
      }
    }, 2500);

    return () => {
      unsubscribe();
      clearTimeout(timer);
    };
  }, []);

  const login = async () => {
    setErr('');
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      await signInWithPopup(auth, provider);
    } catch (e) {
      console.error('Login failed:', e);
      setErr(e.message || 'Login failed. Please try again.');
    }
  };

  if (u === undefined) {
    return (
      <div className="h-screen grid place-items-center bg-soft">
        <div className="text-center p-8 bg-white border border-line rounded-2xl shadow-sm">
          <img src="/ve_logo.png" alt="SARANSH.VE Logo" className="size-14 object-contain mx-auto mb-3" />
          <div className="size-6 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <h2 className="font-bold text-lg tracking-tight">SARANSH<span className="text-accent">.VE</span></h2>
          <p className="text-mute text-sm mt-1">Connecting to control center…</p>
        </div>
      </div>
    );
  }

  if (!u) {
    return (
      <div className="h-screen grid place-items-center bg-soft p-4">
        <div className="bg-white border border-line rounded-2xl p-10 w-full max-w-sm text-center shadow-sm">
          <img src="/ve_logo.png" alt="SARANSH.VE Logo" className="size-20 object-contain mx-auto mb-4" />
          <h1 className="font-black text-2xl tracking-tight">SARANSH<span className="text-accent">.VE</span></h1>
          <p className="text-mute text-sm mt-1 font-medium">Creative Control Center</p>
          <button onClick={login} className="btn btn-p w-full mt-8 cursor-pointer flex items-center justify-center gap-2">
            Continue with Google
          </button>
          {err && <p className="text-red-600 text-xs mt-4">{err}</p>}
        </div>
      </div>
    );
  }

  if (u.email !== ADMIN || !u.emailVerified) {
    return (
      <div className="h-screen grid place-items-center bg-soft p-4">
        <div className="bg-white border border-line rounded-2xl p-10 text-center max-w-md shadow-sm">
          <img src="/ve_logo.png" alt="SARANSH-VE Logo" className="size-14 object-contain mx-auto mb-4" />
          <h1 className="font-bold text-xl text-red-600">Access Denied</h1>
          <p className="text-mute mt-2">
            <strong>{u.email}</strong> is not authorized to access SARANSH.VE
          </p>
          <button className="btn mt-6 cursor-pointer" onClick={() => signOut(auth)}>
            Sign out
          </button>
        </div>
      </div>
    );
  }

  const cur = nav.flatMap((g) => g[1]).find((x) => x[0] === page);

  return (
    <div className="h-screen flex">
      <aside className="w-60 border-r border-line bg-soft p-4 overflow-auto shrink-0">
        <div className="flex items-center gap-2.5 mb-6 px-1">
          <img src="/ve_logo.png" alt="SARANSH.VE Logo" className="size-8 object-contain rounded" />
          <span className="font-black text-lg tracking-tight">SARANSH<span className="text-accent">.VE</span></span>
        </div>
        {nav.map(([g, items]) => (
          <div key={g} className="mb-5">
            <p className="text-[10px] tracking-widest text-mute mb-2">{g}</p>
            {items.map(([n]) => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={`block w-full text-left px-3 py-2 rounded-lg text-sm cursor-pointer transition ${page === n ? 'bg-white font-semibold text-accent shadow-sm' : 'hover:bg-white'
                  }`}
              >
                {n}
              </button>
            ))}
          </div>
        ))}
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b border-line flex items-center justify-between px-6 text-sm">
          <span className="font-semibold">{page}</span>
          <span className="text-mute flex items-center gap-3">
            {u.email} · v{window.studio?.version || 'dev'}
            <button className="btn cursor-pointer" onClick={() => signOut(auth)}>
              Sign out
            </button>
          </span>
        </header>
        <main className="flex-1 overflow-auto p-6" key={page}>
          {cur ? renderPage(cur[1]) : <p className="text-mute">Page not found.</p>}
        </main>
      </div>
    </div>
  );
}
