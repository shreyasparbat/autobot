# Convert special key inputs from pyhook to pyautogui nomenclature
def handleSpecialKeys(event):
    # If not a capital letter
    if int(event.Ascii) < 65 or int(event.Ascii) > 90:
        # Make all characters lowercase (handles mose cases)
        key = event.Key.lower()
    else:
        key = event.Key

    # Define pyhook-pyautogui dict
    conversionDict = {
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
    if key in conversionDict:
        key = conversionDict[key]

    # Final event to return
    finalEvent = {
        'type': 'keyboard',
        'messageName': event.MessageName,
        'message': event.Message,
        'time': event.Time,
        'window': event.Window,
        'windowName': event.WindowName,
        'ascii': event.Ascii,
        'key': key
    }
    
    # If key is ctrl/shift, include nextKeys attribute
    if key == 'shiftleft' or key == 'ctrlleft':
        finalEvent['nextKeys'] = []

    return finalEvent
