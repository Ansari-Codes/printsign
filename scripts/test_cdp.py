import urllib.request
import json

for path in ['/json', '/json/list', '/json/version', '/json/protocol']:
    try:
        resp = urllib.request.urlopen(f"http://127.0.0.1:9222{path}")
        print(f"{path} -> {resp.status}")
        data = resp.read().decode('utf-8')
        print(data[:300])
    except Exception as e:
        print(f"{path} -> {e}")
