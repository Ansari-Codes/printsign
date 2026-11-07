import ctypes
import time
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

time.sleep(0.3)

# Press Ctrl+4 to switch to tab 4
user32.keybd_event(0x11, 0, 0, 0)
user32.keybd_event(0x34, 0, 0, 0)
time.sleep(0.1)
user32.keybd_event(0x34, 0, 2, 0)
user32.keybd_event(0x11, 0, 2, 0)
print("Sent Ctrl+4!")

time.sleep(3.0)

im = ImageGrab.grab(bbox=(0, 0, 1920, 1080))
im.save(r'C:\Users\Paradise Computers\.gemini\antigravity\brain\427ef294-7b43-49cf-b6fa-17e2d0e4b50b\after_ctrl4.png')
print("Saved after_ctrl4.png")
