import sys
import os
import re

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.abspath("."))

import article_builder_part1 as p1
import article_builder_part2 as p2
import article_builder_part3 as p3

def count_words(text):
    clean = re.sub(r'<[^>]+>', ' ', text)
    tokens = re.findall(r'\b[a-zA-Z0-9_\-\']+\b', clean)
    return len(tokens)

all_articles = p1.articles + p2.articles + p3.articles
print(f"Total articles in Parts 1, 2 & 3: {len(all_articles)}")

all_ok = True
for idx, a in enumerate(all_articles, 1):
    wc = count_words(a["content"])
    status = "OK" if wc >= 1000 else "UNDER 1000 WORDS!"
    if wc < 1000:
        all_ok = False
    print(f"{idx:02d}. [{status}] {a['slug']} -> {wc} words")

print("-" * 50)
if all_ok:
    print(f"SUCCESS: All {len(all_articles)} articles strictly exceed 1,000 words!")
else:
    print("WARNING: Some articles are under 1,000 words.")
