// Library imports
import React from 'react'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import axios from 'axios'

// Other imports
import './css/IfCard.css'
import Typography from '@material-ui/core/Typography'
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Input from '@material-ui/core/Input';
import ClickCard from './ClickCard'
import TypingCard from './TypingCard'
import LoopCard from './LoopCard'
import ArrowDown from './css/ArrowDown.svg'
import Icon from '@material-ui/core/Icon'
import Button from '@material-ui/core/Button'
import {Droppable} from 'react-drag-and-drop'

// Redux imports
import {connect} from 'react-redux';
import {updateBot} from '../actions/botAction'

class IfCard extends React.Component {
    // Retake mouse click
    constructor(props){
        super(props);
        const {varA, varB, operator} = props.event
        this.state={
            varA,
            varB,
            operator
        }
    }
    pyURL = 'http://127.0.0.1:5000/'
    operators = ['==','<=','>=','!=']
    specialKeys = ['ctrlleft', 'altleft', 'shiftleft', 'winleft']
    checkboxesDict = {
        ctrlleft: false,
        altleft: false,
        shiftleft: false,
        winleft: false,
    }

    editIfEvent(id,field,newName){
        this.setState({[field]:newName})
        axios.get(this.pyURL+'edit-if-event/'+this.props.botName,{params:{
            id,
            field,
            newName
        }}).then((reply)=>{
            console.log('success!');
        })    
    }

    recordChildEvents(id,field){
        axios.get(this.pyURL+'record-child/'+this.props.botName,{params:{
            id,
            field
        }}).then(reply=>{
            console.log('success!')
        });
    }

    onTrueDrop = (data,event) => {
        axios.get(this.pyURL+`add-event/`+this.props.botName,{params:{
            "parent": this.props.event.id,
            "type":data['activity'].toLowerCase(),
            "field":"trueEvents"
        }}).then(reply=>{
            this.props.updateBot(reply.data)
        })
    }

    onFalseDrop = (data,event) => {
        axios.get(this.pyURL+`add-event/`+this.props.botName,{params:{
            "parent": this.props.event.id,
            "type":data['activity'].toLowerCase(),
            "field":"falseEvents"
        }}).then(reply=>{
            this.props.updateBot(reply.data)
        })
    }

