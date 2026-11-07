from PIL import Image

im = Image.open(r'C:\Users\Paradise Computers\.gemini\antigravity\brain\427ef294-7b43-49cf-b6fa-17e2d0e4b50b\ftp_accounts_view.png')
crop = im.crop((230, 520, 410, 790))
crop.save(r'C:\Users\Paradise Computers\.gemini\antigravity\brain\427ef294-7b43-49cf-b6fa-17e2d0e4b50b\printsign_card_detailed.png')
print("Saved printsign_card_detailed.png")
