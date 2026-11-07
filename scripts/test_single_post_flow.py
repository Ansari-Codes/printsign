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

def publish_single_post(post_text):
    fore_thread = user32.GetWindowThreadProcessId(user32.GetForegroundWindow(), None)
    app_thread = kernel32.GetCurrentThreadId()
    user32.AttachThreadInput(fore_thread, app_thread, True)

    user32.ShowWindow(hwnd, 3)
    user32.SetForegroundWindow(hwnd)
    user32.BringWindowToTop(hwnd)
    user32.AttachThreadInput(fore_thread, app_thread, False)

    time.sleep(0.5)

    VK_CONTROL = 0x11
    VK_SHIFT = 0x10
    VK_J = 0x4A
    VK_V = 0x56
    VK_RETURN = 0x0D
    VK_F12 = 0x7B

    # Open DevTools Console
    user32.keybd_event(VK_CONTROL, 0, 0, 0)
    user32.keybd_event(VK_SHIFT, 0, 0, 0)
    user32.keybd_event(VK_J, 0, 0, 0)
    time.sleep(0.05)
    user32.keybd_event(VK_J, 0, 2, 0)
    user32.keybd_event(VK_SHIFT, 0, 2, 0)
    user32.keybd_event(VK_CONTROL, 0, 2, 0)

    time.sleep(1.5)

    b64_text = base64.b64encode(post_text.encode('utf-8')).decode('ascii')

    js_code = f"""
(async function() {{
  function clickEl(el) {{
    if (!el) return false;
    ['pointerdown', 'mousedown', 'pointerup', 'mouseup', 'click'].forEach(t => {{
      el.dispatchEvent(new MouseEvent(t, {{ bubbles: true, cancelable: true, view: window }}));
    }});
    return true;
  }}

  window.scrollTo(0, 0);
  await new Promise(r => setTimeout(r, 1000));

  let dialog = Array.from(document.querySelectorAll('[role="dialog"]')).find(d => {{
    const h = d.querySelector('h1, h2, h3, [role="heading"]');
    return h && h.innerText && h.innerText.toLowerCase().includes('create post');
  }});

  if (!dialog) {{
    const all = Array.from(document.querySelectorAll('*'));
    const target = all.find(e => e.children.length === 0 && e.textContent && e.textContent.toLowerCase().includes("what's on your mind"));
    if (!target) {{
      document.title = "ERR: NO_TRIGGER";
      return;
    }}
    let btn = target;
    while (btn && btn !== document.body) {{
      if (btn.getAttribute('role') === 'button' || btn.tagName === 'BUTTON') break;
      btn = btn.parentElement;
    }}
    clickEl(btn || target);
    await new Promise(r => setTimeout(r, 3000));
    dialog = Array.from(document.querySelectorAll('[role="dialog"]')).find(d => {{
      const h = d.querySelector('h1, h2, h3, [role="heading"]');
      return h && h.innerText && h.innerText.toLowerCase().includes('create post');
    }});
  }}

  if (!dialog) {{
    document.title = "ERR: NO_CREATE_POST_DIALOG";
    return;
  }}

  const editor = dialog.querySelector('[contenteditable="true"]');
  if (!editor) {{
    document.title = "ERR: NO_EDITOR";
    return;
  }}

  editor.focus();
  const text = atob('{b64_text}');
  document.execCommand('selectAll', false, null);
  document.execCommand('insertText', false, text);
  editor.dispatchEvent(new Event('input', {{ bubbles: true }}));

  await new Promise(r => setTimeout(r, 3500));

  const nextBtn = Array.from(dialog.querySelectorAll('div[role="button"], button')).find(b => (b.innerText || '').trim() === 'Next');
  if (!nextBtn) {{
    document.title = "ERR: NO_NEXT_BTN";
    return;
  }}
  clickEl(nextBtn);

  await new Promise(r => setTimeout(r, 4000));

  const allEl = Array.from(document.querySelectorAll('*'));
  const heading = allEl.find(e => e.children.length === 0 && e.textContent && e.textContent.trim() === 'Post settings');
  let container = heading;
  while (container && container !== document.body && container.querySelectorAll('div[role="button"], button').length < 3) {{
    container = container.parentElement;
  }}

  const postBtn = container ? Array.from(container.querySelectorAll('div[role="button"], button')).find(b => (b.innerText || '').trim() === 'Post') : null;
  if (!postBtn) {{
    document.title = "ERR: NO_FINAL_POST_BTN";
    return;
  }}

  clickEl(postBtn);
  document.title = "POST_SUCCESS";
}})();
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

    # Ctrl + Enter
    user32.keybd_event(VK_CONTROL, 0, 0, 0)
    user32.keybd_event(VK_RETURN, 0, 0, 0)
    time.sleep(0.05)
    user32.keybd_event(VK_RETURN, 0, 2, 0)
    user32.keybd_event(VK_CONTROL, 0, 2, 0)

    print("Dispatched posting script, waiting 15s...")
    time.sleep(15.0)

    # Check title
    length = user32.GetWindowTextLengthW(hwnd)
    buff = ctypes.create_unicode_buffer(length + 1)
    user32.GetWindowTextW(hwnd, buff, length + 1)
    res_title = buff.value
    print(f"Result Title: {res_title}")

    # Close DevTools with F12
    user32.keybd_event(VK_F12, 0, 0, 0)
    time.sleep(0.05)
    user32.keybd_event(VK_F12, 0, 2, 0)

    return res_title

if __name__ == '__main__':
    post_2 = """📄 Need to permanently redact sensitive information from your PDF documents?

With PrintSign (https://printsign.org), redaction doesn't just draw a black box on top — it renders and flattens your document with byte-level sanitization at up to 600 DPI.
No hidden text layers, no residual metadata, and 100% processed on your machine!

👉 Use it free: https://printsign.org
#PrivacyFirst #PDFRedaction #CyberSecurity #PrintSign #DocumentSafety"""
    
    res = publish_single_post(post_2)
    time.sleep(3.0)
    im = ImageGrab.grab(bbox=(0, 0, 1920, 1080))
    im.save(r'C:\Users\Paradise Computers\.gemini\antigravity\brain\427ef294-7b43-49cf-b6fa-17e2d0e4b50b\fb_post2_result.png')
    print("Finished post 2 test, captured fb_post2_result.png")