    render() {
        const { variables , event , start , end , parentId} = this.props
        const parentField = this.props.field;
        const { varA, varB, operator, trueEvents, falseEvents , id } = event
        return (
            <div className={'ui if-card'}>
                <Card elevation={3}>
                    <Icon className={'delete-event-button'} onClick={()=>{this.props.deleteEvent(start,end,parentField,parentId,id)}}>
                        clear
                    </Icon>
                    <CardContent className={'content'}>
                        <div className={'title'}>
                            <Typography variant="h5" component="h2">
                                If
                            </Typography>
                        </div>
                        <Select
                            className={'if-card-option'}
                            value={this.state.varA ? this.state.varA : variables.length > 0 ? variables[0].name : ''}
                            onChange={(event)=>{
                                this.editIfEvent(id,"varA",event.target.value)
                            }}
                            input={<Input name="name" id="name-disabled" />}
                        >
                        {
                            variables.map((variable,index)=>{
                                return(
                                    <MenuItem key={variable.name} value={variable.name}>{variable.name}</MenuItem>
                                )
                            })
                        }
                        </Select>
                        <Select
                            className={'if-card-option'}
                            value={this.state.operator ? this.state.operator : '=='}
                            onChange={(event)=>{
                                this.editIfEvent(id,"operator",event.target.value)
                            }}
                            input={<Input name="name" id="name-disabled" />}
                        >
                        {
                            this.operators.map((operator,index)=>{
                                return(
                                    <MenuItem key={operator} value={operator}>{operator}</MenuItem>
                                )
                            })
                        }
                        </Select>                        
                        <Select
                            className={'if-card-option'}
                            value={this.state.varB ? this.state.varB : variables.length > 0 ? variables[0].name : ''}
                            onChange={(event)=>{
                                this.editIfEvent(id,"varB",event.target.value)
                            }}
                            input={<Input name="name" id="name-disabled" />}
                        >
                        {
                            variables.map((variable,index)=>{
                                return(
                                    <MenuItem key={variable.name} value={variable.name}>{variable.name}</MenuItem>
                                )
                            })
                        }
                        </Select>
                        <div style={{justifyContent:'center',display:'flex',flexDirection:'row'}}>
                            <div style={{flex:1,textAlign:'center'}}>
                                <Droppable
                                    types={['activity']} // <= allowed drop types
                                    onDrop={this.onTrueDrop}
                                >
                                    <div className={'if-sub-title'}>
                                        <Typography variant="h5" component="h2">
                                            True
                                        </Typography>
                                        <div className={'arrow-down'}>
                                            <img src={ArrowDown} alt={'arrow-down'}/>
                                        </div>
                                    </div>
                                        { 
                                            trueEvents.map((event, index) => {
                                                console.log(event)
                                                if(event.type == 'child'){
                                                    event = this.props.bot.childEvents.find(childEvent => {
                                                        return childEvent.id == event.id
                                                    });
                                                }
                                                if (event.type === 'mouse' && event.direction === 'up') {
                                                    let start = index-1;
                                                    let end = index;
                                                    return (
                                                        <div key={JSON.stringify(event)}>
                                                            <ClickCard event={event} deleteEvent={()=>{this.props.deleteEvent(start,end,'trueEvents',id)}} />
                                                            <div className={'arrow-down'}>
                                                                <img src={ArrowDown} alt={'arrow-down'}/>
                                                            </div>
                                                        </div>
                                                    )
                                                }
                                                if (event.type === 'keyboard') {
                                                    let text = event.key
                                                    let endIndex = index;
                                                    // Account for special key presses
                                                    if (this.specialKeys.includes(text)) {
                                                        this.checkboxesDict[text] = true
                                                        text = ''
                                                        event.nextKeys.map((key) => {
                                                            text += key
                                                        })
                                                    } else {
                                                        for (let i = index + 1; i < trueEvents.length; i++) {
                                                            const nextEvent = trueEvents[i]
                                                            if (nextEvent.type === 'keyboard' && !this.specialKeys.includes(nextEvent.key)) {
                                                                text += nextEvent.key
                                                                trueEvents.splice(i, 1)
                                                                endIndex++
                                                                i--
                                                            } else {
                                                                break
                                                            }
                                                        }
                                                    }
                                                    let start = index;
                                                    let end = endIndex;
                                                    return (
                                                        <div>
                                                            <TypingCard 
                                                                field={'trueEvents'}
                                                                parent={id}
                                                                start={start}
                                                                end={end}
                                                                event={event}
                                                                deleteEvent={()=>{this.props.deleteEvent(start,end,'trueEvents',id)}} 
                                                                checkboxesDict={this.checkboxesDict} 
                                                                text={text} 
                                                            />
                                                            <div className={'arrow-down'}>
                                                                <img src={ArrowDown} alt={'arrow-down'}/>
                                                            </div>
                                                        </div>
                                                    )
                                                }
                                                if(event.type === 'if'){
                                                    let start = index;
                                                    let end = index;
                                                    return (
                                                        <div data-id={JSON.stringify({start,end})} key={event.time}>
                                                            <IfCard start={start} end={end} field={'trueEvents'} parentId={id} deleteEvent={this.props.deleteEvent} event={event} variables={this.props.bot.variables} botName={this.props.botName}/>
                                                            <div className={'arrow-down'}>
                                                                <img src={ArrowDown} alt={'arrow-down'}/>
                                                            </div>
                                                        </div>
                                                    )
                                                }  
                                                if(event.type === 'loop'){
                                                    let start = index;
                                                    let end = index;
                                                    return (
                                                        <div data-id={JSON.stringify({start,end})} key={event.time}>
                                                            <LoopCard start={start} end={end} field={'trueEvents'} parentId={id} deleteEvent={this.props.deleteEvent} event={event} variables={this.props.bot.variables} botName={this.props.botName}/>
                                                            <div className={'arrow-down'}>
                                                                <img src={ArrowDown} alt={'arrow-down'}/>
                                                            </div>
                                                        </div>
                                                    )
                                                }
                                            })
                                        }
                                    <Button onClick={()=>{this.recordChildEvents(id,'trueEvents')}}variant={'contained'} color={'secondary'}>
                                        Record
                                    </Button>
                                </Droppable>
                            </div>                         
                            <div style={{flex:1,textAlign:'center'}}>
                                <Droppable
                                    types={['activity']} // <= allowed drop types
                                    onDrop={this.onFalseDrop}
                                >   
                                    <div className={'if-sub-title'}>
                                        <Typography variant="h5" component="h2">
                                            False
                                        </Typography>
                                        <div className={'arrow-down'}>
                                            <img src={ArrowDown} alt={'arrow-down'}/>
                                        </div>
                                    </div>
                                        {
                                        // Dynamically load ClickCards and TypingCards
                                        falseEvents.map((event, index) => {
                                            if(event.type == 'child'){
                                                event = this.props.bot.events.find(mainEvent => {
                                                    return mainEvent.id == event.id
                                                });
                                            }
                                            if (event.type === 'mouse' && event.direction === 'up') {
                                                let start = index-1;
                                                let end = index;
                                                return (
                                                    <div>
                                                        <ClickCard 
                                                            event={event}
                                                            deleteEvent={()=>{this.props.deleteEvent(start,end,'falseEvents',id)}}
                                                        />
                                                        <div className={'arrow-down'}>
                                                            <img src={ArrowDown} alt={'arrow-down'}/>
                                                        </div>
                                                    </div>
                                                )
                                            }
                                            if (event.type === 'keyboard') {
                                                let text = event.key
                                                let endIndex = index;
                                                // Account for special key presses
                                                if (this.specialKeys.includes(text)) {
                                                    this.checkboxesDict[text] = true
                                                    text = ''
                                                    event.nextKeys.map((key) => {
                                                        text += key
                                                    })
                                                } else {
                                                    for (let i = index + 1; i < falseEvents.length; i++) {
                                                        const nextEvent = falseEvents[i]
                                                        if (nextEvent.type === 'keyboard' && !this.specialKeys.includes(nextEvent.key)) {
                                                            text += nextEvent.key
                                                            falseEvents.splice(i, 1)
                                                            endIndex++
                                                            i--
                                                        } else {
                                                            break
                                                        }
                                                    }
                                                }
                                                let start = index;
                                                let end = endIndex;
                                                return (
                                                    <div>
                                                        <TypingCard 
                                                            field={'falseEvents'}
                                                            start={start}
                                                            end={end}
                                                            parent={id}
                                                            event={event}
                                                            deleteEvent={()=>{this.props.deleteEvent(start,end,'falseEvents',id)}} 
                                                            checkboxesDict={this.checkboxesDict} 
                                                            text={text} 
                                                        />
                                                        <div className={'arrow-down'}>
                                                            <img src={ArrowDown} alt={'arrow-down'}/>
                                                        </div>
                                                    </div>
                                                )
                                            }
                                            if(event.type === 'if'){
                                                let start = index;
                                                let end = index;
                                                return (
                                                    <div data-id={JSON.stringify({start,end})} key={event.time}>
                                                        <IfCard start={start} end={end} field={'falseEvents'} parentId={id} deleteEvent={this.props.deleteEvent} event={event} variables={this.props.bot.variables} botName={this.props.botName}/>
                                                        <div className={'arrow-down'}>
                                                            <img src={ArrowDown} alt={'arrow-down'}/>
                                                        </div>
                                                    </div>
                                                )
                                            }  
                                            if(event.type === 'loop'){
                                                let start = index;
                                                let end = index;
                                                return (
                                                    <div data-id={JSON.stringify({start,end})} key={event.time}>
                                                        <LoopCard start={start} end={end} field={'falseEvents'} parentId={id} deleteEvent={this.props.deleteEvent} event={event} variables={this.props.bot.variables} botName={this.props.botName}/>
                                                        <div className={'arrow-down'}>
                                                            <img src={ArrowDown} alt={'arrow-down'}/>
                                                        </div>
                                                    </div>
                                                )
                                            }
                                        })
                                        }
                                    <Button onClick={()=>{this.recordChildEvents(id,'falseEvents')}}variant={'contained'} color={'secondary'}>
                                        Record
                                    </Button>
                                </Droppable>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    bot: state.botReducer.bot
})

const mapDispatchToProps = dispatch => ({
    updateBot: (bot)=>{dispatch(updateBot(bot))}
})


export default connect(mapStateToProps,mapDispatchToProps)(IfCard)

