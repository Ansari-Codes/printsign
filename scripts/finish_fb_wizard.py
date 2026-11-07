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

# JavaScript loop to advance until the setup wizard is finished
js_code = """
(function loop(count = 0) {
  if (count > 8) return;
  const btn = Array.from(document.querySelectorAll('div[role="button"], button')).find(b => {
    const text = (b.innerText || '').trim();
    return text === 'Next' || text === 'Done' || text === 'Skip';
  });
  if (btn) {
    console.log('Advancing step, clicking:', btn.innerText.trim());
    btn.click();
    setTimeout(() => loop(count + 1), 3000);
  } else {
    console.log('No more wizard buttons found. Finished!');
  }
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
time.sleep(0.2)

VK_RETURN = 0x0D
user32.keybd_event(VK_RETURN, 0, 0, 0)
time.sleep(0.05)
user32.keybd_event(VK_RETURN, 0, 2, 0)

print("Started wizard advance loop, waiting 15 seconds...")
time.sleep(15.0)

im = ImageGrab.grab(bbox=(0, 0, 1920, 1080))
im.save(r'C:\Users\Paradise Computers\.gemini\antigravity\brain\427ef294-7b43-49cf-b6fa-17e2d0e4b50b\fb_page_live.png')
print("Captured fb_page_live.png")
