// Library imports
import React from 'react'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import axios from 'axios'

// Other imports
import './css/LoopCard.css'
import Typography from '@material-ui/core/Typography'
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Input from '@material-ui/core/Input';
import ClickCard from './ClickCard'
import TypingCard from './TypingCard'
import IfCard from './IfCard'
import ReadCard from './ReadCard'
import ArrowDown from './css/ArrowDown.svg'
import Icon from '@material-ui/core/Icon'
import Button from '@material-ui/core/Button'
import {Droppable} from 'react-drag-and-drop'

// Redux imports
import {connect} from 'react-redux';
import {updateBot} from '../actions/botAction'

/**
 *  LoopCard.js
 *      Renders the Loop event
 *      Rendered in WorkflowPanel.js
 *                  LoopCard.js
 *                  IfCard.js
 *
 *      Props:
 *          start (Number: represents the start index of the loop event in its respective events array)(required)
 *          end (Number: represents the end index of the loop event in its respective events array)(required)
 *          event (Obj: represents the loop event)(required)
 *          deleteEvent (Function: Function to delete this event from the bot)(required)
 *          parent (String: id which represents the parent event if there is any)(as required)
 *          field (String: represents the field of the parent event that it belongs to)(as required)
 */

class LoopCard extends React.Component {
    // Retake mouse click
    constructor(props){
        super(props)
    }
    pyURL = 'http://127.0.0.1:5000/'
    specialKeys = ['ctrlleft', 'altleft', 'shiftleft', 'winleft']
    checkboxesDict = {
        ctrlleft: false,
        altleft: false,
        shiftleft: false,
        winleft: false,
    }

    editLoopEvent(event){
        const { id } = this.props.event
        const newValue = event.target.value
        axios.get(this.pyURL+'edit-loop-event/'+this.props.botName,{params:{
            id,
            newValue
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

    onDrop = (data,event) => {
        axios.get(this.pyURL+`add-event/`+this.props.botName,{params:{
            "parent": this.props.event.id,
            "type":data['activity'].toLowerCase(),
            "field":"events"
        }}).then(reply=>{
            this.props.updateBot(reply.data)
        })
    }

    render() {
        const { event , start , end , field , parent , } = this.props
        const { events , id } = event
        console.log(this.props)
        return (
            <Droppable
                types={['activity']} // <= allowed drop types
                onDrop={this.onDrop}
            >
                <div className={'ui loop-card'}>
                    <Card elevation={3}>
                        <Icon className={'delete-event-button'} onClick={()=>{this.props.deleteEvent(start,end,field,parent,id)}}>
                            clear
                        </Icon>
                        <CardContent className={'content'}>
                            <div className={'title'}>
                                <Typography variant="h5" component="h2">
                                    {'Loop'}
                                </Typography>
                            </div>
                            <div style={{justifyContent:'center',display:'flex',flexDirection:'row'}}>
                                <div style={{flex:1,textAlign:'center'}}>
                                    <div className={'if-sub-title'}>
                                        <div style={{flexDirection:'row'}}>
                                            <Input type="number" style={{width:'50px',textAlign:'center'}} onBlur={(event)=>{this.editLoopEvent(event)}} defaultValue={event.times}/>
                                            <Typography variant={'h6'} inline={true}>
                                                {'times'}
                                            </Typography>
                                        </div>
                                        <div className={'arrow-down'}>
                                            <img src={ArrowDown} alt={'arrow-down'}/>
                                        </div>
                                    </div>
                                    { 
                                        events.map((event, index) => {
                                            console.log(this.props.bot)
                                            if(event.type == 'child'){
                                                event = this.props.bot.childEvents.find(childEvent => {
                                                    return childEvent.id == event.id
                                                });
                                            }
                                            if (event.type === 'mouse' && event.direction === 'up') {
                                                let start = index-1;
                                                let end = index;
                                                return (
                                                    <div>
                                                        <ClickCard start={start} end={end} field={'events'} event={event} deleteEvent={()=>{this.props.deleteEvent(start,end,'events',id)}} />
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
                                                    for (let i = index + 1; i < events.length; i++) {
                                                        const nextEvent = events[i]
                                                        if (nextEvent.type === 'keyboard' && !this.specialKeys.includes(nextEvent.key)) {
                                                            text += nextEvent.key
                                                            events.splice(i, 1)
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
                                                            field={'events'}
                                                            event={event}
                                                            deleteEvent={()=>{this.props.deleteEvent(start,end,'events',id)}} 
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
                                                        <IfCard start={start} end={end} field={'events'} parent={id} deleteEvent={this.props.deleteEvent} event={event} variables={this.props.bot.variables} botName={this.props.botName}/>
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
                                                        <LoopCard start={start} end={end} field={'events'} parent={id} deleteEvent={this.props.deleteEvent} bot={this.props.bot} event={event} variables={this.props.bot.variables} botName={this.props.botName}/>
                                                        <div className={'arrow-down'}>
                                                            <img src={ArrowDown} alt={'arrow-down'}/>
                                                        </div>
                                                    </div>
                                                )
                                            }
                                            if(event.type == 'read'){
                                                let start = index;
                                                let end = index;
                                                return (
                                                    <div data-id={JSON.stringify({start,end})} key={event.time}>
                                                        <ReadCard start={start} end={end} index={index} field={'events'} parent={id} deleteEvent={this.props.deleteEvent} bot={this.props.bot} event={event} variables={this.props.bot.variables} botName={this.props.botName}/>
                                                        <div className={'arrow-down'}>
                                                            <img src={ArrowDown} alt={'arrow-down'}/>
                                                        </div>
                                                    </div>
                                                )
                                            }
                                        })
                                    }
                                    <Button onClick={()=>{this.recordChildEvents(id,'events')}}variant={'contained'} color={'secondary'}>
                                        Record
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </Droppable>
        )
    }
}

const mapStateToProps = state => ({
    bot: state.botReducer.bot
})

const mapDispatchToProps = dispatch => ({
    updateBot: (bot)=>{dispatch(updateBot(bot))}
})


export default connect(mapStateToProps,mapDispatchToProps)(LoopCard)
