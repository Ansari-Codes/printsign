import sys
import os
import json

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.abspath("."))

import article_builder_part1 as p1
import article_builder_part2 as p2
import article_builder_part3 as p3

all_articles = p1.articles + p2.articles + p3.articles

ts_output = """// PrintSign Professional Knowledge Base & Blog Data
// 100% Client-Side In-Browser PDF Engineering & Compliance Articles
// Generated automatically with 1,000+ words per article

export interface BlogFAQ {
  q: string;
  a: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  category: string;
  readTime: string;
  date: string;
  author: string;
  excerpt: string;
  keywords: string[];
  hasComparison: boolean;
  faq: BlogFAQ[];
  content: string;
}

export const blogs: BlogPost[] = """ + json.dumps(all_articles, indent=2, ensure_ascii=False) + """;

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogs.find((b) => b.slug === slug);
}

export function getRelatedPosts(currentSlug: string, count: number = 3): BlogPost[] {
  const current = getBlogPostBySlug(currentSlug);
  if (!current) return blogs.slice(0, count);
  return blogs
    .filter((b) => b.slug !== currentSlug)
    .sort((a) => (a.category === current.category ? -1 : 1))
    .slice(0, count);
}

export const blogCategories = [
  "All",
  "Legal & Compliance",
  "Security & Forensics",
  "Tutorials & How-To",
  "Comparisons & Reviews",
  "Privacy & Architecture"
];
"""

output_path = os.path.abspath("src/data/blogs.ts")
os.makedirs(os.path.dirname(output_path), exist_ok=True)
with open(output_path, "w", encoding="utf-8") as f:
    f.write(ts_output)

print(f"Successfully compiled {len(all_articles)} blog articles into {output_path}!")
