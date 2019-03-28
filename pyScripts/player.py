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


# Execute one mouse event
def execute_mouse_event(event):
    pass


# Execute one mouse event
def execute_keyboard_event(event):
    pyautogui.typewrite(event['key'])


if __name__ == '__main__':
    # Execute events
    execute_bot('..\\tmpBots\\sample.json')
