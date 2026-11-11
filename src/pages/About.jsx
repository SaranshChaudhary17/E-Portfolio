import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import { useContent } from '../components/Content';

export default function About() {
  const { site, loading } = useContent();

  const firstName = site.name ? site.name.split(' ')[0] : 'Saransh';

  if (loading && !site.intro && !site.philosophy) {
    return (
      <div className="wrap py-16">
        <Seo title="About" path="/about" />
        <div className="h-14 w-80 bg-soft animate-pulse rounded-2xl mb-12" />
        <div className="grid md:grid-cols-2 gap-12">
          <div className="aspect-[4/5] rounded-2xl bg-soft animate-pulse" />
          <div className="space-y-4">
            <div className="h-4 bg-soft animate-pulse rounded w-3/4" />
            <div className="h-4 bg-soft animate-pulse rounded w-full" />
            <div className="h-4 bg-soft animate-pulse rounded w-5/6" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="wrap py-16">
      <Seo title="About" path="/about" />
      <h1 className="display !text-[clamp(2.5rem,8vw,6rem)]">
        Hello, I'm {firstName}.
      </h1>
      {site.title && (
        <p className="text-sm font-semibold tracking-wider text-accent uppercase mt-3">
          {site.title}
        </p>
      )}

      <div className="grid md:grid-cols-2 gap-12 mt-12 items-start">
        <div className="aspect-[4/5] rounded-2xl bg-soft grid place-items-center text-mute text-sm overflow-hidden border border-line shadow-sm">
          {site.profilePhoto ? (
            <img
              src={site.profilePhoto}
              alt={`Portrait of ${site.name || 'Saransh'}`}
              className="size-full object-cover"
            />
          ) : (
            <span className="text-mute text-sm">Portrait placeholder</span>
          )}
        </div>

        <div className="space-y-6 text-mute">
          {site.bio && (
            <p className="text-lg text-ink font-medium leading-relaxed whitespace-pre-line">
              {site.bio}
            </p>
          )}

          {site.intro && (
            <div className="whitespace-pre-line leading-relaxed space-y-4">
              {site.intro}
            </div>
          )}

          {site.philosophy && (
            <div className="pt-4 border-t border-line">
              <p className="text-ink font-bold text-base mb-2">Philosophy.</p>
              <p className="whitespace-pre-line leading-relaxed">{site.philosophy}</p>
            </div>
          )}

          {site.tools && site.tools.length > 0 && (
            <div className="pt-4">
              <p className="text-xs uppercase tracking-wider text-ink font-bold mb-3">Tools & Software</p>
              <ul className="flex flex-wrap gap-2">
                {site.tools.map((t) => (
                  <li
                    key={t}
                    className="px-4 py-2 border border-line rounded-full text-sm text-ink bg-white font-medium shadow-xs"
                  >
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex gap-3 pt-6">
            <Link to="/work" className="btn cursor-pointer">
              Selected Work
            </Link>
            <Link to="/contact" className="btn btn-p cursor-pointer">
              Contact Me
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
