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

user32.ShowWindow(hwnd, 3)
user32.SetForegroundWindow(hwnd)
user32.BringWindowToTop(hwnd)
user32.AttachThreadInput(fore_thread, app_thread, False)

time.sleep(0.3)

# Focus address bar: Ctrl + L
VK_CONTROL = 0x11
VK_L = 0x4C

user32.keybd_event(VK_CONTROL, 0, 0, 0)
user32.keybd_event(VK_L, 0, 0, 0)
time.sleep(0.05)
user32.keybd_event(VK_L, 0, 2, 0)
user32.keybd_event(VK_CONTROL, 0, 2, 0)
time.sleep(0.2)

# Type https://printsign.org
# We can use clipboard or send characters
# Let's type 'https://printsign.org' via clipboard paste (Ctrl+V)
import win32clipboard
win32clipboard.OpenClipboard()
win32clipboard.EmptyClipboard()
win32clipboard.SetClipboardText('https://printsign.org')
win32clipboard.CloseClipboard()

# Ctrl + V
user32.keybd_event(VK_CONTROL, 0, 0, 0)
user32.keybd_event(0x56, 0, 0, 0) # V
time.sleep(0.05)
user32.keybd_event(0x56, 0, 2, 0)
user32.keybd_event(VK_CONTROL, 0, 2, 0)
time.sleep(0.1)

# Press Enter
user32.keybd_event(0x0D, 0, 0, 0) # VK_RETURN
time.sleep(0.05)
user32.keybd_event(0x0D, 0, 2, 0)

time.sleep(2.5)

im = ImageGrab.grab(bbox=(0, 0, 1920, 1080))
im.save(r'C:\Users\Paradise Computers\.gemini\antigravity\brain\427ef294-7b43-49cf-b6fa-17e2d0e4b50b\https_navigated.png')
print("Navigated to https://printsign.org and captured https_navigated.png")
