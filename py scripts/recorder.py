# Library imports
import pyHook
import pythoncom

# Called when mouse events are received
def OnMouseEvent(event):
    # Print event specific info
    print('MessageName:', event.MessageName)
    print('Message:', event.Message)
    print('Time:', event.Time)
    print('Window:', event.Window)
    print('WindowName:', event.WindowName)
    print('Position:', event.Position)
    print('Wheel:', event.Wheel)
    print('Injected:', event.Injected)
    print('---')

    # return True to pass the event to other handlers
    return True

def OnKeyboardEvent(event):
    print('MessageName:', event.MessageName)
    print('Message:', event.Message)
    print('Time:', event.Time)
    print('Window:', event.Window)
    print('WindowName:', event.WindowName)
    print('Ascii:', event.Ascii, chr(event.Ascii))
    print('Key:', event.Key)
    print('KeyID:', event.KeyID)
    print('ScanCode:', event.ScanCode)
    print('Extended:', event.Extended)
    print('Injected:', event.Injected)
    print('Alt', event.Alt)
    print('Transition', event.Transition)
    print('---')

    # Return True to pass the event to other handlers
    return True

# Create a hook manager
hm = pyHook.HookManager()

# Watch for all mouse events
# hm.MouseAll = OnMouseEvent

# Watch for all keybord events
hm.keyDown = OnKeyboardEvent

# Set the hooks
hm.HookMouse()
hm.HookKeyboard()

# Wait forever (using windows message loop)
pythoncom.PumpMessages()