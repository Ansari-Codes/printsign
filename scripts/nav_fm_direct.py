import ctypes
import time
import subprocess
from PIL import ImageGrab

user32 = ctypes.windll.user32
kernel32 = ctypes.windll.kernel32
user32.SetProcessDPIAware()

hdesk = user32.OpenDesktopW('Default', 0, False, 0x01FF)
if hdesk:
    user32.SetThreadDesktop(hdesk)

hwnd = 12257118

fore_thread = user32.GetWindowThreadProcessId(user32.GetForegroundWindow(), None)
app_thread = kernel32.GetCurrentThreadId()
user32.AttachThreadInput(fore_thread, app_thread, True)

user32.ShowWindow(hwnd, 9)
user32.ShowWindow(hwnd, 3)
user32.SetForegroundWindow(hwnd)
user32.BringWindowToTop(hwnd)
user32.AttachThreadInput(fore_thread, app_thread, False)

time.sleep(0.5)

# Focus URL bar: Ctrl+L
user32.keybd_event(0x11, 0, 0, 0)
user32.keybd_event(0x4C, 0, 0, 0)
time.sleep(0.1)
user32.keybd_event(0x4C, 0, 2, 0)
user32.keybd_event(0x11, 0, 2, 0)
time.sleep(0.3)

# Set clipboard to filemanager URL
subprocess.run(['powershell', '-Command', 'Set-Clipboard -Value "https://filemanager.hostinger.com/"'])

# Paste: Ctrl+V
user32.keybd_event(0x11, 0, 0, 0)
user32.keybd_event(0x56, 0, 0, 0)
time.sleep(0.1)
user32.keybd_event(0x56, 0, 2, 0)
user32.keybd_event(0x11, 0, 2, 0)
time.sleep(0.3)

# Enter
user32.keybd_event(0x0D, 0, 0, 0)
time.sleep(0.1)
user32.keybd_event(0x0D, 0, 2, 0)
print("Navigating to https://filemanager.hostinger.com/...")

time.sleep(6.0)

im = ImageGrab.grab(bbox=(0, 0, 1920, 1080))
im.save(r'C:\Users\Paradise Computers\.gemini\antigravity\brain\427ef294-7b43-49cf-b6fa-17e2d0e4b50b\fm_direct.png')
print("Saved fm_direct.png")
