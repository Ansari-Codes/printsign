from PIL import Image

im = Image.open(r'C:\Users\Paradise Computers\.gemini\antigravity\brain\427ef294-7b43-49cf-b6fa-17e2d0e4b50b\screen_now.png')
# Find where the text is by scanning across all x and y
matches = []
for y in range(200, 800, 20):
    for x in range(200, 800, 20):
        r, g, b, *a = im.getpixel((x, y))
        if r < 50 and g < 50 and b < 50:
            matches.append((x, y, (r, g, b)))

print(f"Total dark pixels found: {len(matches)}")
if matches:
    print("First 10 matches:", matches[:10])
