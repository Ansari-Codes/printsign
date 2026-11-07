import ctypes
import ctypes.wintypes

user32 = ctypes.windll.user32
hdesk = user32.OpenDesktopW('Default', 0, False, 0x01FF)
if hdesk:
    user32.SetThreadDesktop(hdesk)

windows = []

WNDENUMPROC = ctypes.WINFUNCTYPE(ctypes.c_bool, ctypes.wintypes.HWND, ctypes.wintypes.LPARAM)

def enum_proc(hwnd, lparam):
    if user32.IsWindowVisible(hwnd):
        length = user32.GetWindowTextLengthW(hwnd)
        if length > 0:
            buff = ctypes.create_unicode_buffer(length + 1)
            user32.GetWindowTextW(hwnd, buff, length + 1)
            title = buff.value
            if 'Chrome' in title or 'Google' in title or 'Hostinger' in title or 'Search' in title or 'Bing' in title or 'Webmaster' in title:
                windows.append((hwnd, title))
    return True

user32.EnumWindows(WNDENUMPROC(enum_proc), 0)

for h, t in windows:
    print(f"HWND {h}: {t}")
