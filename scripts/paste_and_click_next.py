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

time.sleep(0.5)

# Click inside the text area of the dialog (around x=700, y=450)
user32.SetCursorPos(700, 450)
user32.mouse_event(0x0002, 0, 0, 0, 0)
time.sleep(0.05)
user32.mouse_event(0x0004, 0, 0, 0, 0)
time.sleep(0.3)

# Select all (Ctrl + A)
VK_CONTROL = 0x11
VK_A = 0x41
VK_V = 0x56

user32.keybd_event(VK_CONTROL, 0, 0, 0)
user32.keybd_event(VK_A, 0, 0, 0)
time.sleep(0.05)
user32.keybd_event(VK_A, 0, 2, 0)
user32.keybd_event(VK_CONTROL, 0, 2, 0)
time.sleep(0.2)

# Set clipboard text
post_1_text = """🔒 PrintSign PDF Editor (https://printsign.org) - 100% Private, Client-Side PDF Tools!

Tired of uploading sensitive documents to unknown cloud servers? PrintSign runs entirely in your browser:
✅ Permanent Visual Redaction & Byte-Level Sanitization
✅ Fast PDF Merge & Custom Page Split
✅ Rotate, Reorder & Delete Pages
✅ Metadata Scrubbing (removes author, timestamps & hidden tags)
✅ 100% Offline PWA Support - Zero Cloud Uploads!

Try it free today: https://printsign.org
#PDFEditor #Privacy #DataSecurity #DocumentManagement #PrintSign"""

win32clipboard.OpenClipboard()
win32clipboard.EmptyClipboard()
win32clipboard.SetClipboardData(win32clipboard.CF_UNICODETEXT, post_1_text)
win32clipboard.CloseClipboard()

# Paste (Ctrl + V)
user32.keybd_event(VK_CONTROL, 0, 0, 0)
user32.keybd_event(VK_V, 0, 0, 0)
time.sleep(0.05)
user32.keybd_event(VK_V, 0, 2, 0)
user32.keybd_event(VK_CONTROL, 0, 2, 0)
time.sleep(1.0)

# Click the blue "Next" button at (950, 805)
user32.SetCursorPos(950, 805)
time.sleep(0.1)
user32.mouse_event(0x0002, 0, 0, 0, 0)
time.sleep(0.05)
user32.mouse_event(0x0004, 0, 0, 0, 0)

print("Pasted clean post text and clicked Next button. Waiting 4 seconds...")
time.sleep(4.0)

im = ImageGrab.grab(bbox=(0, 0, 1920, 1080))
im.save(r'C:\Users\Paradise Computers\.gemini\antigravity\brain\427ef294-7b43-49cf-b6fa-17e2d0e4b50b\fb_after_next.png')
print("Captured fb_after_next.png")
