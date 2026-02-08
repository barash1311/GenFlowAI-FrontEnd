import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
}

function defaultItemsFromPath(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length === 0) return [{ label: 'Home', path: '/' }];
  const items: BreadcrumbItem[] = [{ label: 'Home', path: '/dashboard' }];
  let acc = '';
  for (const seg of segments) {
    acc += `/${seg}`;
    const label = seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, ' ');
    items.push({ label, path: acc });
  }
  return items;
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  const location = useLocation();
  const list = items ?? defaultItemsFromPath(location.pathname);

  return (
    <nav className="flex items-center gap-2 text-sm text-slate-600" aria-label="Breadcrumb">
      {list.map((item, i) => (
        <span key={i} className="flex items-center gap-2">
          {i > 0 && <span className="text-slate-300">/</span>}
          {item.path && i < list.length - 1 ? (
            <Link to={item.path} className="hover:text-emerald-600 transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-slate-800 font-medium">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
