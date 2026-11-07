from PIL import Image

im = Image.open(r'C:\Users\Paradise Computers\.gemini\antigravity\brain\427ef294-7b43-49cf-b6fa-17e2d0e4b50b\websites_list_view.png')

non_white = []
for y in range(350, 430):
    for x in range(800, 1850):
        r, g, b, *a = im.getpixel((x, y))
        if not (r > 245 and g > 245 and b > 245):
            non_white.append((x, y, (r, g, b)))

print(f"Total non-white pixels: {len(non_white)}")
if non_white:
    xs = [p[0] for p in non_white]
    ys = [p[1] for p in non_white]
    print(f"X range: {min(xs)} to {max(xs)}, Y range: {min(ys)} to {max(ys)}")
