import ctypes
import time
from PIL import ImageGrab

user32 = ctypes.windll.user32
user32.SetProcessDPIAware()
hdesk = user32.OpenDesktopW('Default', 0, False, 0x01FF)
if hdesk:
    user32.SetThreadDesktop(hdesk)

hwnd = 12257118
user32.ShowWindow(hwnd, 3) # SW_MAXIMIZE
user32.BringWindowToTop(hwnd)
user32.SetForegroundWindow(hwnd)
time.sleep(0.5)

im = ImageGrab.grab(bbox=(0, 0, 1920, 1080))
im.save(r'C:\Users\Paradise Computers\.gemini\antigravity\brain\427ef294-7b43-49cf-b6fa-17e2d0e4b50b\chrome_12257118_now.png')
print("Captured chrome_12257118_now.png")
