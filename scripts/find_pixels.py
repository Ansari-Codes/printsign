from PIL import Image

im = Image.open(r'C:\Users\Paradise Computers\.gemini\antigravity\brain\427ef294-7b43-49cf-b6fa-17e2d0e4b50b\screen_now.png')
for x in range(400, 1200, 10):
    for y in range(450, 475, 5):
        r, g, b, *a = im.getpixel((x, y))
        if r < 150 or g < 150 or b < 150:
            print(f"Non-white at ({x}, {y}): rgb=({r}, {g}, {b})")
