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
VK_V = 0x56
VK_RETURN = 0x0D

js_code = """
(async function() {
  function clickEl(el) {
    if (!el) return;
    ['pointerdown', 'mousedown', 'pointerup', 'mouseup', 'click'].forEach(t => {
      el.dispatchEvent(new MouseEvent(t, { bubbles: true, cancelable: true, view: window }));
    });
  }

  const all = Array.from(document.querySelectorAll('*'));
  const heading = all.find(e => e.children.length === 0 && e.textContent && e.textContent.trim() === 'Post settings');
  if (!heading) {
    document.title = "ERR: NO_HEADING";
    return;
  }

  let container = heading;
  while (container && container !== document.body && container.querySelectorAll('div[role="button"], button').length < 3) {
    container = container.parentElement;
  }

  const postBtn = Array.from(container.querySelectorAll('div[role="button"], button')).find(b => (b.innerText || '').trim() === 'Post');
  if (!postBtn) {
    document.title = "ERR: NO_POST_BTN";
    return;
  }

  console.log('CLICKING FINAL POST BUTTON!');
  clickEl(postBtn);
  document.title = "CLICKED_FINAL_POST_SUCCESS";
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

print("Clicked final Post button! Waiting 8 seconds...")
time.sleep(8.0)

# Check title
length = user32.GetWindowTextLengthW(hwnd)
buff = ctypes.create_unicode_buffer(length + 1)
user32.GetWindowTextW(hwnd, buff, length + 1)
print(f"Title: {buff.value}")

im = ImageGrab.grab(bbox=(0, 0, 1920, 1080))
im.save(r'C:\Users\Paradise Computers\.gemini\antigravity\brain\427ef294-7b43-49cf-b6fa-17e2d0e4b50b\fb_post1_final_published.png')
print("Captured fb_post1_final_published.png")
