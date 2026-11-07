import time
import ctypes
import win32gui
import win32con
import win32clipboard
import comtypes
import comtypes.client

user32 = ctypes.windll.user32

def ensure_desktop():
    hdesk = user32.OpenInputDesktop(0, False, 0x01FF)
    if not hdesk:
        hdesk = user32.OpenDesktopW('Default', 0, False, 0x01FF)
    if hdesk:
        user32.SetThreadDesktop(hdesk)
    return hdesk

def run_js_and_get_clipboard(hwnd, js_code, wait_sec=1.5):
    ensure_desktop()
    user32.ShowWindow(hwnd, 3)
    user32.SetForegroundWindow(hwnd)
    time.sleep(0.3)

    UIA = comtypes.client.GetModule('UIAutomationCore.dll')
    uia = comtypes.client.CreateObject(UIA.CUIAutomation, interface=UIA.IUIAutomation)
    el = uia.ElementFromHandle(hwnd)

    cond_edit = uia.CreatePropertyCondition(UIA.UIA_ControlTypePropertyId, UIA.UIA_EditControlTypeId)
    edits = el.FindAll(UIA.TreeScope_Descendants, cond_edit)

    console_prompt = None
    for i in range(edits.Length):
        e = edits.GetElement(i)
        if e.CurrentName == 'Console prompt':
            console_prompt = e
            break

    if not console_prompt:
        raise RuntimeError("Console prompt not found!")

    r = console_prompt.CurrentBoundingRectangle
    click_x = (r.left + r.right) // 4
    click_y = (r.top + r.bottom) // 2

    # Click directly in Console prompt
    user32.SetCursorPos(click_x, click_y)
    user32.mouse_event(win32con.MOUSEEVENTF_LEFTDOWN, 0, 0, 0, 0)
    user32.mouse_event(win32con.MOUSEEVENTF_LEFTUP, 0, 0, 0, 0)
    time.sleep(0.2)

    # Wrap JS code to copy result to clipboard
    wrapped_code = f"copy(JSON.stringify((function() {{ try {{ {js_code} }} catch(e) {{ return {{ error: e.message }}; }} }})()))"

    win32clipboard.OpenClipboard()
    win32clipboard.EmptyClipboard()
    win32clipboard.SetClipboardText(wrapped_code, win32clipboard.CF_UNICODETEXT)
    win32clipboard.CloseClipboard()
    time.sleep(0.1)

    # Paste
    user32.keybd_event(win32con.VK_CONTROL, 0, 0, 0)
    user32.keybd_event(ord('V'), 0, 0, 0)
    time.sleep(0.05)
    user32.keybd_event(ord('V'), 0, win32con.KEYEVENTF_KEYUP, 0)
    user32.keybd_event(win32con.VK_CONTROL, 0, win32con.KEYEVENTF_KEYUP, 0)
    time.sleep(0.1)

    # Press Enter
    user32.keybd_event(win32con.VK_RETURN, 0, 0, 0)
    time.sleep(0.05)
    user32.keybd_event(win32con.VK_RETURN, 0, win32con.KEYEVENTF_KEYUP, 0)
    time.sleep(wait_sec)

    # Read clipboard
    win32clipboard.OpenClipboard()
    try:
        data = win32clipboard.GetClipboardData(win32clipboard.CF_UNICODETEXT)
    except:
        data = None
    win32clipboard.CloseClipboard()
    return data

if __name__ == '__main__':
    hwnd = 17696106
    res = run_js_and_get_clipboard(hwnd, "return { url: window.location.href, keys: Object.keys(localStorage) };")
    print("Result:", res)
