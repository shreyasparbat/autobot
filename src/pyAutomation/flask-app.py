# Library imports
# import pyHook
# from pyHook.HookManager import HookConstants
# import pythoncom
import pyautogui
import time
import os
import json
from uuid import uuid4
from flask import Flask, request, jsonify
from flask_cors import CORS

# Initialise flask app
app = Flask(__name__)
CORS(app)

# Used to ensure that variables are converted into their appropriate types
def parse_type(value,varType):
    if varType == 'string':
        value = str(value)
    elif varType == 'number':
        value = float(value)
    elif varType == 'array':
        value = value.split(',')
    else:
        value = str(value)
    return value

@app.route('/')
def hello_world():
    return 'Hello World!'


@app.route('/record/<bot_name>')
def record(bot_name):
    # Spawn process to record
    os.system('python recorder.py ' + bot_name)
    # Exit route
    return 'success'

@app.route('/record-sub/<bot_name>',methods=["GET"])
def record_sub(bot_name):
    ifEventId  = request.args.get('id', None)
    ifEventsType = request.args.get('type',None)
    # Spawn process to record
    os.system('python if-recorder.py ' + bot_name + ' ' + ifEventId + ' ' +ifEventsType)
    # Exit route
    return 'success'

@app.route('/record-loop-events/<bot_name>',methods=["GET"])
def record_loop_events(bot_name):
    loop_event_id = request.args.get('id',None)
    # Spawn process to record loop events
    os.system('python loop-events-recorder.py ' + bot_name + ' ' + loop_event_id)
    # Exit route
    return 'success'


@app.route('/play/<bot_name>')
def play(bot_name):
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

    def execute_events(events,variables=[]):
        for event in events:
            if event['type'] == 'mouse':
                execute_mouse_event(event)

            # For keyboard events
            if event['type'] == 'keyboard':
                execute_keyboard_event(event)

            # For if events
            if event['type'] == 'if':
                execute_if_event(event,variables)

            # For loop events
            if event['type'] == 'loop':
                execute_loop_event(event)


    def execute_if_event(event,variables):
        varA = event["varA"]
        varB = event["varB"]
        varAFound = False
        varBFound = False
        for variable in variables:
            if variable["name"] == varA:
                varAVal = variable["value"]
                varAFound = True
                if varAFound & varBFound:
                    break
            elif variable["name"] == varB:
                varBVal = variable["value"]
                varBFound =True
                if varAFound & varBFound:
                    break
        operator = event["operator"]
        trueEvents = event["trueEvents"]
        falseEvents = event["falseEvents"]

        if eval('varAVal '+operator+' varBVal'):
            execute_events(trueEvents)
        else:
            execute_events(falseEvents)     

    def execute_loop_event(event):
        if_events = event['events']
        times = event['times']
        for i in range(int(times)):
            execute_events(if_events)

    # Get bot_file_path from electron
    bot_file_path = os.path.join(os.getcwd(), bot_name + '.json')

    # Load bot (passed in as argument by electron)
    with open(bot_file_path) as bot_file:
        bot = json.load(bot_file)

        execute_events(bot['events'],bot['variables'])

    # Exit route
    return 'success'


@app.route('/load-steps/<bot_name>')
def load_steps(bot_name):
    # Get bot_file_path from electron
    bot_file_path = os.path.join(os.getcwd(), bot_name + '.json')

    with open(bot_file_path) as bot_file:
        bot = json.load(bot_file)
        return jsonify(bot)

@app.route('/reorder-events/<bot_name>', methods=['GET'])
def reorder_events(bot_name):
    data = request.args.get('data')
    data = json.loads(data)
    order = data["order"]
    # Get bot_file_path from electron
    bot_file_path = os.path.join(os.getcwd(), bot_name + '.json')

    with open(bot_file_path) as bot_file:
        bot = json.load(bot_file)
        events = bot["events"]

    reorderedEvents = []
    for event in order:
        event = json.loads(event)
        start = event["start"]
        end = event["end"]
        reorderedEvents += (events[start:end+1])

    bot["events"] = reorderedEvents;

    with open(bot_file_path, 'w') as bot_file:
        # Replace current bot in bot_file with new bot
        json.dump(bot, bot_file, indent=2)
    return(jsonify(bot))

@app.route('/add-variable/<bot_name>', methods=['GET'])
def add_variable(bot_name):
    variable  = request.args.get('newVar', None)
    variable = json.loads(variable)
    bot_file_path = os.path.join(os.getcwd(), bot_name + '.json')
    # Load existing bot from given file
    with open(bot_file_path) as bot_file:
        bot = json.load(bot_file)
        # Add newly created variable to the bot if the variables field already exists
        # If not, create the variables field and add the newly created variable as its first element
        variable = {
            **variable,
            "value": parse_type(variable["value"],variable["type"])
        }
        if "variables" in bot:
            bot["variables"].append(variable)
        else:
            bot["variables"] = [variable]

    # Open bot_file in write mode
    with open(bot_file_path, 'w') as bot_file:
        # Replace current bot in bot_file with new bot
        json.dump(bot, bot_file, indent=2)
    return(jsonify(bot))

