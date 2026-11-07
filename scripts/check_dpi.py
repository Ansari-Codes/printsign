import ctypes

user32 = ctypes.windll.user32
shcore = ctypes.windll.shcore

user32.SetProcessDPIAware()
w = user32.GetSystemMetrics(0)
h = user32.GetSystemMetrics(1)
print(f"Metrics: {w}x{h}")

hdc = user32.GetDC(0)
dpi_x = ctypes.windll.gdi32.GetDeviceCaps(hdc, 88)
dpi_y = ctypes.windll.gdi32.GetDeviceCaps(hdc, 90)
user32.ReleaseDC(0, hdc)
print(f"DPI: {dpi_x}x{dpi_y} (scale = {dpi_x / 96.0})")
