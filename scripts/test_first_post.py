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

VK_CONTROL = 0x11
VK_SHIFT = 0x10
VK_J = 0x4A
VK_V = 0x56
VK_RETURN = 0x0D

post_content = """🚀 Introducing PrintSign PDF Editor — The 100% Client-Side PDF Redactor & Privacy Suite!

Tired of uploading sensitive financial records, contracts, or legal files to unknown cloud servers? PrintSign runs entirely inside your browser:

🔒 100% Client-Side: Zero server uploads, zero telemetry, zero risk.
✂️ Permanent Redaction: Pixel-burn rasterization + indirect object garbage collection.
📄 Full Page Tools: Rotate, split, merge, reorder, and extract pages.
⚡ Works Offline: Offline-first PWA with instant precaching.

Try it now completely free — no account or installation required:
👉 https://printsign.org

#PrintSign #PDFEditor #Privacy #DataSecurity #ClientSide #PDFTools"""

# 1. Focus the textbox using JS via console
js_focus = """
(function() {
  const tb = document.querySelector('div[role="textbox"]');
  if (tb) {
    tb.focus();
    console.log('Focused textbox');
  } else {
    console.log('Textbox not found');
  }
})();
""".strip().replace('\n', ' ')

win32clipboard.OpenClipboard()
win32clipboard.EmptyClipboard()
win32clipboard.SetClipboardText(js_focus)
win32clipboard.CloseClipboard()

# Paste to console & Enter
user32.keybd_event(VK_CONTROL, 0, 0, 0)
user32.keybd_event(VK_V, 0, 0, 0)
time.sleep(0.05)
user32.keybd_event(VK_V, 0, 2, 0)
user32.keybd_event(VK_CONTROL, 0, 2, 0)
time.sleep(0.1)

user32.keybd_event(VK_RETURN, 0, 0, 0)
time.sleep(0.05)
user32.keybd_event(VK_RETURN, 0, 2, 0)
time.sleep(0.5)

# 2. Put post content into clipboard
win32clipboard.OpenClipboard()
win32clipboard.EmptyClipboard()
win32clipboard.SetClipboardText(post_content)
win32clipboard.CloseClipboard()

# Click inside the textbox area on screen to ensure OS focus
# The modal textbox is around x=480, y=340
user32.SetCursorPos(480, 340)
time.sleep(0.1)
user32.mouse_event(0x0002, 0, 0, 0, 0)
time.sleep(0.1)
user32.mouse_event(0x0004, 0, 0, 0, 0)
time.sleep(0.3)

# Paste post content: Ctrl + V
user32.keybd_event(VK_CONTROL, 0, 0, 0)
user32.keybd_event(VK_V, 0, 0, 0)
time.sleep(0.05)
user32.keybd_event(VK_V, 0, 2, 0)
user32.keybd_event(VK_CONTROL, 0, 2, 0)

time.sleep(2.0)

im = ImageGrab.grab(bbox=(0, 0, 1920, 1080))
im.save(r'C:\Users\Paradise Computers\.gemini\antigravity\brain\427ef294-7b43-49cf-b6fa-17e2d0e4b50b\fb_post_pasted.png')
print("Pasted post content and captured")
