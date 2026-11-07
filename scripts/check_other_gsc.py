import ctypes
import time
from PIL import ImageGrab

user32 = ctypes.windll.user32
user32.SetProcessDPIAware()
hdesk = user32.OpenDesktopW('Default', 0, False, 0x01FF)
if hdesk:
    user32.SetThreadDesktop(hdesk)

def capture_hwnd(hwnd, name):
    user32.keybd_event(0x12, 0, 0, 0)
    user32.keybd_event(0x12, 0, 2, 0)
    user32.ShowWindow(hwnd, 3) # SW_MAXIMIZE
    user32.BringWindowToTop(hwnd)
    user32.SetForegroundWindow(hwnd)
    time.sleep(0.5)
    im = ImageGrab.grab(bbox=(0, 0, 1920, 1080))
    im.save(rf'C:\Users\Paradise Computers\.gemini\antigravity\brain\427ef294-7b43-49cf-b6fa-17e2d0e4b50b\{name}.png')
    print(f"Captured {name}.png")

capture_hwnd(1836744, "window_1836744")
