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

post_content = "🚀 Introducing PrintSign PDF Editor (https://printsign.org) — 100% Client-Side PDF Redactor, Splitter & Privacy Tools! Zero server uploads, zero telemetry, full offline PWA. #PrintSign #PDFEditor #Privacy"

# This JS function:
# 1. Opens the Create Post modal if not open
# 2. Waits for [role="dialog"] [contenteditable="true"]
# 3. Inserts text and dispatches input events
# 4. Clicks the Post button
js_full = """
(async function() {
  function getPostBox() {
    const all = Array.from(document.querySelectorAll('*'));
    const target = all.find(e => e.children.length === 0 && e.textContent && e.textContent.toLowerCase().includes("what's on your mind"));
    if (!target) return null;
    let btn = target;
    while (btn && btn !== document.body) {
      if (btn.getAttribute('role') === 'button' || btn.tagName === 'BUTTON') break;
      btn = btn.parentElement;
    }
    return btn || target;
  }

  // 1. Open modal
  let dialog = document.querySelector('[role="dialog"]');
  if (!dialog) {
    const box = getPostBox();
    if (box) {
      ['pointerdown', 'mousedown', 'pointerup', 'mouseup', 'click'].forEach(t => {
        box.dispatchEvent(new MouseEvent(t, { bubbles: true, cancelable: true, view: window }));
      });
    }
    await new Promise(r => setTimeout(r, 2000));
    dialog = document.querySelector('[role="dialog"]');
  }

  if (!dialog) {
    console.error('Dialog failed to open');
    return;
  }

  const editor = dialog.querySelector('[contenteditable="true"]');
  if (!editor) {
    console.error('Editor not found inside dialog');
    return;
  }

  editor.focus();
  document.execCommand('selectAll', false, null);
  document.execCommand('insertText', false, `%POST_TEXT%`);
  editor.dispatchEvent(new Event('input', { bubbles: true }));

  console.log('Inserted text into editor successfully!');

  // Wait 2.5s for Facebook to activate Post button
  await new Promise(r => setTimeout(r, 2500));

  const postBtn = Array.from(dialog.querySelectorAll('div[role="button"], button')).find(b => {
    const txt = (b.innerText || '').trim();
    const aria = (b.getAttribute('aria-label') || '').trim();
    return txt === 'Post' || aria === 'Post';
  });

  if (postBtn) {
    console.log('Clicking Post button...');
    ['pointerdown', 'mousedown', 'pointerup', 'mouseup', 'click'].forEach(t => {
      postBtn.dispatchEvent(new MouseEvent(t, { bubbles: true, cancelable: true, view: window }));
    });
    console.log('Post button clicked!');
  } else {
    console.error('Post button not found');
  }
})();
""".strip().replace('\n', ' ').replace('%POST_TEXT%', post_content.replace("'", "\\'"))

win32clipboard.OpenClipboard()
win32clipboard.EmptyClipboard()
win32clipboard.SetClipboardText(js_full)
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

print("Executed post publication script, waiting 7 seconds...")
time.sleep(7.0)

im = ImageGrab.grab(bbox=(0, 0, 1920, 1080))
im.save(r'C:\Users\Paradise Computers\.gemini\antigravity\brain\427ef294-7b43-49cf-b6fa-17e2d0e4b50b\fb_post_published.png')
print("Captured fb_post_published.png")
