import ctypes
import json
import time
from PIL import ImageGrab

user32 = ctypes.windll.user32
kernel32 = ctypes.windll.kernel32
user32.SetProcessDPIAware()

hdesk = user32.OpenDesktopW('Default', 0, False, 0x01FF)
if hdesk:
    user32.SetThreadDesktop(hdesk)

windows = []

def enum_cb(hwnd, lparam):
    if user32.IsWindowVisible(hwnd):
        length = user32.GetWindowTextLengthW(hwnd)
        if length > 0:
            buff = ctypes.create_unicode_buffer(length + 1)
            user32.GetWindowTextW(hwnd, buff, length + 1)
            title = buff.value
            windows.append({'hwnd': hwnd, 'title': title})
    return True

WNDENUMPROC = ctypes.WINFUNCTYPE(ctypes.c_bool, ctypes.c_int, ctypes.c_int)
user32.EnumWindows(WNDENUMPROC(enum_cb), 0)

for w in windows:
    if any(k in w['title'].lower() for k in ['chrome', 'search console', 'hostinger', 'files', 'google', 'printsign', 'analytics']):
        print(w)

fore = user32.GetForegroundWindow()
print("Foreground window:", fore)
buff = ctypes.create_unicode_buffer(256)
user32.GetWindowTextW(fore, buff, 256)
print("Foreground title:", buff.value)

try:
    im = ImageGrab.grab(bbox=(0, 0, 1920, 1080))
    im.save(r'C:\Users\Paradise Computers\.gemini\antigravity\brain\427ef294-7b43-49cf-b6fa-17e2d0e4b50b\screen_now.png')
    print("Screen grabbed successfully!")
except Exception as e:
    print("Screen grab error:", e)
