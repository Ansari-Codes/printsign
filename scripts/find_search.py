from PIL import Image

im = Image.open(r'C:\Users\Paradise Computers\.gemini\antigravity\brain\427ef294-7b43-49cf-b6fa-17e2d0e4b50b\websites_list_view.png')

for y in range(370, 415, 5):
    dark = [x for x in range(1000, 1500) if im.getpixel((x, y))[0] < 120]
    if dark:
        print(f"y={y}: min={min(dark)}, max={max(dark)}, count={len(dark)}")
