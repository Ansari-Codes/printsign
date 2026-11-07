import ctypes, time
from PIL import ImageGrab

user32 = ctypes.windll.user32
user32.SetProcessDPIAware()
hdesk = user32.OpenDesktopW('Default', 0, False, 0x01FF)
if hdesk:
    user32.SetThreadDesktop(hdesk)

hwnd = 12257118
user32.ShowWindow(hwnd, 3)
user32.BringWindowToTop(hwnd)
user32.SetForegroundWindow(hwnd)
time.sleep(0.3)

# Move cursor to center (x=500, y=500) and scroll down
user32.SetCursorPos(500, 500)
time.sleep(0.1)
user32.mouse_event(0x0800, 0, 0, -300, 0) # scroll down
time.sleep(1.0)

im = ImageGrab.grab(bbox=(0, 0, 1920, 1080))
im.save(r'C:\Users\Paradise Computers\.gemini\antigravity\brain\427ef294-7b43-49cf-b6fa-17e2d0e4b50b\hostinger_scrolled.png')
print("Scrolled down!")
