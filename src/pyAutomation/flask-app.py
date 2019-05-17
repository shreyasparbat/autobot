# Library imports
# import pyHook
# from pyHook.HookManager import HookConstants
# import pythoncom
import pyautogui
import time
import os
import json
import pyperclip
from uuid import uuid4
from flask import Flask, request, jsonify
from flask_cors import CORS

# Initialise flask app
app = Flask(__name__)
CORS(app)

# List of all child event fields
CHILD_EVENT_FIELDS = [
    'events', # Child event field of 'loop'
    'trueEvents', # Child event field of 'if'
    'falseEvents' # Child event field of 'if'
]

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

# Recursively delete all linked child events
def delete_child_events(event,childEvents):
    childEvents[:] = [d for d in childEvents if d.get('id') != event["id"]]
    child_events_found = False

    for key in CHILD_EVENT_FIELDS:
        if key in event:
            for child_event in event[key]:
                delete_child_events(child_event,childEvents)
        else:
            return childEvents

@app.route('/')
def hello_world():
    return 'Hello World!'


@app.route('/record/<bot_name>')
def record(bot_name):
    # Spawn process to record
    os.system('python recorder.py ' + bot_name)
    # Exit route
    return 'success'

@app.route('/record-child/<bot_name>',methods=["GET"])
def record_child(bot_name):
    parent_event_id  = request.args.get('id', None)
    child_events_field = request.args.get('field',None)
    # Spawn process to record
    os.system('python child-recorder.py ' + bot_name + ' ' + parent_event_id + ' ' +child_events_field)
    # Exit route
    return 'success'

@app.route('/record-read-event/<bot_name>',methods=['GET'])
def record_read_event(bot_name):
    index  = request.args.get('index', None)
    parent_event_id = request.args.get('parent','')
    child_event_field = request.args.get('field','')

    bot_file_path = os.path.join(os.getcwd(), bot_name + '.json')

    os.system('python read-recorder.py ' + bot_name + ' ' + index + ' ' + parent_event_id + ' ' + child_event_field)
    return 'success'

