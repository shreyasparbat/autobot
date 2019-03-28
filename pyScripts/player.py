# Library imports
import pyautogui
import json

# Initialise global list of events
eventSequence = []


def executeBot(botFile):
    # Load bot
    with open(botFile, 'r') as bot:
        eventSequence = json.load(bot)

    # Remove last 'escape key' event
    del eventSequence[-1]

    # Execute each event
    for event in enumerate(eventSequence, i):
        # For mouse events (next event also sent
        # to identify drag and drop events)
        if event['type'] == 'mouse':
            executeMouseEvent(event, eventSequence[i + 1])

        # For keyboard events
        if event['type'] == 'keyboard':
            executeKeyboardEvent(event)


def executeMouseEvent(event, nextEvent):
    


def executeKeyboardEvent(event):
    pass


if __name__ == '__main__':
    # Execute events
    executeBot('..\\tmpBots\\sample.json')
