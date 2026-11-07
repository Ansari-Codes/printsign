import ctypes
import time
import subprocess
from PIL import ImageGrab

user32 = ctypes.windll.user32
user32.SetProcessDPIAware()
hdesk = user32.OpenDesktopW('Default', 0, False, 0x01FF)
if hdesk:
    user32.SetThreadDesktop(hdesk)

hwnd = 17696106
user32.keybd_event(0x12, 0, 0, 0)
user32.keybd_event(0x12, 0, 2, 0)
user32.ShowWindow(hwnd, 3)
user32.BringWindowToTop(hwnd)
user32.SetForegroundWindow(hwnd)
time.sleep(0.3)

# Click "Write your answer" at x=240, y=864
user32.SetCursorPos(240, 864)
time.sleep(0.1)
user32.mouse_event(0x0002, 0, 0, 0, 0)
time.sleep(0.1)
user32.mouse_event(0x0004, 0, 0, 0, 0)
time.sleep(0.3)

# Type 'printsign.org' via clipboard paste
subprocess.run(['powershell', '-Command', 'Set-Clipboard -Value "printsign.org"'])

user32.keybd_event(0x11, 0, 0, 0) # Ctrl
user32.keybd_event(0x56, 0, 0, 0) # V
user32.keybd_event(0x56, 0, 2, 0)
user32.keybd_event(0x11, 0, 2, 0)
time.sleep(0.5)

# Press Enter
user32.keybd_event(0x0D, 0, 0, 0)
user32.keybd_event(0x0D, 0, 2, 0)
time.sleep(4.0)

im = ImageGrab.grab(bbox=(0, 0, 1920, 1080))
im.save(r'C:\Users\Paradise Computers\.gemini\antigravity\brain\427ef294-7b43-49cf-b6fa-17e2d0e4b50b\chat_answered.png')
print('Sent printsign.org to chat!')
