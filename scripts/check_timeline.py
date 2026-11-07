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

# Close DevTools with F12
VK_F12 = 0x7B
user32.keybd_event(VK_F12, 0, 0, 0)
time.sleep(0.05)
user32.keybd_event(VK_F12, 0, 2, 0)
time.sleep(1.0)

# Scroll page down to see timeline
user32.SetCursorPos(700, 500)
time.sleep(0.1)
for _ in range(6):
    user32.mouse_event(0x0800, 0, 0, -240, 0)
    time.sleep(0.1)

time.sleep(1.0)

im = ImageGrab.grab(bbox=(0, 0, 1920, 1080))
im.save(r'C:\Users\Paradise Computers\.gemini\antigravity\brain\427ef294-7b43-49cf-b6fa-17e2d0e4b50b\fb_timeline_scrolled.png')
print("Closed DevTools, scrolled timeline and captured")
