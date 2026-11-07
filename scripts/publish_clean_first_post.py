import ctypes
import time
import base64
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

post_text = "PrintSign PDF Editor (https://printsign.org) is now live! 100% Client-Side PDF Redactor, Splitter, Merger & Security Suite. Zero server uploads, zero telemetry, full offline PWA."
b64_text = base64.b64encode(post_text.encode('utf-8')).decode('ascii')

js_code = f"""
(async function() {{
  function clickEl(el) {{
    if (!el) return;
    ['pointerdown', 'mousedown', 'pointerup', 'mouseup', 'click'].forEach(t => {{
      el.dispatchEvent(new MouseEvent(t, {{ bubbles: true, cancelable: true, view: window }}));
    }});
  }}

  let dialog = document.querySelector('[role="dialog"]');
  if (!dialog) {{
    const all = Array.from(document.querySelectorAll('*'));
    const target = all.find(e => e.children.length === 0 && e.textContent && e.textContent.toLowerCase().includes("what's on your mind"));
    if (target) {{
      let btn = target;
      while (btn && btn !== document.body) {{
        if (btn.getAttribute('role') === 'button' || btn.tagName === 'BUTTON') break;
        btn = btn.parentElement;
      }}
      clickEl(btn || target);
    }}
    await new Promise(r => setTimeout(r, 2000));
    dialog = document.querySelector('[role="dialog"]');
  }}

  if (!dialog) return;

  const editor = dialog.querySelector('[contenteditable="true"]');
  if (!editor) return;

  editor.focus();
  const text = atob('{b64_text}');
  document.execCommand('selectAll', false, null);
  document.execCommand('insertText', false, text);
  editor.dispatchEvent(new Event('input', {{ bubbles: true }}));

  await new Promise(r => setTimeout(r, 3000));

  const postBtn = Array.from(dialog.querySelectorAll('div[role="button"], button')).find(b => {{
    const txt = (b.innerText || '').trim();
    return txt === 'Post';
  }});

  if (postBtn) {{
    clickEl(postBtn);
  }}
}})();
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

# Press Enter to execute single line
user32.keybd_event(VK_RETURN, 0, 0, 0)
time.sleep(0.05)
user32.keybd_event(VK_RETURN, 0, 2, 0)

print("Executed publish script, waiting 10 seconds...")
time.sleep(10.0)

im = ImageGrab.grab(bbox=(0, 0, 1920, 1080))
im.save(r'C:\Users\Paradise Computers\.gemini\antigravity\brain\427ef294-7b43-49cf-b6fa-17e2d0e4b50b\fb_post_done.png')
print("Captured fb_post_done.png")
