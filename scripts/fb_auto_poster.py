import ctypes
import time
import base64
import json
import os
import sys
from datetime import datetime
from PIL import ImageGrab
import win32clipboard

user32 = ctypes.windll.user32
kernel32 = ctypes.windll.kernel32
user32.SetProcessDPIAware()

HWND_CHROME = 17696106
POSTS_FILE = r'C:\Users\Paradise Computers\Desktop\pdf software\scripts\posts_50.json'
PROGRESS_FILE = r'C:\Users\Paradise Computers\Desktop\pdf software\scripts\fb_post_progress.json'
LOG_FILE = r'C:\Users\Paradise Computers\Desktop\pdf software\scripts\fb_auto_poster.log'
INTERVAL_SECONDS = 300  # 5 minutes

def log(msg):
    ts = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    line = f"[{ts}] {msg}"
    print(line, flush=True)
    with open(LOG_FILE, 'a', encoding='utf-8') as f:
        f.write(line + '\n')

def ensure_desktop():
    hdesk = user32.OpenDesktopW('Default', 0, False, 0x01FF)
    if hdesk:
        user32.SetThreadDesktop(hdesk)

def bring_chrome_to_front():
    ensure_desktop()
    fore_thread = user32.GetWindowThreadProcessId(user32.GetForegroundWindow(), None)
    app_thread = kernel32.GetCurrentThreadId()
    user32.AttachThreadInput(fore_thread, app_thread, True)

    user32.ShowWindow(HWND_CHROME, 3)
    user32.SetForegroundWindow(HWND_CHROME)
    user32.BringWindowToTop(HWND_CHROME)
    user32.AttachThreadInput(fore_thread, app_thread, False)
    time.sleep(0.5)

def publish_single_post(post_text, post_num):
    bring_chrome_to_front()

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

    # Wait for execution and FB network submission
    time.sleep(15.0)

    length = user32.GetWindowTextLengthW(HWND_CHROME)
    buff = ctypes.create_unicode_buffer(length + 1)
    user32.GetWindowTextW(HWND_CHROME, buff, length + 1)
    res_title = buff.value

    # Close DevTools with F12
    user32.keybd_event(VK_F12, 0, 0, 0)
    time.sleep(0.05)
    user32.keybd_event(VK_F12, 0, 2, 0)

    return res_title

def load_progress():
    if os.path.exists(PROGRESS_FILE):
        try:
            with open(PROGRESS_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception as e:
            log(f"Error loading progress: {e}")
    # Default initial state with Post 1 & 2 marked complete
    return {
        "completed_indices": [0, 1],
        "posts_done": 2,
        "history": [
            {"index": 0, "num": 1, "status": "POST_SUCCESS", "timestamp": "2026-10-27 04:10:48"},
            {"index": 1, "num": 2, "status": "POST_SUCCESS", "timestamp": "2026-10-27 04:14:50"}
        ]
    }

def save_progress(prog):
    with open(PROGRESS_FILE, 'w', encoding='utf-8') as f:
        json.dump(prog, f, indent=2)

def run_poster():
    log("=== FACEBOOK AUTO POSTER DAEMON STARTED ===")
    with open(POSTS_FILE, 'r', encoding='utf-8') as f:
        all_posts = json.load(f)

    log(f"Loaded {len(all_posts)} posts from {POSTS_FILE}")
    prog = load_progress()
    log(f"Already completed {len(prog['completed_indices'])} posts. Target is 50 posts (1 every 5 minutes).")

    for i in range(len(all_posts)):
        if i in prog['completed_indices']:
            continue

        post_num = i + 1
        post_content = all_posts[i]
        log(f"--- Preparing Post #{post_num}/50 ---")

        # Retry loop
        success = False
        for attempt in range(1, 4):
            log(f"Publishing Post #{post_num} (Attempt {attempt})...")
            try:
                res_title = publish_single_post(post_content, post_num)
                log(f"Result for Post #{post_num}: {res_title}")
                if "POST_SUCCESS" in res_title:
                    success = True
                    break
                else:
                    log(f"Attempt {attempt} returned non-success: {res_title}. Retrying in 12s...")
                    time.sleep(12)
            except Exception as e:
                log(f"Error during attempt {attempt}: {e}")
                time.sleep(10)

        if success:
            prog['completed_indices'].append(i)
            prog['posts_done'] = len(prog['completed_indices'])
            prog['history'].append({
                "index": i,
                "num": post_num,
                "status": "POST_SUCCESS",
                "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            })
            save_progress(prog)
            log(f"✅ Successfully published Post #{post_num}/50!")
        else:
            log(f"❌ Failed to publish Post #{post_num} after 3 attempts.")
            prog['history'].append({
                "index": i,
                "num": post_num,
                "status": "FAILED",
                "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            })
            save_progress(prog)

        if i < len(all_posts) - 1:
            log(f"⏳ Waiting {INTERVAL_SECONDS} seconds (5 minutes) before Post #{post_num + 1}...")
            time.sleep(INTERVAL_SECONDS)

    log("🎉 ALL 50 POSTS COMPLETED! AUTO POSTER FINISHED!")

if __name__ == '__main__':
    run_poster()
