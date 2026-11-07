from PIL import Image

im = Image.open(r'C:\Users\Paradise Computers\.gemini\antigravity\brain\427ef294-7b43-49cf-b6fa-17e2d0e4b50b\screen_now.png')
# Card is 470 to 1151
# Let's find rows with non-white pixels in the right side of the card (e.g. x from 900 to 1140)
for y in range(250, 650, 5):
    nw = [x for x in range(950, 1140) if not (im.getpixel((x, y))[0] > 250 and im.getpixel((x, y))[1] > 250 and im.getpixel((x, y))[2] > 250)]
    if nw:
        print(f"y={y}: count={len(nw)}, min_x={min(nw)}, max_x={max(nw)}")
