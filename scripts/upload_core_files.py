import ctypes
import time
import pyautogui
import subprocess
from PIL import ImageGrab

user32 = ctypes.windll.user32
user32.SetProcessDPIAware()

hdesk = user32.OpenDesktopW('Default', 0, False, 0x01FF)
if hdesk:
    user32.SetThreadDesktop(hdesk)

hwnd = 12257118
fore_thread = user32.GetWindowThreadProcessId(user32.GetForegroundWindow(), None)
app_thread = ctypes.windll.kernel32.GetCurrentThreadId()
user32.AttachThreadInput(fore_thread, app_thread, True)
user32.ShowWindow(hwnd, 9)
user32.ShowWindow(hwnd, 3)
user32.SetForegroundWindow(hwnd)
user32.BringWindowToTop(hwnd)
user32.AttachThreadInput(fore_thread, app_thread, False)

time.sleep(0.3)
# Click Tab 2 (public_html) at (250, 20)
pyautogui.click(250, 20)
time.sleep(0.5)

# Click Upload button at (1735, 138)
pyautogui.click(1735, 138)
time.sleep(0.8)

# Click 'File' at (825, 590)
pyautogui.click(825, 590)
time.sleep(1.2)

# Copy file paths to clipboard and paste
file1 = r"c:\Users\Paradise Computers\Desktop\pdf software\dist\sitemap.xml"
file2 = r"c:\Users\Paradise Computers\Desktop\pdf software\dist\robots.txt"
file3 = r"c:\Users\Paradise Computers\Desktop\pdf software\dist\index.html"
file4 = r"c:\Users\Paradise Computers\Desktop\pdf software\dist\googled1b397fe607a11b5.html"

files_str = f'"{file1}" "{file2}" "{file3}" "{file4}"'

p = subprocess.Popen('clip', stdin=subprocess.PIPE, shell=True)
p.communicate(files_str.encode('utf-16le'))

time.sleep(0.3)
pyautogui.hotkey('ctrl', 'v')
time.sleep(0.4)
pyautogui.press('enter')
print('Pasted and pressed enter')

time.sleep(1.5)

# In case 'Replace or skip files' modal appears, click Replace (470, 490)
pyautogui.click(470, 490)
time.sleep(2.5)

im = ImageGrab.grab(bbox=(0, 0, 1920, 1080))
im.save(r'C:\Users\Paradise Computers\.gemini\antigravity\brain\427ef294-7b43-49cf-b6fa-17e2d0e4b50b\after_multi_upload.png')
print('Captured after_multi_upload.png')
