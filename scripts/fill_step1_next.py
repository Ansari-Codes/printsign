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

# JS code to fill Website and click Next
js_code = """
(function() {
  const inputs = Array.from(document.querySelectorAll('input'));
  const webInput = inputs.find(i => {
    const label = (i.getAttribute('aria-label') || '').toLowerCase();
    const ph = (i.placeholder || '').toLowerCase();
    return label.includes('website') || ph.includes('website');
  }) || inputs[0];

  if (webInput) {
    webInput.focus();
    // React synthetic input setter
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    nativeInputValueSetter.call(webInput, 'https://printsign.org');
    webInput.dispatchEvent(new Event('input', { bubbles: true }));
    webInput.dispatchEvent(new Event('change', { bubbles: true }));
    console.log('Website set to https://printsign.org');
  }

  setTimeout(() => {
    const nextBtn = Array.from(document.querySelectorAll('div[role="button"], button')).find(b => b.innerText && b.innerText.trim() === 'Next');
    if (nextBtn) {
      console.log('Found Next button, clicking...');
      nextBtn.click();
    } else {
      console.log('Next button not found');
    }
  }, 1000);
})();
""".strip().replace('\n', ' ')

win32clipboard.OpenClipboard()
win32clipboard.EmptyClipboard()
win32clipboard.SetClipboardText(js_code)
win32clipboard.CloseClipboard()

# Paste: Ctrl + V
VK_CONTROL = 0x11
VK_V = 0x56
user32.keybd_event(VK_CONTROL, 0, 0, 0)
user32.keybd_event(VK_V, 0, 0, 0)
time.sleep(0.05)
user32.keybd_event(VK_V, 0, 2, 0)
user32.keybd_event(VK_CONTROL, 0, 2, 0)
time.sleep(0.2)

# Enter
VK_RETURN = 0x0D
user32.keybd_event(VK_RETURN, 0, 0, 0)
time.sleep(0.05)
user32.keybd_event(VK_RETURN, 0, 2, 0)

print("Executed script, waiting 4 seconds...")
time.sleep(4.0)

im = ImageGrab.grab(bbox=(0, 0, 1920, 1080))
im.save(r'C:\Users\Paradise Computers\.gemini\antigravity\brain\427ef294-7b43-49cf-b6fa-17e2d0e4b50b\fb_step2_result.png')
print("Captured fb_step2_result.png")
