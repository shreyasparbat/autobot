# Library imports
import pyautogui
import json

# Initialise global list of events
event_sequence = []


# Execute events
def execute_bot(bot_file):
    # Load bot
    with open(bot_file, 'r') as bot:
        event_sequence = json.load(bot)

    # Execute each event
    for event in event_sequence:
        # For mouse events
        if event['type'] == 'mouse':
            execute_mouse_event(event)

        # For keyboard events
        if event['type'] == 'keyboard':
            execute_keyboard_event(event)

        # Introduce delay
        pyautogui.PAUSE = 0.25


# Execute one mouse event
def execute_mouse_event(event):
    # If down direction
    if event['direction'] == 'down':
        pyautogui.mouseDown(button=event['button'], x=event['position'][0], y=event['position'][1])
    # If up direction
    if event['direction'] == 'up':
        pyautogui.mouseUp(button=event['button'], x=event['position'][0], y=event['position'][1])


# Execute one mouse event
def execute_keyboard_event(event):
    # If ctrl/shift
    if event['key'] == 'shiftleft' or event['key'] == 'ctrlleft':
        # Press special key
        pyautogui.keyDown(event['key'])

        # Loop through nextKeys
        for next_key in event['nextKeys']:
            pyautogui.press(next_key)

    # For any other key, just press
    pyautogui.press(event['key'])


if __name__ == '__main__':
    # Execute events
    execute_bot('..\\tmpBots\\sample.json')
