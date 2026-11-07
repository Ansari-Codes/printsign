import ctypes
import time
from PIL import ImageGrab
import win32clipboard

user32 = ctypes.windll.user32
kernel32 = ctypes.windll.kernel32
user32.SetProcessDPIAware()

hdesk = user32.OpenDesktopW('Default', 0, False, 0x01FF)
if hdesk:
    user32.SetThreadDesktop(hdesk)

hwnd = 17696106

fore_thread = user32.GetWindowThreadProcessId(user32.GetForegroundWindow(), None)
app_thread = kernel32.GetCurrentThreadId()
user32.AttachThreadInput(fore_thread, app_thread, True)

user32.ShowWindow(hwnd, 3)
user32.SetForegroundWindow(hwnd)
user32.BringWindowToTop(hwnd)
user32.AttachThreadInput(fore_thread, app_thread, False)

time.sleep(0.3)

VK_ESCAPE = 0x1B
VK_TAB = 0x09
VK_CONTROL = 0x11
VK_A = 0x41
VK_V = 0x56
VK_BACK = 0x08

# 1. Close dropdown
user32.keybd_event(VK_ESCAPE, 0, 0, 0)
time.sleep(0.05)
user32.keybd_event(VK_ESCAPE, 0, 2, 0)
time.sleep(0.3)

# 2. Clear unwanted text in category input: Ctrl + A -> Backspace
user32.keybd_event(VK_CONTROL, 0, 0, 0)
user32.keybd_event(VK_A, 0, 0, 0)
time.sleep(0.05)
user32.keybd_event(VK_A, 0, 2, 0)
user32.keybd_event(VK_CONTROL, 0, 2, 0)
time.sleep(0.1)

user32.keybd_event(VK_BACK, 0, 0, 0)
time.sleep(0.05)
user32.keybd_event(VK_BACK, 0, 2, 0)
time.sleep(0.3)

# 3. Press Tab to jump to Bio
user32.keybd_event(VK_TAB, 0, 0, 0)
time.sleep(0.05)
user32.keybd_event(VK_TAB, 0, 2, 0)
time.sleep(0.3)

# 4. Paste Bio
win32clipboard.OpenClipboard()
win32clipboard.EmptyClipboard()
win32clipboard.SetClipboardText('100% Client-Side PDF Redactor, Splitter, Merger & Privacy Editor. Zero cloud uploads, zero telemetry, full offline PWA. https://printsign.org')
win32clipboard.CloseClipboard()

user32.keybd_event(VK_CONTROL, 0, 0, 0)
user32.keybd_event(VK_V, 0, 0, 0)
time.sleep(0.05)
user32.keybd_event(VK_V, 0, 2, 0)
user32.keybd_event(VK_CONTROL, 0, 2, 0)
time.sleep(0.5)

im = ImageGrab.grab(bbox=(0, 0, 1920, 1080))
im.save(r'C:\Users\Paradise Computers\.gemini\antigravity\brain\427ef294-7b43-49cf-b6fa-17e2d0e4b50b\fb_bio_pasted.png')
print("Captured fb_bio_pasted.png")
