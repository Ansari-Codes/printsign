import ctypes
from ctypes import wintypes

user32 = ctypes.windll.user32
user32.SetProcessDPIAware()
hdesk = user32.OpenDesktopW('Default', 0, False, 0x01FF)
if hdesk:
    user32.SetThreadDesktop(hdesk)

WNDENUMPROC = ctypes.WINFUNCTYPE(ctypes.c_bool, wintypes.HWND, wintypes.LPARAM)

titles = []
def callback(hwnd, lparam):
    length = user32.GetWindowTextLengthW(hwnd)
    if length > 0:
        buff = ctypes.create_unicode_buffer(length + 1)
        user32.GetWindowTextW(hwnd, buff, length + 1)
        title = buff.value
        if user32.IsWindowVisible(hwnd):
            titles.append((hwnd, title))
    return True

cb = WNDENUMPROC(callback)
user32.EnumWindows(cb, 0)
for hwnd, title in titles:
    print(f"HWND {hwnd}: {title}")
