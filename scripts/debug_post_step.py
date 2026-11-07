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

# Focus Console
user32.keybd_event(VK_CONTROL, 0, 0, 0)
user32.keybd_event(VK_SHIFT, 0, 0, 0)
user32.keybd_event(VK_J, 0, 0, 0)
time.sleep(0.05)
user32.keybd_event(VK_J, 0, 2, 0)
user32.keybd_event(VK_SHIFT, 0, 2, 0)
user32.keybd_event(VK_CONTROL, 0, 2, 0)

time.sleep(1.5)

js_code = """
(async function() {
  console.log('--- STARTING POST SCRIPT ---');
  const all = Array.from(document.querySelectorAll('*'));
  const target = all.find(e => e.children.length === 0 && e.textContent && e.textContent.toLowerCase().includes("what's on your mind"));
  console.log('Target found:', target);
  if (!target) return;
  let btn = target;
  while (btn && btn !== document.body) {
    if (btn.getAttribute('role') === 'button' || btn.tagName === 'BUTTON') break;
    btn = btn.parentElement;
  }
  console.log('Clicking trigger:', btn);
  ['pointerdown', 'mousedown', 'pointerup', 'mouseup', 'click'].forEach(t => {
    (btn || target).dispatchEvent(new MouseEvent(t, { bubbles: true, cancelable: true, view: window }));
  });

  await new Promise(r => setTimeout(r, 2500));
  const dialog = document.querySelector('[role="dialog"]');
  console.log('Dialog found:', dialog);
  if (!dialog) return;

  const editor = dialog.querySelector('[contenteditable="true"]');
  console.log('Editor found:', editor);
  if (!editor) return;

  editor.focus();
  document.execCommand('selectAll', false, null);
  document.execCommand('insertText', false, 'PrintSign PDF Editor (https://printsign.org) is 100% live! Edit, redact & split PDFs locally.');
  editor.dispatchEvent(new Event('input', { bubbles: true }));
  console.log('Text inserted');

  await new Promise(r => setTimeout(r, 2500));

  const postBtn = Array.from(dialog.querySelectorAll('div[role="button"], button')).find(b => (b.innerText || '').trim() === 'Post');
  console.log('Post button found:', postBtn);
  if (postBtn) {
    ['pointerdown', 'mousedown', 'pointerup', 'mouseup', 'click'].forEach(t => {
      postBtn.dispatchEvent(new MouseEvent(t, { bubbles: true, cancelable: true, view: window }));
    });
    console.log('Post button clicked successfully!');
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

print("Executed debug post script, waiting 10 seconds...")
time.sleep(10.0)

im = ImageGrab.grab(bbox=(0, 0, 1920, 1080))
im.save(r'C:\Users\Paradise Computers\.gemini\antigravity\brain\427ef294-7b43-49cf-b6fa-17e2d0e4b50b\fb_debug_post_result.png')
print("Captured fb_debug_post_result.png")
