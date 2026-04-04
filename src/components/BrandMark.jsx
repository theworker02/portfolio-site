import { SITE_CONFIG } from '../../config/site.ts';

export default function BrandMark({ className = 'h-10 w-10', alt = `${SITE_CONFIG.username} logo` }) {
  return <img src="/logo.svg" alt={alt} className={className} loading="eager" decoding="async" />;
}
