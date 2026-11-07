import urllib.request
import json

try:
    resp = urllib.request.urlopen("http://127.0.0.1:9222/json")
    tabs = json.loads(resp.read().decode("utf-8"))
    print(f"Total CDP targets: {len(tabs)}")
    for i, tab in enumerate(tabs):
        print(f"[{i}] {tab.get('type')}: {tab.get('title')} -> {tab.get('url')}")
except Exception as e:
    print("Error connecting to CDP:", e)
