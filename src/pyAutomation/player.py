# Library imports
import pyautogui
import time
import json
import sys
import os


# Execute one mouse event
def execute_mouse_event(event):
    # If down direction
    if event['direction'] == 'down':
        # Pause python
        time.sleep(2)
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


# Get bot_file_path from electron
bot_name = sys.argv[1]
bot_file_path = os.path.join(os.getcwd(), bot_name + '.json')

# Load bot (passed in as argument by electron)
with open(bot_file_path) as bot_file:
    bot = json.load(bot_file)

    # Execute bot
    for event in bot['events']:
        # For mouse events
        if event['type'] == 'mouse':
            execute_mouse_event(event)

        # For keyboard events
        if event['type'] == 'keyboard':
            execute_keyboard_event(event)

# Exit program
exit(0)
