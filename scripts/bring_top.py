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

# Attach thread input to force foreground
fore_thread = user32.GetWindowThreadProcessId(user32.GetForegroundWindow(), None)
app_thread = kernel32.GetCurrentThreadId()
user32.AttachThreadInput(fore_thread, app_thread, True)

user32.ShowWindow(hwnd, 9) # SW_RESTORE
user32.ShowWindow(hwnd, 3) # SW_MAXIMIZE
user32.SetForegroundWindow(hwnd)
user32.BringWindowToTop(hwnd)

user32.AttachThreadInput(fore_thread, app_thread, False)

time.sleep(1.0)
im = ImageGrab.grab(bbox=(0, 0, 1920, 1080))
im.save(r'C:\Users\Paradise Computers\.gemini\antigravity\brain\427ef294-7b43-49cf-b6fa-17e2d0e4b50b\chrome_122_top.png')
print("Captured chrome_122_top.png")
