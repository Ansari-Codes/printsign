with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

ga_tag = """    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-XEW2JC3CM9"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', 'G-XEW2JC3CM9');
    </script>
"""

target = '<meta charset="UTF-8" />'
if 'G-XEW2JC3CM9' not in content:
    content = content.replace(target, target + '\n' + ga_tag, 1)
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(content)
    print("GA4 tag added successfully!")
else:
    print("GA4 tag already present!")
