def cleanMouseInput(event):
    pass


def cleanKeyboardInput(event):
    # Make all characters lowercase (handles mose cases)
    key = event['key'].lower()

    # Define pyhook-pyautogui dict
    conversionDict = {
        'lshift': 'shiftleft',
        'rshift': 'shiftright',
        'lcontrol': 'ctrlleft',
        'rcontrol': 'ctrlright',
        'lmenu': 'altleft',
        'rmenu': 'altright',
        'back': 'backspace',
        'prior': 'pageup',
        'next', 'pagedown',
        'volume_up': 'volumeup',
        'volume_down': 'volumedown',
        'volume_mute': 'volumemute',
        'capital': 'capslock',
        'lwin': 'winleft'
    }
