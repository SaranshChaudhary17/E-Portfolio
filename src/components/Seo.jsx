import { useEffect } from 'react';
import { site } from '../config/site';

export default function Seo({
  title,
  desc = 'Visual storytelling through motion, design and editing.',
  path = '/',
}) {
  useEffect(() => {
    document.title = title
      ? `${title} – SARANSH.VE`
      : 'SARANSH.VE – Video Editor & Motion Graphics Artist';
    const set = (s, a, v) => document.head.querySelector(s)?.setAttribute(a, v);
    set('meta[name=description]', 'content', desc);
    set('meta[property="og:title"]', 'content', document.title);
    set('meta[property="og:description"]', 'content', desc);
    set('meta[property="og:url"]', 'content', site.url + path);
    set('link[rel=canonical]', 'href', site.url + path);
  }, [title, desc, path]);
  return null;
}
