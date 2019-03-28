# Library imports
import pyHook
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
        # Temporarily save 'mouse left down' event
        if event.MessageName == 'mouse left down':
            eventSequence.append({
                'type': 'mouse',
                'messageName': event.MessageName,
                'time': event.Time,
                'window': event.Window,
                'windowName': event.WindowName,
                'position': event.Position
            })
        
        # Check for 'drag' action and save appropriately
        if event.MessageName == 'mouse left up':
            # If press down was not in the same area
            if eventSequence and eventSequence[-1]['type'] == 'mouse' and \
                    (eventSequence[-1]['position'][0] not in \
                    range(event.Position[0] - 10, event.Position[0] + 11) or \
                    eventSequence[-1]['position'][1] not in \
                    range(event.Position[1] - 10, event.Position[1] + 11)):
                # Save 'drag' action
                eventSequence.append({
                    'type': 'mouse',
                    'messageName': 'drag',
                    'time': event.Time,
                    'window': event.Window,
                    'windowName': event.WindowName,
                    'fromPosition': eventSequence[-1]['position'],
                    'toPosition': event.Position
                })

                # Delete previous 'mouse left down' event
                del eventSequence[-2]
            else:
                # Rename previous save
                eventSequence[-1]['messageName'] = 'left click'
        
        # Else if right button clicked
        if event.MessageName == 'mouse right down':
            # Save as right click
            eventSequence.append({
                'type': 'mouse',
                'messageName': 'right click',
                'time': event.Time,
                'window': event.Window,
                'windowName': event.WindowName,
                'position': event.Position
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
            # If not this key is ctrl
            if not (event.Key == 'Lcontrol' or event.Key == 'Rcontrol'):
                # Append to prev entry's nextKeys list
                eventSequence[-1]['nextKeys'].append(event.Key.lower())
        else:
            # Store this event with key as ctrl and nextKey as this key
            eventSequence.append({
                'type': 'keyboard',
                'messageName': event.MessageName,
                'time': event.Time,
                'window': event.Window,
                'windowName': event.WindowName,
                'ascii': event.Ascii,
                'key': 'ctrlleft',
                'nextKeys': []
            })
    # Elif shift pressed
    elif pyHook.GetKeyState(HookConstants.VKeyToID('VK_SHIFT')):
        # If prev was shift as well
        if eventSequence and eventSequence[-1]['type'] == 'keyboard' and \
                eventSequence[-1]['key'] == 'shiftleft':
            # If not this key is shift
            if (not (event.Key == 'Lshift' or event.Key == 'Rshift')):
                # Append to prev entry's nextKeys list
                eventSequence[-1]['nextKeys'].append(event.Key.lower())
        else:
            # Store this event with key as shift and nextKey as this key
            eventSequence.append({
                'type': 'keyboard',
                'messageName': event.MessageName,
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

    # Return True to pass the event to other handlers
    return True


# Run if in main
if __name__ == '__main__':
    # Start logging events
    try:
        logEvents()
    except:
        exit(1)
l