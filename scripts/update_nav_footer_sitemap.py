import os
import re

# 1. Update SiteNavbar.vue
navbar_path = "src/components/website/SiteNavbar.vue"
with open(navbar_path, "r", encoding="utf-8") as f:
    navbar = f.read()

# Add Blog to desktop nav if not already present
if 'to="/blog"' not in navbar:
    desktop_target = """        <router-link
          to="/guides"
          class="px-3 py-1.5 rounded-xl transition text-slate-400 hover:text-white"
          active-class="bg-slate-800 !text-white shadow-xs"
        >
          Knowledge Base
        </router-link>"""
    desktop_replace = """        <router-link
          to="/guides"
          class="px-3 py-1.5 rounded-xl transition text-slate-400 hover:text-white"
          active-class="bg-slate-800 !text-white shadow-xs"
        >
          Knowledge Base
        </router-link>
        <router-link
          to="/blog"
          class="px-3 py-1.5 rounded-xl transition text-slate-400 hover:text-white"
          active-class="bg-slate-800 !text-white shadow-xs"
        >
          Blog
        </router-link>"""

    mobile_target = """      <router-link
        to="/guides"
        @click="isMobileMenuOpen = false"
        class="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition"
      >
        Knowledge Base
      </router-link>"""
    mobile_replace = """      <router-link
        to="/guides"
        @click="isMobileMenuOpen = false"
        class="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition"
      >
        Knowledge Base
      </router-link>
      <router-link
        to="/blog"
        @click="isMobileMenuOpen = false"
        class="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition"
      >
        Blog & Guides
      </router-link>"""

    navbar_crlf = navbar.replace("\r\n", "\n")
    navbar_crlf = navbar_crlf.replace(desktop_target.replace("\r\n", "\n"), desktop_replace.replace("\r\n", "\n"))
    navbar_crlf = navbar_crlf.replace(mobile_target.replace("\r\n", "\n"), mobile_replace.replace("\r\n", "\n"))
    with open(navbar_path, "w", encoding="utf-8") as f:
        f.write(navbar_crlf)
    print("SiteNavbar.vue updated!")
else:
    print("SiteNavbar.vue already has /blog")

# 2. Update SiteFooter.vue
footer_path = "src/components/website/SiteFooter.vue"
with open(footer_path, "r", encoding="utf-8") as f:
    footer = f.read()

if 'to="/blog"' not in footer:
    footer_target = """            <li>
              <router-link to="/guides" class="hover:text-cyan-400 transition">
                Why Black Boxes Fail
              </router-link>
            </li>"""
    footer_replace = """            <li>
              <router-link to="/blog" class="text-cyan-400 font-semibold hover:text-cyan-300 transition">
                All Engineering Blogs (18)
              </router-link>
            </li>
            <li>
              <router-link to="/guides" class="hover:text-cyan-400 transition">
                Why Black Boxes Fail
              </router-link>
            </li>"""
    footer_crlf = footer.replace("\r\n", "\n")
    footer_crlf = footer_crlf.replace(footer_target.replace("\r\n", "\n"), footer_replace.replace("\r\n", "\n"))
    with open(footer_path, "w", encoding="utf-8") as f:
        f.write(footer_crlf)
    print("SiteFooter.vue updated!")
else:
    print("SiteFooter.vue already has /blog")

# 3. Update public/sitemap.xml
sitemap_path = "public/sitemap.xml"
with open(sitemap_path, "r", encoding="utf-8") as f:
    sitemap = f.read()

# Load all blog slugs
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import article_builder_part1 as p1
import article_builder_part2 as p2
import article_builder_part3 as p3

all_slugs = [a["slug"] for a in (p1.articles + p2.articles + p3.articles)]

new_urls = []
# Add /blog
if "<loc>https://printsign.org/blog</loc>" not in sitemap:
    new_urls.append("""  <url>
    <loc>https://printsign.org/blog</loc>
    <lastmod>2026-10-27</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>""")

# Add all 18 articles
for slug in all_slugs:
    url_tag = f"https://printsign.org/blog/{slug}"
    if f"<loc>{url_tag}</loc>" not in sitemap:
        new_urls.append(f"""  <url>
    <loc>{url_tag}</loc>
    <lastmod>2026-10-27</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>""")

if new_urls:
    insert_point = "</urlset>"
    sitemap = sitemap.replace(insert_point, "\n".join(new_urls) + "\n" + insert_point)
    with open(sitemap_path, "w", encoding="utf-8") as f:
        f.write(sitemap)
    print(f"sitemap.xml updated with {len(new_urls)} URLs!")
else:
    print("sitemap.xml is already up to date.")
