# Library imports
import pyHook
from pyHook.HookManager import HookConstants
import pythoncom
import json

# Custom imports
from utils import handle_special_keys

# Initialise global list of events
event_sequence = []


def log_events():
    # Create a hook manager
    hm = pyHook.HookManager()

    # Watch for all mouse and keyboard events
    hm.MouseAll = on_mouse_event
    hm.KeyDown = on_keyboard_event

    # Set the hooks
    hm.HookMouse()
    hm.HookKeyboard()

    # Wait forever (using windows message loop)
    pythoncom.PumpMessages()


# Called when mouse events are received
def on_mouse_event(event):
    # Check for all events except 'mouse move'
    if event.MessageName != 'mouse move':
        # Check button
        if 'right' in event.MessageName:
            button = 'right'
        if 'left' in event.MessageName:
            button = 'left'

        # Check direction
        if 'down' in event.MessageName:
            direction = 'down'
        if 'up' in event.MessageName:
            direction = 'up'

        # Append event to sequence
        event_sequence.append({
            'type': 'mouse',
            'button': button,
            'direction': direction,
            'time': event.Time,
            'window': event.Window,
            'windowName': event.WindowName,
            'position': event.Position
        })
        # # Temporarily save 'mouse left down' event
        # if event.MessageName == 'mouse left down':
        #     event_sequence.append({
        #         'type': 'mouse',
        #         'messageName': event.MessageName,
        #         'time': event.Time,
        #         'window': event.Window,
        #         'windowName': event.WindowName,
        #         'position': event.Position
        #     })
        #
        # # Check for 'drag' action and save appropriately
        # if event.MessageName == 'mouse left up':
        #     # If press down was not in the same area
        #     if event_sequence and event_sequence[-1]['type'] == 'mouse' and \
        #             (event_sequence[-1]['position'][0] not in \
        #             range(event.Position[0] - 10, event.Position[0] + 11) or \
        #             event_sequence[-1]['position'][1] not in \
        #             range(event.Position[1] - 10, event.Position[1] + 11)):
        #         # Save 'drag' action
        #         event_sequence.append({
        #             'type': 'mouse',
        #             'messageName': 'drag',
        #             'time': event.Time,
        #             'window': event.Window,
        #             'windowName': event.WindowName,
        #             'fromPosition': event_sequence[-1]['position'],
        #             'toPosition': event.Position
        #         })
        #
        #         # Delete previous 'mouse left down' event
        #         del event_sequence[-2]
        #     else:
        #         # Rename previous save
        #         event_sequence[-1]['messageName'] = 'left click'
        #
        # # Else if right button clicked
        # if event.MessageName == 'mouse right down':
        #     # Save as right click
        #     event_sequence.append({
        #         'type': 'mouse',
        #         'messageName': 'right click',
        #         'time': event.Time,
        #         'window': event.Window,
        #         'windowName': event.WindowName,
        #         'position': event.Position
        #     })

    # return True to pass the event to other handlers
    return True


# Called when keyboard events are received
def on_keyboard_event(event):
    # Clean up when escape is pressed
    if event.Key == 'Escape':

        # TODO: shift saving logic to electron
        # Ask for bot name
        botName = input('Save as: ')
        
        # Create JSON file and write event_sequence to it
        with open('..\\tmpBots\\' + botName + '.json', 'w') as writeFile:
            json.dump(event_sequence, writeFile, indent=4)
        # TODO: shift saving logic to electron

        # Exit script
        exit(0)

    # If ctrl pressed
    if pyHook.GetKeyState(HookConstants.VKeyToID('VK_CONTROL')):
        # If prev was ctrl as well
        if event_sequence and event_sequence[-1]['type'] == 'keyboard' and \
                event_sequence[-1]['key'] == 'ctrlleft':
            # If not this key is ctrl
            if not (event.Key == 'Lcontrol' or event.Key == 'Rcontrol'):
                # Append to prev entry's nextKeys list
                event_sequence[-1]['nextKeys'].append(event.Key.lower())
        else:
            # Store this event with key as ctrl and nextKey as this key
            event_sequence.append({
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
        if event_sequence and event_sequence[-1]['type'] == 'keyboard' and \
                event_sequence[-1]['key'] == 'shiftleft':
            # If not this key is shift
            if not (event.Key == 'Lshift' or event.Key == 'Rshift'):
                # Append to prev entry's nextKeys list
                event_sequence[-1]['nextKeys'].append(event.Key.lower())
        else:
            # Store this event with key as shift and nextKey as this key
            event_sequence.append({
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
        event_sequence.append(handle_special_keys(event))

    # Return True to pass the event to other handlers
    return True


# Run if in main
if __name__ == '__main__':
    # Start logging events
    log_events()
