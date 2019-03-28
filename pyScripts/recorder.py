# Library imports
import pyHook
import pythoncom
import json

# Initialise global list of events
eventSequence = []


def logEvents():
    # Create a hook manager
    hm = pyHook.HookManager()

    # Watch for all mouse and keyboard events
    hm.MouseAll = OnMouseEvent
    hm.KeyDown = OnKeyboardEvent

    # Set the hooks
    hm.HookMouse()
    hm.HookKeyboard()

    # Wait forever (using windows message loop)
    try:
        pythoncom.PumpMessages()
    except:
        exit(1)


# Called when mouse events are received
def OnMouseEvent(event):
    # Check for all events except 'mouse move'
    if event.MessageName != 'mouse move':
        # Create dictionary of event specific info and add
        # to event sequence
        eventSequence.append({
            'type': 'mouse',
            'messageName': event.MessageName,
            'message': event.Message,
            'time': event.Time,
            'window': event.Window,
            'windowName': event.WindowName,
            'position': event.Position,
            'wheel': event.Wheel,
            'injected': event.Injected
        })

    # return True to pass the event to other handlers
    return True



def OnKeyboardEvent(event):
    # Clean up when escape is pressed
    if event.Key == 'Escape':
        ############# TODO: shift saving logic to electron
        # Ask for bot name
        botName = input('Save as: ')
        
        # Create JSON file and write eventSequence to it
        with open('..\\tmpBots\\' + botName + '.json', 'w') as writeFile:
            json.dump(eventSequence, writeFile, indent=4)
        ##################
        # Exit script
        exit(0)

    # Create dictionary of event specific info and add to event sequence
    eventSequence.append({
        'type': 'keyboard',
        'messageName': event.MessageName,
        'message': event.Message,
        'time': event.Time,
        'window': event.Window,
        'windowName': event.WindowName,
        'ascii': event.Ascii,
        'key': event.Key,
        'keyID': event.KeyID,
        'scanCode': event.ScanCode,
        'extended': event.Extended,
        'injected': event.Injected,
        'alt': event.Alt,
        'transition': event.Transition
    })

    # Return True to pass the event to other handlers
    return True


# Run if in main
if __name__ == '__main__':
    # Start logging events
    try:
        logEvents()
    except:
        exit(1)
