import ctypes

class RECT(ctypes.Structure):
    _fields_ = [("left", ctypes.c_long),
                ("top", ctypes.c_long),
                ("right", ctypes.c_long),
                ("bottom", ctypes.c_long)]

user32 = ctypes.windll.user32
hdesk = user32.OpenDesktopW('Default', 0, False, 0x01FF)
if hdesk:
    user32.SetThreadDesktop(hdesk)

rect = RECT()
user32.GetWindowRect(12257118, ctypes.byref(rect))
print("Window rect:", rect.left, rect.top, rect.right, rect.bottom)
