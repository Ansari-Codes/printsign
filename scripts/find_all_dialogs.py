import ctypes
import time
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
VK_V = 0x56
VK_RETURN = 0x0D

js_code = """
(() => {
  const dialogs = Array.from(document.querySelectorAll('[role="dialog"]'));
  const summary = dialogs.map((d, i) => {
    const title = (d.querySelector('h1, h2, h3, [role="heading"]') || {}).innerText || 'NoHeading';
    const btns = Array.from(d.querySelectorAll('div[role="button"], button')).map(b => (b.innerText || b.getAttribute('aria-label') || '').trim()).filter(Boolean);
    return '#' + i + ' [' + title + ']: ' + btns.join(',');
  });
  document.title = "DIALOGS: " + summary.join(' --- ');
})();
""".strip().replace('\n', ' ')

win32clipboard.OpenClipboard()
win32clipboard.EmptyClipboard()
win32clipboard.SetClipboardData(win32clipboard.CF_UNICODETEXT, js_code)
win32clipboard.CloseClipboard()

# Paste to console
user32.keybd_event(VK_CONTROL, 0, 0, 0)
user32.keybd_event(VK_V, 0, 0, 0)
time.sleep(0.05)
user32.keybd_event(VK_V, 0, 2, 0)
user32.keybd_event(VK_CONTROL, 0, 2, 0)
time.sleep(0.2)

# Ctrl + Enter to execute
user32.keybd_event(VK_CONTROL, 0, 0, 0)
user32.keybd_event(VK_RETURN, 0, 0, 0)
time.sleep(0.05)
user32.keybd_event(VK_RETURN, 0, 2, 0)
user32.keybd_event(VK_CONTROL, 0, 2, 0)

time.sleep(1.0)

# Check title
length = user32.GetWindowTextLengthW(hwnd)
buff = ctypes.create_unicode_buffer(length + 1)
user32.GetWindowTextW(hwnd, buff, length + 1)
print(f"Title: {buff.value}")
