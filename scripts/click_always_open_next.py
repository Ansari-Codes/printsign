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

def click_pos(x, y):
    user32.SetCursorPos(x, y)
    time.sleep(0.1)
    user32.mouse_event(0x0002, 0, 0, 0, 0)
    time.sleep(0.1)
    user32.mouse_event(0x0004, 0, 0, 0, 0)
    time.sleep(0.3)

# Click "Always open" radio button at x=60, y=650
click_pos(60, 650)
time.sleep(0.5)

# Click "Next" button at x=173, y=915
click_pos(173, 915)
time.sleep(3.0)

im = ImageGrab.grab(bbox=(0, 0, 1920, 1080))
im.save(r'C:\Users\Paradise Computers\.gemini\antigravity\brain\427ef294-7b43-49cf-b6fa-17e2d0e4b50b\fb_step2_screen.png')
print("Selected always open and clicked next")
