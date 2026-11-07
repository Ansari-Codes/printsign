import ctypes
import time
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

# Click inside DevTools Elements window
user32.SetCursorPos(400, 750)
user32.mouse_event(0x0002, 0, 0, 0, 0)
user32.mouse_event(0x0004, 0, 0, 0, 0)
time.sleep(0.2)

# Press Ctrl + ` (backtick / tilde)
user32.keybd_event(0x11, 0, 0, 0) # Ctrl
user32.keybd_event(0xC0, 0, 0, 0) # VK_OEM_3 (`)
user32.keybd_event(0xC0, 0, 2, 0)
user32.keybd_event(0x11, 0, 2, 0)
time.sleep(0.5)

im = ImageGrab.grab(bbox=(0, 600, 1200, 1000))
im.save(r'C:\Users\Paradise Computers\.gemini\antigravity\brain\427ef294-7b43-49cf-b6fa-17e2d0e4b50b\console_tab_view.png')
print('Pressed Ctrl+` in DevTools!')
