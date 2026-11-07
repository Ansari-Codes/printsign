from PIL import Image

im = Image.open(r'C:\Users\Paradise Computers\.gemini\antigravity\brain\427ef294-7b43-49cf-b6fa-17e2d0e4b50b\printsign_dash_loaded.png')

# Sidebar is x from 60 to 200.
# Scan y from 650 to 800
for y in range(680, 780, 5):
    dark = [x for x in range(80, 160) if im.getpixel((x, y))[0] < 80]
    if dark:
        print(f"y={y}: count={len(dark)}")
