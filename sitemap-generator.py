#!/usr/bin/env python3
"""
Simple sitemap generator for a static HTML site (GitHub Pages friendly).

Usage:
  python sitemap-generator.py --domain https://meo5ad.com

It will:
  - scan the current repo directory for all .html files
  - treat "index.html" as the directory root ("/slot/" instead of "/slot/index.html")
  - write sitemap.xml in the repo root
"""

import os
import argparse
from datetime import datetime
from urllib.parse import urljoin

EXCLUDE_DIRS = {'.git', '.github', '.vscode', 'node_modules', 'dist', 'build', '__pycache__'}

def collect_html_paths(root='.'):
    paths = []
    for dirpath, dirnames, filenames in os.walk(root):
        # skip excluded dirs
        dirnames[:] = [d for d in dirnames if d not in EXCLUDE_DIRS]
        for f in filenames:
            if not f.lower().endswith('.html'):
                continue
            full = os.path.join(dirpath, f)
            rel = os.path.relpath(full, root)
            # normalize path to URL style
            url_path = '/' + rel.replace(os.sep, '/')
            # treat index.html as directory root
            if url_path.endswith('/index.html'):
                url_path = url_path[:-len('index.html')]
            paths.append(url_path)
    # de-duplicate & sort
    return sorted(set(paths))

def build_sitemap(domain, paths):
    today = datetime.utcnow().strftime('%Y-%m-%d')
    lines = [
        "<?xml version='1.0' encoding='UTF-8'?>",
        "<urlset xmlns='http://www.sitemaps.org/schemas/sitemap/0.9'>"
    ]
    for p in paths:
        loc = urljoin(domain, p.lstrip('/'))
        lines.append("  <url>")
        lines.append(f"    <loc>{loc}</loc>")
        lines.append(f"    <lastmod>{today}</lastmod>")
        # simple priority: homepage highest, others medium
        priority = "1.00" if p == '/' else "0.80"
        lines.append(f"    <priority>{priority}</priority>")
        lines.append("  </url>")
    lines.append("</urlset>")
    return '\n'.join(lines)

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--domain', required=True, help='Site root URL, e.g. https://meo5ad.com')
    args = parser.parse_args()

    domain = args.domain.rstrip('/') + '/'
    paths = collect_html_paths('.')
    xml = build_sitemap(domain, paths)

    out_path = os.path.join('.', 'sitemap.xml')
    with open(out_path, 'w', encoding='utf-8') as f:
        f.write(xml)

    print(f'Generated sitemap.xml with {len(paths)} URLs for domain: {domain}')

if __name__ == '__main__':
    main()
