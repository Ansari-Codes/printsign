import ctypes
import time
from PIL import ImageGrab

user32 = ctypes.windll.user32
user32.SetProcessDPIAware()

hdesk = user32.OpenDesktopW('Default', 0, False, 0x01FF)
if hdesk:
    user32.SetThreadDesktop(hdesk)

hwnd = 17696106
user32.ShowWindow(hwnd, 3)
user32.SetForegroundWindow(hwnd)
time.sleep(0.3)

# Scroll up at x=800, y=500
user32.SetCursorPos(800, 500)
time.sleep(0.1)
for _ in range(8):
    user32.mouse_event(0x0800, 0, 0, 240, 0) # wheel UP
    time.sleep(0.1)

time.sleep(1.0)

im = ImageGrab.grab(bbox=(0, 0, 1920, 1080))
im.save(r'C:\Users\Paradise Computers\.gemini\antigravity\brain\427ef294-7b43-49cf-b6fa-17e2d0e4b50b\fb_page_top.png')
print("Scrolled to top and captured")
