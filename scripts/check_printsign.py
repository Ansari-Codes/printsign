import ctypes
import time
import subprocess
from PIL import ImageGrab

user32 = ctypes.windll.user32
user32.SetProcessDPIAware()
hdesk = user32.OpenDesktopW('Default', 0, False, 0x01FF)
if hdesk:
    user32.SetThreadDesktop(hdesk)

hwnd = 17696106
user32.keybd_event(0x12, 0, 0, 0)
user32.keybd_event(0x12, 0, 2, 0)
user32.ShowWindow(hwnd, 3)
user32.BringWindowToTop(hwnd)
user32.SetForegroundWindow(hwnd)
time.sleep(0.3)

# Click Search websites input at x=350, y=388
user32.SetCursorPos(350, 388)
user32.mouse_event(0x0002, 0, 0, 0, 0)
user32.mouse_event(0x0004, 0, 0, 0, 0)
time.sleep(0.2)

# Type 'printsign'
for char in 'printsign':
    vk = ord(char.upper())
    user32.keybd_event(vk, 0, 0, 0)
    user32.keybd_event(vk, 0, 2, 0)
    time.sleep(0.05)

time.sleep(1.0)

im = ImageGrab.grab(bbox=(0, 0, 1920, 1080))
im.save(r'C:\Users\Paradise Computers\.gemini\antigravity\brain\427ef294-7b43-49cf-b6fa-17e2d0e4b50b\search_printsign.png')
print('Searched for printsign!')
