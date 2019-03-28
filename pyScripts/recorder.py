# Library imports
import pyHook
from pyHook import HookManager
from pyHook.HookManager import HookConstants
import pythoncom
import json

# Custom imports
from utils import handleSpecialKeys

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
        # Create dictionary of event specific info and append
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



# Called when keyboard events are received
def OnKeyboardEvent(event):
    # Clean up when escape is pressed
    if event.Key == 'Escape':
        ################# TODO: shift saving logic to electron
        # Ask for bot name
        botName = input('Save as: ')
        
        # Create JSON file and write eventSequence to it
        with open('..\\tmpBots\\' + botName + '.json', 'w') as writeFile:
            json.dump(eventSequence, writeFile, indent=4)
        ##################
        # Exit script
        exit(0)

    # If ctrl pressed
    if pyHook.GetKeyState(HookConstants.VKeyToID('VK_CONTROL')):
        # If prev was ctrl as well
        if eventSequence and eventSequence[-1]['type'] == 'keyboard' and \
                eventSequence[-1]['key'] == 'ctrlleft':
            # Append to prev entry's nextKeys list
            eventSequence[-1]['nextKeys'].append(event['Key'])
        else:
            # Store this event with key as ctrl and nextKey as this key
            eventSequence.append({
                'type': 'keyboard',
                'messageName': event.MessageName,
                'message': event.Message,
                'time': event.Time,
                'window': event.Window,
                'windowName': event.WindowName,
                'ascii': event.Ascii,
                'key': 'ctrlleft',
                'nextKeys': []
            })
    # Elif shift pressed and this key is not a capital letter
    elif pyHook.GetKeyState(HookConstants.VKeyToID('VK_SHIFT')) and \
            (int(event.Ascii) < 65 or int(event.Ascii) > 90):
        # If prev was shift as well
        if eventSequence and eventSequence[-1]['type'] == 'keyboard' and \
                eventSequence[-1]['key'] == 'shiftleft':
            # Append to prev entry's nextKeys list
            eventSequence[-1]['nextKeys'].append(event['Key'])
        else:
            # Store this event with key as shift and nextKey as this key
            eventSequence.append({
                'type': 'keyboard',
                'messageName': event.MessageName,
                'message': event.Message,
                'time': event.Time,
                'window': event.Window,
                'windowName': event.WindowName,
                'ascii': event.Ascii,
                'key': 'shiftleft',
                'nextKeys': []
            })
    # For non ctrl/shift long-press situations
    else:
        # Handle special keys
        eventSequence.append(handleSpecialKeys(event))

    # # Check if previous event was shift or ctrl
    # holdKeyList = ['shiftleft', 'shiftright', 'ctrlleft', 'ctrlright']
    # if eventSequence and eventSequence[-1]['type'] == 'keyboard' and \
    #         eventSequence[-1]['key'] in holdKeyList:
    #     # Add this event to previous event's dict entry
    #     eventSequence[-1]['nextKey'] = event.Key
    # else:
    #     # Append cleaned event to event sequence
    #     eventSequence.append(handleSpecialKeys(event))

    # Return True to pass the event to other handlers
    return True


# Run if in main
if __name__ == '__main__':
    # Start logging events
    try:
        logEvents()
    except:
        exit(1)
