from PIL import Image

im = Image.open(r'C:\Users\Paradise Computers\.gemini\antigravity\brain\427ef294-7b43-49cf-b6fa-17e2d0e4b50b\websites_list_view.png')

# Scan along y = 388 from x = 100 to 1920
matches = []
for x in range(100, 1920, 5):
    r, g, b, *a = im.getpixel((x, 388))
    if not (r > 240 and g > 240 and b > 240):
        matches.append(x)

print(f"Non-white pixels at y=388: {len(matches)} pixels")
if matches:
    print(matches[:30])
