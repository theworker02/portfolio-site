import { useEffect } from 'react';
import { SITE_CONFIG } from '../../config/site.ts';

function ensureMeta(selector, attribute, value) {
  if (typeof document === 'undefined') {
    return;
  }

  let element = document.head.querySelector(selector);

  if (!element) {
    element = document.createElement('meta');
    const match = selector.match(/\[(name|property)="([^"]+)"\]/);

    if (match) {
      element.setAttribute(match[1], match[2]);
    }

    document.head.appendChild(element);
  }

  element.setAttribute(attribute, value);
}

export function usePageMeta({
  title,
  description,
  image = '/images/portfolio-preview.svg',
  type = 'website',
}) {
  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    const pageTitle = title || `${SITE_CONFIG.username} | Developer Portfolio`;
    const pageDescription =
      description ||
      `${SITE_CONFIG.username} builds polished tools, map-first products, and experimental platforms with live GitHub-backed project showcases.`;
    const pageUrl = typeof window !== 'undefined' ? window.location.href : '';
    const pageImage =
      typeof window !== 'undefined' && image.startsWith('/')
        ? `${window.location.origin}${image}`
        : image;

    document.title = pageTitle;
    ensureMeta('meta[name="description"]', 'content', pageDescription);
    ensureMeta('meta[property="og:title"]', 'content', pageTitle);
    ensureMeta('meta[property="og:description"]', 'content', pageDescription);
    ensureMeta('meta[property="og:type"]', 'content', type);
    ensureMeta('meta[property="og:url"]', 'content', pageUrl);
    ensureMeta('meta[property="og:image"]', 'content', pageImage);
    ensureMeta('meta[name="twitter:card"]', 'content', 'summary_large_image');
    ensureMeta('meta[name="twitter:title"]', 'content', pageTitle);
    ensureMeta('meta[name="twitter:description"]', 'content', pageDescription);
    ensureMeta('meta[name="twitter:image"]', 'content', pageImage);
  }, [description, image, title, type]);
}
