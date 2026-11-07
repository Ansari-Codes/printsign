from PIL import Image

im = Image.open(r'C:\Users\Paradise Computers\.gemini\antigravity\brain\427ef294-7b43-49cf-b6fa-17e2d0e4b50b\screen_now.png')
# let's crop from 1000 to 1200, y 430 to 490
crop = im.crop((1050, 435, 1180, 485))
crop.save(r'C:\Users\Paradise Computers\.gemini\antigravity\brain\427ef294-7b43-49cf-b6fa-17e2d0e4b50b\button_exact.png')
print("Saved button_exact.png")
