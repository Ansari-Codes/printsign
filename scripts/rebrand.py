import os
import re

files_to_check = []
for root, dirs, files in os.walk('.'):
    if any(p in root for p in ['node_modules', '.git', 'dist', '.system_generated', 'brain']):
        continue
    for f in files:
        if f.endswith(('.vue', '.ts', '.js', '.html', '.json', '.xml', '.txt', '.md')):
            files_to_check.append(os.path.join(root, f))

print(f"Total files scanned: {len(files_to_check)}")

updated = []
for path in files_to_check:
    try:
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception:
        continue

    orig = content
    # Replacements
    content = content.replace("Privacy PDF Editor", "PrintSign PDF Editor")
    content = content.replace("Privacy PDF", "PrintSign")
    content = content.replace("privacypdf.app", "printsign.org")
    content = content.replace("support@privacypdf.app", "support@printsign.org")
    content = content.replace("contact@privacypdf.app", "contact@printsign.org")
    content = content.replace("privacy@privacypdf.app", "privacy@printsign.org")
    content = content.replace("legal@privacypdf.app", "legal@printsign.org")

    if content != orig:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        updated.append(path)

print(f"Updated {len(updated)} files:")
for u in updated:
    print(f" - {u}")
