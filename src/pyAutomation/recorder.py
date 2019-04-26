# Library imports
import pyHook
from pyHook.HookManager import HookConstants
import pythoncom
import json
import sys
import os


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

    # return True to pass the event to other handlers
    return True


# Called when keyboard events are received
def on_keyboard_event(event):
    # Clean up when escape is pressed
    if event.Key == 'Escape':
        # Load existing bot from given file
        with open(bot_file_path) as bot_file:
            bot = json.load(bot_file)

            # Merge newly created event_sequence with existing one
            bot['events'] += event_sequence

        # Open bot_file in write mode
        with open(bot_file_path, 'w') as bot_file:
            # Replace current bot in bot_file with new bot
            json.dump(bot, bot_file, indent=2)

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


# Convert special key inputs from pyhook to pyautogui nomenclature
def handle_special_keys(event):
    # If not a capital letter
    if int(event.Ascii) < 65 or int(event.Ascii) > 90:
        # Make all characters lowercase (handles mose cases)
        key = event.Key.lower()
    else:
        key = event.Key

    # Define pyhook-pyautogui dict
    conversion_dict = {
        'lshift': 'shiftleft',
        'rshift': 'shiftleft',
        'lcontrol': 'ctrlleft',
        'rcontrol': 'ctrlleft',
        'lmenu': 'altleft',
        'rmenu': 'altleft',
        'back': 'backspace',
        'prior': 'pageup',
        'next': 'pagedown',
        'volume_up': 'volumeup',
        'volume_down': 'volumedown',
        'volume_mute': 'volumemute',
        'capital': 'capslock',
        'lwin': 'winleft',
        'rwin': 'winleft'
    }

    # Replace special keys with pyautogui equivalent
    if key in conversion_dict:
        key = conversion_dict[key]

    # Final event to return
    final_event = {
        'type': 'keyboard',
        'messageName': event.MessageName,
        'time': event.Time,
        'window': event.Window,
        'windowName': event.WindowName,
        'ascii': event.Ascii,
        'key': key
    }

    # If key is ctrl/shift, include nextKeys attribute
    if key == 'shiftleft' or key == 'ctrlleft':
        final_event['nextKeys'] = []

    return final_event


# Get bot_file_path from electron
bot_name = sys.argv[1]
bot_file_path = os.path.join(os.getcwd(), bot_name + '.json')

# Initialise global list of events
event_sequence = []

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
