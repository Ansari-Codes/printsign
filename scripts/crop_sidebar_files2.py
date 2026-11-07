from PIL import Image

im = Image.open(r'C:\Users\Paradise Computers\.gemini\antigravity\brain\427ef294-7b43-49cf-b6fa-17e2d0e4b50b\after_scaled_click.png')
crop = im.crop((50, 715, 220, 760))
crop.save(r'C:\Users\Paradise Computers\.gemini\antigravity\brain\427ef294-7b43-49cf-b6fa-17e2d0e4b50b\sidebar_files2.png')
print("Saved sidebar_files2.png")
