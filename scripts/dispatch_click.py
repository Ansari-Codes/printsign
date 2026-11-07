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

# JS code to find the element and trigger full pointer/mouse sequence
js_code = """
(function() {
  const all = Array.from(document.querySelectorAll('*'));
  const target = all.find(e => e.children.length === 0 && e.textContent && e.textContent.toLowerCase().includes("what's on your mind"));
  if (!target) return;
  let btn = target;
  while (btn && btn !== document.body) {
    if (btn.getAttribute('role') === 'button' || btn.tagName === 'BUTTON') break;
    btn = btn.parentElement;
  }
  const el = btn || target;
  ['pointerdown', 'mousedown', 'pointerup', 'mouseup', 'click'].forEach(type => {
    el.dispatchEvent(new MouseEvent(type, { bubbles: true, cancelable: true, view: window }));
  });
})();
""".strip().replace('\n', ' ')

win32clipboard.OpenClipboard()
win32clipboard.EmptyClipboard()
win32clipboard.SetClipboardText(js_code)
win32clipboard.CloseClipboard()

VK_CONTROL = 0x11
VK_V = 0x56
user32.keybd_event(VK_CONTROL, 0, 0, 0)
user32.keybd_event(VK_V, 0, 0, 0)
time.sleep(0.05)
user32.keybd_event(VK_V, 0, 2, 0)
user32.keybd_event(VK_CONTROL, 0, 2, 0)
time.sleep(0.1)

VK_RETURN = 0x0D
user32.keybd_event(VK_RETURN, 0, 0, 0)
time.sleep(0.05)
user32.keybd_event(VK_RETURN, 0, 2, 0)

print("Dispatched full click events, waiting 3 seconds...")
time.sleep(3.0)

im = ImageGrab.grab(bbox=(0, 0, 1920, 1080))
im.save(r'C:\Users\Paradise Computers\.gemini\antigravity\brain\427ef294-7b43-49cf-b6fa-17e2d0e4b50b\fb_full_click_result.png')
print("Captured fb_full_click_result.png")
