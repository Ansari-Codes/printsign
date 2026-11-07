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

time.sleep(0.4)

VK_CONTROL = 0x11
VK_SHIFT = 0x10
VK_J = 0x4A
VK_V = 0x56
VK_RETURN = 0x0D

# Open Console with Ctrl + Shift + J
user32.keybd_event(VK_CONTROL, 0, 0, 0)
user32.keybd_event(VK_SHIFT, 0, 0, 0)
user32.keybd_event(VK_J, 0, 0, 0)
time.sleep(0.05)
user32.keybd_event(VK_J, 0, 2, 0)
user32.keybd_event(VK_SHIFT, 0, 2, 0)
user32.keybd_event(VK_CONTROL, 0, 2, 0)

time.sleep(1.2)

js_code = """
(() => {
  const dialog = document.querySelector('[role="dialog"]');
  if (!dialog) {
    document.title = "RES: NO_DIALOG";
    return;
  }
  const btns = Array.from(dialog.querySelectorAll('div[role="button"], button'));
  const nextBtn = btns.find(b => (b.innerText || b.getAttribute('aria-label') || '').trim().toLowerCase() === 'next');
  if (nextBtn) {
    ['pointerdown', 'mousedown', 'pointerup', 'mouseup', 'click'].forEach(t => {
      nextBtn.dispatchEvent(new MouseEvent(t, { bubbles: true, cancelable: true, view: window }));
    });
    document.title = "RES: CLICKED_NEXT";
  } else {
    document.title = "RES: NO_NEXT: " + btns.map(b => (b.innerText || b.getAttribute('aria-label') || '').trim()).join('|').slice(0, 100);
  }
})();
""".strip().replace('\n', ' ')

win32clipboard.OpenClipboard()
win32clipboard.EmptyClipboard()
win32clipboard.SetClipboardData(win32clipboard.CF_UNICODETEXT, js_code)
win32clipboard.CloseClipboard()

# Paste
user32.keybd_event(VK_CONTROL, 0, 0, 0)
user32.keybd_event(VK_V, 0, 0, 0)
time.sleep(0.05)
user32.keybd_event(VK_V, 0, 2, 0)
user32.keybd_event(VK_CONTROL, 0, 2, 0)
time.sleep(0.2)

# Enter
user32.keybd_event(VK_RETURN, 0, 0, 0)
time.sleep(0.05)
user32.keybd_event(VK_RETURN, 0, 2, 0)

print("Pasted and pressed Enter. Waiting 3 seconds...")
time.sleep(3.0)

# Check title
length = user32.GetWindowTextLengthW(hwnd)
buff = ctypes.create_unicode_buffer(length + 1)
user32.GetWindowTextW(hwnd, buff, length + 1)
print(f"Title: {buff.value}")

im = ImageGrab.grab(bbox=(0, 0, 1920, 1080))
im.save(r'C:\Users\Paradise Computers\.gemini\antigravity\brain\427ef294-7b43-49cf-b6fa-17e2d0e4b50b\fb_after_js_next.png')
