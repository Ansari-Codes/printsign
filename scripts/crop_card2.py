from PIL import Image

im = Image.open(r'C:\Users\Paradise Computers\.gemini\antigravity\brain\427ef294-7b43-49cf-b6fa-17e2d0e4b50b\ftp_accounts_view.png')

# The card with "printsign.org" text
for y in range(500, 900, 10):
    for x in range(200, 600, 20):
        # find where "printsign.org" is
        pass

# Let's crop from 200 to 500, y 500 to 800
crop = im.crop((230, 480, 450, 780))
crop.save(r'C:\Users\Paradise Computers\.gemini\antigravity\brain\427ef294-7b43-49cf-b6fa-17e2d0e4b50b\test_crop_card.png')
