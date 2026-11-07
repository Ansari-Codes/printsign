import urllib.request

req = urllib.request.Request("http://localhost:9222/json")
try:
    resp = urllib.request.urlopen(req)
    print(resp.read().decode('utf-8'))
except Exception as e:
    print(e)
