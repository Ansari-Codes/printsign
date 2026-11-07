import ctypes

class POINT(ctypes.Structure):
    _fields_ = [("x", ctypes.c_long), ("y", ctypes.c_long)]

user32 = ctypes.windll.user32
hdesk = user32.OpenDesktopW('Default', 0, False, 0x01FF)
if hdesk:
    user32.SetThreadDesktop(hdesk)

# Test without DPI awareness
user32.SetCursorPos(862, 400)
pt = POINT()
user32.GetCursorPos(ctypes.byref(pt))
print("Without DPI awareness: Set(862, 400) -> Get:", pt.x, pt.y)

# Test with DPI awareness
user32.SetProcessDPIAware()
user32.SetCursorPos(1077, 500)
pt2 = POINT()
user32.GetCursorPos(ctypes.byref(pt2))
print("With DPI awareness: Set(1077, 500) -> Get:", pt2.x, pt2.y)
