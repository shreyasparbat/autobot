# Library imports
import pyHook
from pyHook.HookManager import HookConstants
import pythoncom
import json
import sys
import os
import time

# Called when mouse events are received
def on_mouse_event(event):
    global lastTime
    # Check for all events except 'mouse move'
    if event.MessageName != 'mouse move':
        # Check button
        if(('left' in event.MessageName) & ('down' in event.MessageName)):
            timeNow = time.time()
            timer = timeNow-lastTime
            if timer < 0.5: # Half a second
                position =  event.Position
                # Open bot_file in write mode
                with open(bot_file_path) as bot_file:
                    bot = json.load(bot_file)
                    events = bot["events"]
                    child_events = bot["childEvents"]
                    if parent_event != None:
                        for event in events:
                            try:
                                if event["id"] == parent_event:
                                    target_events = event[child_event_field]
                                    break
                            except KeyError:
                                pass
                        for child_event in child_events:
                            try:
                                if child_event["id"] == parent_event:
                                    target_events = child_event[child_event_field]
                                    break
                            except KeyError:
                                pass
                    else:
                        target_events = events

                    down_click = target_events[down_click_index]
                    up_click = target_events[up_click_index]
                    down_click["position"] = position
                    up_click["position"] = position
                    # Replace current bot in bot_file with new bot
                    with open(bot_file_path, 'w') as bot_file:
                        # Replace current bot in bot_file with new bot
                        json.dump(bot, bot_file, indent=2)
                    exit(0)
            else:
                lastTime = timeNow

    # return True to pass the event to other handlers
    return True

# Get bot_file_path from electron
bot_name = sys.argv[1]
down_click_index = int(sys.argv[2])
up_click_index = int(sys.argv[3])
try:
    parent_event = sys.argv[4]
    child_event_field = sys.argv[5]
except IndexError:
    parent_event = None
    child_event_field = None
lastTime = 0

bot_file_path = os.path.join(os.getcwd(), bot_name + '.json')

# Create a hook manager
hm = pyHook.HookManager()

# Watch for all mouse and keyboard events
hm.MouseAll = on_mouse_event

# Set the hooks
hm.HookMouse()

# Wait forever (using windows message loop)
pythoncom.PumpMessages()
