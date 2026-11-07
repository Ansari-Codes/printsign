import ctypes
import time
from PIL import ImageGrab

user32 = ctypes.windll.user32
kernel32 = ctypes.windll.kernel32

hdesk = user32.OpenDesktopW('Default', 0, False, 0x01FF)
if hdesk:
    user32.SetThreadDesktop(hdesk)

hwnd = 12257118

fore_thread = user32.GetWindowThreadProcessId(user32.GetForegroundWindow(), None)
app_thread = kernel32.GetCurrentThreadId()
user32.AttachThreadInput(fore_thread, app_thread, True)

user32.ShowWindow(hwnd, 9)
user32.ShowWindow(hwnd, 3)
user32.SetForegroundWindow(hwnd)
user32.BringWindowToTop(hwnd)
user32.AttachThreadInput(fore_thread, app_thread, False)

time.sleep(0.3)

# Logical coordinates: (862, 400)
# Move cursor there
user32.SetCursorPos(862, 400)
time.sleep(0.2)

# Click
user32.mouse_event(0x0002, 0, 0, 0, 0)
time.sleep(0.1)
user32.mouse_event(0x0004, 0, 0, 0, 0)
print("Clicked logical (862, 400)!")

time.sleep(5.0)

# Check windows again
windows = []
def enum_cb(h, lparam):
    if user32.IsWindowVisible(h):
        length = user32.GetWindowTextLengthW(h)
        if length > 0:
            buff = ctypes.create_unicode_buffer(length + 1)
            user32.GetWindowTextW(h, buff, length + 1)
            windows.append({'hwnd': h, 'title': buff.value})
    return True

WNDENUMPROC = ctypes.WINFUNCTYPE(ctypes.c_bool, ctypes.c_int, ctypes.c_int)
user32.EnumWindows(WNDENUMPROC(enum_cb), 0)

for w in windows:
    if any(k in w['title'].lower() for k in ['hostinger', 'file', 'search', 'printsign']):
        print(w)

user32.SetProcessDPIAware()
im = ImageGrab.grab(bbox=(0, 0, 1920, 1080))
im.save(r'C:\Users\Paradise Computers\.gemini\antigravity\brain\427ef294-7b43-49cf-b6fa-17e2d0e4b50b\after_scaled_click.png')
print("Saved after_scaled_click.png")
