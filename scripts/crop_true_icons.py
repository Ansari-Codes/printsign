from PIL import Image

im = Image.open(r'C:\Users\Paradise Computers\.gemini\antigravity\brain\427ef294-7b43-49cf-b6fa-17e2d0e4b50b\websites_list_view.png')
crop = im.crop((1550, 370, 1820, 420))
crop.save(r'C:\Users\Paradise Computers\.gemini\antigravity\brain\427ef294-7b43-49cf-b6fa-17e2d0e4b50b\TRUE_VIEW_ICONS.png')
print("Saved TRUE_VIEW_ICONS.png")
