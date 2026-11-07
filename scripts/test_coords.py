import ctypes
from ctypes import wintypes

user32 = ctypes.windll.user32
user32.SetProcessDPIAware()

pt = wintypes.POINT()
user32.SetCursorPos(720, 618)
user32.GetCursorPos(ctypes.byref(pt))
print(f"Set (720, 618) -> Result: ({pt.x}, {pt.y})")
