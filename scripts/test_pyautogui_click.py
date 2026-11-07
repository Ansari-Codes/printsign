import ctypes
import time
import pyautogui

pyautogui.FAILSAFE = False

user32 = ctypes.windll.user32
user32.SetProcessDPIAware()

hdesk = user32.OpenDesktopW('Default', 0, False, 0x01FF)
if hdesk:
    user32.SetThreadDesktop(hdesk)

hwnd = 17696106
user32.ShowWindow(hwnd, 3)
user32.SetForegroundWindow(hwnd)
time.sleep(0.5)

pyautogui.click(750, 538)
time.sleep(2.0)

from PIL import ImageGrab
im = ImageGrab.grab(bbox=(0, 0, 1920, 1080))
im.save(r'C:\Users\Paradise Computers\.gemini\antigravity\brain\427ef294-7b43-49cf-b6fa-17e2d0e4b50b\pyautogui_click_result.png')
print("Clicked with pyautogui (failsafe False) and captured")