@app.route('/record-click-event/<bot_name>',methods=['GET'])
def record_click_event(bot_name):
    down_click = request.args.get('start',None)
    up_click = request.args.get('end',None)
    parent_event_id = request.args.get('parent','main')
    child_event_field = request.args.get('field','')

    bot_file_path = os.path.join(os.getcwd(), bot_name+ '.json')

    os.system('python click-recorder.py ' + bot_name + ' ' + down_click + ' ' + up_click + ' ' + parent_event_id + ' ' + child_event_field)
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
        # Check if there is a variable field
        try:
            variable_name = event["variable"]
            for variable in variables:
                if variable["name"] == variable_name:
                    variable_value = variable["value"]
                    break
            for key in variable_value:
                pyautogui.press(key)
        except KeyError:
            # If ctrl/shift
            if event['key'] == 'shiftleft' or event['key'] == 'ctrlleft':
                # Press special key
                pyautogui.keyDown(event['key'])
                # Loop through nextKeys
                for next_key in event['nextKeys']:
                    pyautogui.press(next_key)

            # For any other key, just press
            pyautogui.press(event['key'])

    def execute_if_event(event):
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
            if variable["name"] == varB:
                varBVal = variable["value"]
                varBFound = True
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

    def execute_read_event(event):
        # Double click then Ctrl + c to copy text to clipboard
        pyautogui.mouseDown(button='left', x=event['position'][0], y=event['position'][1])
        pyautogui.mouseUp(button='left', x=event['position'][0], y=event['position'][1])
        pyautogui.mouseDown(button='left', x=event['position'][0], y=event['position'][1])
        pyautogui.mouseUp(button='left', x=event['position'][0], y=event['position'][1])
        pyautogui.keyDown('ctrl')
        pyautogui.keyDown('c')
        pyautogui.keyUp('ctrl')
        pyautogui.keyUp('c')
        text = pyperclip.paste()
        bot_file_path = os.path.join(os.getcwd(), bot_name + '.json')

        new_variable = {
            "name": event["variable"],
            "value": text,
            "type": 'string'
        }

        for index in range(len(variables)):
            variable = variables[index]
            if variable["name"] == event["variable"]:
                variable_index = index
                break
        else:
            variable_index = None
        if variable_index == None:
            variables.append(new_variable)
        else:
            variables[variable_index] = new_variable

        # Open bot_file in write mode
        with open(bot_file_path, 'w') as bot_file:
            # Replace current bot in bot_file with new bot
            json.dump(bot, bot_file, indent=2)

    def execute_events(events):
        for event in events:
            # For child events
            if event['type'] == 'child':
                for globalEvent in globalEvents:
                    if event["id"] == globalEvent["id"]:
                        event = globalEvent
            # For mouse events
            if event['type'] == 'mouse':
                execute_mouse_event(event)

            # For keyboard events
            if event['type'] == 'keyboard':
                print(variables)
                execute_keyboard_event(event)

            # For if events
            if event['type'] == 'if':
                execute_if_event(event)

            # For loop events
            if event['type'] == 'loop':
                execute_loop_event(event)

            # For read events
            if event['type'] == 'read':
                execute_read_event(event)

    # Get bot_file_path from electron
    bot_file_path = os.path.join(os.getcwd(), bot_name + '.json')

    # Load bot (passed in as argument by electron)
    with open(bot_file_path) as bot_file:
        bot = json.load(bot_file)
        globalEvents = bot['events']
        variables = bot['variables']
        execute_events(bot['events'])

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
    varName = request.args.get('name','a')        
    varValue = request.args.get('value','')
    varType = request.args.get('type','string')

    bot_file_path = os.path.join(os.getcwd(), bot_name + '.json')
    # Load existing bot from given file
    with open(bot_file_path) as bot_file:
        bot = json.load(bot_file)
        # Add newly created variable to the bot if the variables field already exists
        # If not, create the variables field and add the newly created variable as its first element
        variable = {
            "name": varName,
            "value": parse_type(varValue,varType),
            "type": varType
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
    start_event_index = int(request.args.get('start',None))
    end_event_index = int(request.args.get('end',None))
    new_text = request.args.get('text',None)
    new_variable = request.args.get('variable',None)
    parent = request.args.get('parent','main')
    field = request.args.get('field',None)

    bot_file_path = os.path.join(os.getcwd(), bot_name + '.json')
    with open(bot_file_path) as bot_file:
        bot = json.load(bot_file)
        events = bot["events"]
        child_events = bot["childEvents"]
        variables = bot["variables"]

    if parent == 'main':
        target_events = events
    else:
        for event in events:
            try:
                if event["id"] == parent:
                    target_events = event[field]
                    break
            except KeyError:
                pass
        for child_event in child_events:
            if child_event["id"] == parent:
                target_events = child_event[field]
                break
    del target_events[start_event_index:end_event_index+1]

    if new_text:
        for letterIndex in range(len(new_text)):
            key = new_text[letterIndex]
            target_events.insert(start_event_index+letterIndex,
                {
                    "type": "keyboard",
                    "messageName": "key down",
                    "ascii": ord(key),
                    "key": key,
                }
            )
    elif new_variable:
        target_events.insert(start_event_index,{
            "type":"keyboard",
            "variable": new_variable
        })

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
        child_events = bot["childEvents"]
        variables = bot["variables"]
    for event in events:
        try:
            if event['id'] == event_id:
                if_event = event
                break
        except KeyError:
            pass
    for child_event in child_events:
        try:
            if child_event['id'] == event_id:
                if_event = child_event
                break
        except KeyError:
            pass
    if_event[field] = newName
    with open(bot_file_path,'w') as bot_file:
        json.dump(bot,bot_file,indent=2)
    return('success')

@app.route('/edit-click-event/<bot_name>', methods=['GET'])
def edit_click_event(bot_name):
    down_click = request.args.get('start', None)
    up_click = request.args.get('end', None)
    parent = request.args.get('parent','main')
    parent_event_field = request.args.get('field', None)
    new_x_coord = request.args.get('xCoord', 0)
    new_y_coord = request.args.get('yCoord',0)

    bot_file_path = os.path.join(os.getcwd(), bot_name + '.json')

    with open(bot_file_path) as bot_file:
        bot = json.load(bot_file)
        events = bot["events"]
        child_events = bot["childEvents"]

    if parent == 'main':
        events[down_click] = {
            **events[down_click],
            "position":[new_x_coord,new_y_coord]
        }
        events[up_click] = {
            **events[up_click],
            "position":[new_x_coord,new_y_coord]
        }
    else:
        for event in events:
            try:
                if event['id'] == parent:
                    parent_event = event
                    break
            except KeyError:
                pass
        for child_event in child_events:
            try:
                if child_event['id'] == parent:
                    parent_event = child_event
                    break
            except KeyError:
                pass
        parent_event[parent_event_field][down_click] = {
            **parent_event[parent_event_field][down_click],
            "position":[new_x_coord,new_y_coord]
        }
        parent_event[parent_event_field][up_click] = {
            **parent_event[parent_event_field][up_click],
            "position":[new_x_coord,new_y_coord]
        }

    with open(bot_file_path,'w') as bot_file:
        json.dump(bot,bot_file,indent=2)
    return('success')


@app.route('/delete-event/<bot_name>', methods=['GET'])
def delete_event(bot_name):
    parent = request.args.get('parent', 'main')
    event_id = request.args.get('eventId', None)
    start  = int(request.args.get('start', None))
    end = int(request.args.get('end', None))
    child_event_field = request.args.get('field','events')
    bot_file_path = os.path.join(os.getcwd(), bot_name + '.json')

    with open(bot_file_path) as bot_file:
        bot = json.load(bot_file)
        events = bot["events"]
        child_events = bot["childEvents"]

    # Case where deleted event has no children and has no parent
    if ((parent == 'main') & (event_id == None)):
        del events[start:end+1]
    # Case where deleted event has children and has no parent
    elif ((parent == 'main') & (event_id != None)):
        for event in events:
            try:
                if event["id"] == event_id:
                    target_event = event
                    break
            except KeyError:
                pass
        child_events = delete_child_events(target_event,child_events)
        del events[start:end+1]
    # Case where deleted event has no children and has a parent
    elif ((parent != 'main') & (event_id == None)):
        for event in events:
            try:
                if event["id"] == parent:
                    parent_event = event
                    break
            except KeyError:
                pass
        for child_event in child_events:
            try:
                if child_event["id"] == parent:
                    parent_event = child_event
                    break
            except KeyError:
                pass
        target_events = parent_event[child_event_field]
        del target_events[start:end+1]
    # Case where deleted event has children and has a parent
    elif ((parent != 'main') & (event_id != None)):
        for event in events:
            try:
                if event["id"] == parent:
                    target_event = event
                    break
            except KeyError:
                pass
        for child_event in child_events:
            try:
                if child_event["id"] == parent:
                    target_event = child_event
                    break
            except KeyError:
                pass
        target_child_events = target_event[child_event_field]
        child_events = delete_child_events(target_event,child_events)
        del target_child_events[start:end+1]

    with open(bot_file_path,'w') as bot_file:
        json.dump(bot,bot_file,indent=2)     
    return(jsonify(bot))

@app.route('/add-event/<bot_name>', methods=['GET'])
def add_event(bot_name):
    parent = request.args.get('parent','main')
    event_type = request.args.get('type', None)
    parent_event_field = request.args.get('field', None)

    bot_file_path = os.path.join(os.getcwd(), bot_name + '.json')

    with open(bot_file_path) as bot_file:
        bot = json.load(bot_file)
        events = bot["events"]
        child_events = bot["childEvents"]
        variables = bot["variables"]

    # Find event in bot by id
    if parent == 'main':
        target_events = events
    else:
        for event in events:
            try:
                if event['id'] == parent:
                    parent_event = event
                    target_events = parent_event[parent_event_field]
                    break
            except KeyError:
                pass

    if event_type == 'mouse click':
        target_events.append({
            'type': 'mouse',
            'button': 'left',
            'direction': 'down',
            'time': time.time(),
            'position': [0,0]
        })
        target_events.append({
            'type': 'mouse',
            'button': 'left',
            'direction': 'up',
            'time': time.time(),
            'position': [0,0]
        })
    elif event_type == 'type':   
        target_events.append({
            'type': 'keyboard',
            'time': time.time(),
            'ascii': ord('a'),
            'key': 'a',
        })
    elif event_type == 'if':
        if(len(variables)>0):
            default_variable = variables[0]["name"]
        else:
            default_variable = ''
        event_id = str(uuid4())
        if_event = {
            "id": event_id,
            "type": 'if',
            "parent": parent, 
            "varA": default_variable,
            "varB": default_variable,
            "operator": '==',
            "trueEvents": [],
            "falseEvents": []
        }
        if parent == 'main':
            target_events.append(if_event)
        else:
            child_events.append(if_event)
            target_events.append({
                "type":"child",
                "id":event_id
            })
    elif event_type == 'loop':
        event_id = str(uuid4())
        loop_event = {
            "id": event_id,
            "type": 'loop',
            "times": 2,
            "events": []
        }
        if parent == 'main':
            target_events.append(loop_event)
        else:
            child_events.append(loop_event)
            target_events.append({
                "type": "child",
                "id": event_id
            })
    elif event_type == 'read':
        read_event = {
            "type": 'read',
            "position":[0,0],
            "variable":''
        }
        target_events.append(read_event)
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
        child_events = bot["childEvents"]

    for event in events:
        try:
            if event['id'] == event_id:
                loop_event = event
                break
        except KeyError:
            pass
    for child_event in child_events:
        try:
            if child_event['id'] == event_id:
                loop_event = child_event
                break
        except KeyError:
            pass            
    loop_event['times'] = int(newValue)
    with open(bot_file_path,'w') as bot_file:
        json.dump(bot,bot_file,indent=2)
    return('success')

@app.route('/edit-read-event/<bot_name>',methods=['GET'])
def edit_read_event(bot_name):
    index = int(request.args.get('index',None))
    child_event_field = request.args.get('field','main')
    parent_event_id = request.args.get('parent',None)
    x_coord = int(request.args.get('xCoord',0))
    y_coord = int(request.args.get('yCoord',0)) 
    var_name = request.args.get('varName','a')

    bot_file_path = os.path.join(os.getcwd(), bot_name + '.json')

    with open(bot_file_path) as bot_file:
        bot = json.load(bot_file)
        events = bot["events"]
        child_events = bot["childEvents"]

    if parent_event_id:
        for event in events:
            try:
                if event['id'] == parent_event_id:
                    parent_event = event
                    target_events = parent_event[child_event_field]
                    break
            except KeyError:
                pass
        for child_event in child_events:
            try:
                if child_event['id'] == parent_event_id:
                    parent_event = child_event
                    target_events = parent_event[child_event_field]
                    break
            except KeyError:
                pass        
    else:
        target_events = events    

    new_read_event = {
        "type":"read",
        "position":[
            x_coord,
            y_coord
        ],
        "variable": var_name
    }
    target_events[index] = new_read_event
    with open(bot_file_path,'w') as bot_file:
        json.dump(bot,bot_file,indent=2)
    return(jsonify(bot))

if __name__ == '__main__':
    app.run()