@app.route('/delete-variable/<bot_name>', methods=['GET'])
def delete_variable(bot_name):
    index = int(request.args.get('index',None))
    bot_file_path = os.path.join(os.getcwd(),bot_name+'.json')
    # Load existing bot from given file
    with open(bot_file_path) as bot_file:
        bot = json.load(bot_file)
        variables = bot["variables"]
        del variables[index:index+1]
    # Open bot_file in write mode
    with open(bot_file_path, 'w') as bot_file:
        # Replace current bot in bot_file with new bot
        json.dump(bot, bot_file, indent=2)
    return(jsonify(bot))   


@app.route('/edit-variable/<bot_name>', methods=['GET'])
def edit_variable(bot_name):
    varName  = request.args.get('name', None)
    newValue = request.args.get('newValue', '')
    bot_file_path = os.path.join(os.getcwd(), bot_name + '.json')

    # Load existing bot from given file
    with open(bot_file_path) as bot_file:
        bot = json.load(bot_file)
        variables = bot["variables"]
        for variable in variables:
            if variable["name"] == varName:
                variable["value"] = parse_type(newValue,variable["type"])
                break
    with open(bot_file_path,'w') as bot_file:
        json.dump(bot,bot_file,indent=2)
    return(jsonify(bot))

@app.route('/edit-typing-event/<bot_name>')
def edit_typing_event(bot_name):
    data = json.loads(request.args.get('data',None))
    startEventIndex = data["start"]
    endEventIndex = data["end"]
    newText = data["text"]
    specialKeys = data["specialKeys"]

    bot_file_path = os.path.join(os.getcwd(), bot_name + '.json')
    with open(bot_file_path) as bot_file:
        bot = json.load(bot_file)
        events = bot["events"]

    window = events[startEventIndex]["window"]
    startTime = events[startEventIndex]["time"]
    windowName = events[startEventIndex]["windowName"]

    del events[startEventIndex:endEventIndex+1]
    if len(specialKeys) > 0:
        pass
    else:
        for letterIndex in range(len(newText)):
            key = newText[letterIndex]
            events.insert(startEventIndex+letterIndex,
                {
                    "type": "keyboard",
                    "messageName": "key down",
                    "time": startTime+letterIndex,
                    "window": window,
                    "windowName": windowName,
                    "ascii": ord(key),
                    "key": key,
                }
            )
        with open(bot_file_path,'w') as bot_file:
            json.dump(bot,bot_file,indent=2)
        return(jsonify(bot))

@app.route('/add-if-event/<bot_name>')
def add_if_event(bot_name):
    bot_file_path = os.path.join(os.getcwd(), bot_name + '.json')
    with open(bot_file_path) as bot_file:
        bot = json.load(bot_file)
        events = bot["events"]
        variables = bot["variables"]
        # By default just use the first two variables and an == operator
        if(len(variables)>0):
            default_variable = variables[0]["name"]
        else:
            default_variable = ''
        if_event = {
            "id": str(uuid4()),
            "type": 'if',
            "varA": default_variable,
            "varB": default_variable,
            "operator": '==',
            "trueEvents": [],
            "falseEvents": []
        }
        events.append(if_event)
    with open(bot_file_path,'w') as bot_file:
        json.dump(bot,bot_file,indent=2)
    return(jsonify(bot))

@app.route('/edit-if-event/<bot_name>', methods=['GET'])
def edit_if_event(bot_name):
    event_id  = request.args.get('id', None)
    field = request.args.get('field', None)
    newName = request.args.get('newName',None)
    bot_file_path = os.path.join(os.getcwd(), bot_name + '.json')

    with open(bot_file_path) as bot_file:
        bot = json.load(bot_file)
        events = bot["events"]
        variables = bot["variables"]
    for event in events:
        try:
            if event['id'] == event_id:
                ifEvent = event
                break
        except KeyError:
            pass
    ifEvent[field] = newName
    with open(bot_file_path,'w') as bot_file:
        json.dump(bot,bot_file,indent=2)
    return('success')

@app.route('/delete-event/<bot_name>', methods=['GET'])
def delete_event(bot_name):
    start  = int(request.args.get('start', None))
    end = int(request.args.get('end', None))
    bot_file_path = os.path.join(os.getcwd(), bot_name + '.json')

    with open(bot_file_path) as bot_file:
        bot = json.load(bot_file)
        events = bot["events"]
        print(len(events))

    print(start)
    print(end)
    del events[start:end+1]
    print(len(events))
    with open(bot_file_path,'w') as bot_file:
        json.dump(bot,bot_file,indent=2)
    return(jsonify(bot))

