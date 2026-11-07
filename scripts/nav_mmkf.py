import ctypes
import time
import subprocess
from PIL import ImageGrab

user32 = ctypes.windll.user32
user32.SetProcessDPIAware()
hdesk = user32.OpenDesktopW('Default', 0, False, 0x01FF)
if hdesk:
    user32.SetThreadDesktop(hdesk)

hwnd = 12257118
user32.keybd_event(0x12, 0, 0, 0)
user32.keybd_event(0x12, 0, 2, 0)
user32.ShowWindow(hwnd, 3)
user32.BringWindowToTop(hwnd)
user32.SetForegroundWindow(hwnd)
time.sleep(0.3)

# Focus address bar
user32.keybd_event(0x11, 0, 0, 0) # Ctrl
user32.keybd_event(0x4C, 0, 0, 0) # L
user32.keybd_event(0x4C, 0, 2, 0)
user32.keybd_event(0x11, 0, 2, 0)
time.sleep(0.2)

url = "https://hpanel.hostinger.com/websites/mmkfstore.com"
subprocess.run(['powershell', '-Command', f'Set-Clipboard -Value "{url}"'])

user32.keybd_event(0x11, 0, 0, 0) # Ctrl
user32.keybd_event(0x56, 0, 0, 0) # V
user32.keybd_event(0x56, 0, 2, 0)
user32.keybd_event(0x11, 0, 2, 0)
time.sleep(0.2)

user32.keybd_event(0x0D, 0, 0, 0) # Enter
user32.keybd_event(0x0D, 0, 2, 0)
time.sleep(3.5)

im = ImageGrab.grab(bbox=(0, 0, 1920, 1080))
im.save(r'C:\Users\Paradise Computers\.gemini\antigravity\brain\427ef294-7b43-49cf-b6fa-17e2d0e4b50b\mmkfstore_dashboard.png')
print('Navigated to mmkfstore dashboard!')
