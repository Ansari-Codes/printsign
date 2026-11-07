from PIL import Image

im = Image.open(r'C:\Users\Paradise Computers\.gemini\antigravity\brain\427ef294-7b43-49cf-b6fa-17e2d0e4b50b\ftp_accounts_view.png')

# Find pixels with color of "printsign.org" text (usually dark gray/black)
# around y 700 to 760
matches = []
for y in range(700, 760):
    for x in range(200, 600):
        r, g, b, *a = im.getpixel((x, y))
        if r < 60 and g < 60 and b < 60:
            matches.append((x, y))

if matches:
    xs = [m[0] for m in matches]
    ys = [m[1] for m in matches]
    print(f"Text found at X: {min(xs)} to {max(xs)}, Y: {min(ys)} to {max(ys)}")
else:
    print("No dark text found in that range")
