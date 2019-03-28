# Library imports
import pyautogui
import json

# Initialise global list of events
eventSequence = []


# Execute events
def executeBot(botFile):
    # Load bot
    with open(botFile, 'r') as bot:
        eventSequence = json.load(bot)

    # Execute each event
    for event in enumerate(eventSequence, i):
        # For mouse events
        if event['type'] == 'mouse':
            executeMouseEvent(event, eventSequence[i + 1])

        # For keyboard events
        if event['type'] == 'keyboard':
            executeKeyboardEvent(event, eventSequence[i + 1])


# Execute one mouse event
def executeMouseEvent(event, nextEvent):
    pass


# Execute one mouse event
def executeKeyboardEvent(event, nextEvent):
    pyautogui.typewrite(event['key'])


if __name__ == '__main__':
    # Execute events
    executeBot('..\\tmpBots\\sample.json')