@app.route('/delete-sub-event/<bot_name>', methods=['GET'])
def delete_sub_event(bot_name):
    event_id = request.args.get('id',None)
    start  = int(request.args.get('start', None))
    end = int(request.args.get('end', None))
    sub_event_field = request.args.get('field', None)

    bot_file_path = os.path.join(os.getcwd(), bot_name + '.json')

    with open(bot_file_path) as bot_file:
        bot = json.load(bot_file)
        events = bot["events"]

    for event in events:
        try:
            if event['id'] == event_id:
                mainEvent = event
                break
        except KeyError:
            pass

    subEvents = mainEvent[sub_event_field]
    del subEvents[start:end+1]

    with open(bot_file_path,'w') as bot_file:
        json.dump(bot,bot_file,indent=2)
    return(jsonify(bot))

@app.route('/add-sub-event/<bot_name>', methods=['GET'])
def add_sub_event(bot_name):
    event_id = request.args.get('id',None)
    event_type = request.args.get('type', None)
    sub_event_field = request.args.get('field', None)

    bot_file_path = os.path.join(os.getcwd(), bot_name + '.json')

    with open(bot_file_path) as bot_file:
        bot = json.load(bot_file)
        events = bot["events"]

    # Find event in bot by id
    for event in events:
        try:
            if event['id'] == event_id:
                mainEvent = event
                break
        except KeyError:
            pass

    subEvents = mainEvent[sub_event_field]
    print(subEvents)
    if(event_type == 'mouse click'):
        subEvents.append({
            'type': 'mouse',
            'button': 'left',
            'direction': 'down',
            'time': time.time(),
            'position': [0,0]
        })
        subEvents.append({
            'type': 'mouse',
            'button': 'left',
            'direction': 'up',
            'time': time.time(),
            'position': [0,0]
        })
    elif(event_type == 'type'):   
        subEvents.append({
            'type': 'keyboard',
            'time': time.time(),
            'ascii': ord('a'),
            'key': 'a',
        })

    with open(bot_file_path,'w') as bot_file:
        json.dump(bot,bot_file,indent=2)
    return(jsonify(bot))

@app.route('/edit-sub-typing-event/<bot_name>', methods=['GET'])
def edit_sub_typing_event(bot_name):
    event_id = request.args.get('id',None)
    sub_event_field = request.args.get('field', None)
    startEventIndex = request.args.get('start', None)
    endEventIndex = request.args.get('end', None)
    newText = request.args.get('text', None)
    specialKeys = []

    bot_file_path = os.path.join(os.getcwd(), bot_name + '.json')

    with open(bot_file_path) as bot_file:
        bot = json.load(bot_file)
        events = bot["events"]

    # Find event in bot by id
    for event in events:
        try:
            if event['id'] == event_id:
                mainEvent = event
                break
        except KeyError:
            pass

    subEvents = mainEvent[sub_event_field]
    window = subEvents[startEventIndex]["window"]
    startTime = subEvents[startEventIndex]["time"]
    windowName = subEvents[startEventIndex]["windowName"]

    del subEvents[startEventIndex:endEventIndex+1]
    if len(specialKeys) > 0:
        pass
    else:
        for letterIndex in range(len(newText)):
            key = newText[letterIndex]
            subEvents.insert(startEventIndex+letterIndex,
                {
                    "type": "keyboard",
                    "messageName": "key down",
                    "time": startTime+letterIndex,
                    "window": window,
                    "windowName": windowName,
                    "ascii": ord(key),
                    "key": key,
                }
            )

    with open(bot_file_path,'w') as bot_file:
        json.dump(bot,bot_file,indent=2)
    return(jsonify(bot))

@app.route('/add-loop-event/<bot_name>',methods=['GET'])
def add_loop_event(bot_name):
    bot_file_path = os.path.join(os.getcwd(), bot_name + '.json')
    with open(bot_file_path) as bot_file:
        bot = json.load(bot_file)
        events = bot["events"]
        # By default just use the first two variables and an == operator
        loop_event = {
            "id": str(uuid4()),
            "type": 'loop',
            "times": 2,
            "events": []
        }
        events.append(loop_event)
    with open(bot_file_path,'w') as bot_file:
        json.dump(bot,bot_file,indent=2)
    return(jsonify(bot))

@app.route('/edit-loop-event/<bot_name>',methods=['GET'])
def edit_loop_event(bot_name):
    event_id  = request.args.get('id', None)
    newValue = request.args.get('newValue',None)
    bot_file_path = os.path.join(os.getcwd(), bot_name + '.json')

    with open(bot_file_path) as bot_file:
        bot = json.load(bot_file)
        events = bot["events"]

    for event in events:
        try:
            if event['id'] == event_id:
                loopEvent = event
                break
        except KeyError:
            pass
    loopEvent['times'] = int(newValue)
    with open(bot_file_path,'w') as bot_file:
        json.dump(bot,bot_file,indent=2)
    return('success')



if __name__ == '__main__':
    app.run()
