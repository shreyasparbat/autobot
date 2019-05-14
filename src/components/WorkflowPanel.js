// Library imports
import React from 'react'
import Paper from '@material-ui/core/Paper'
import axios from 'axios'
import Sortable from 'react-sortablejs';
import {Droppable} from 'react-drag-and-drop'

// Custom component imports
import ClickCard from './ClickCard'
import TypingCard from './TypingCard'
import IfCard from './IfCard'
import LoopCard from './LoopCard'
import './css/WorkflowPanel.css'
import ArrowDown from './css/ArrowDown.svg'

// Redux imports
import {connect} from 'react-redux'
import {updateBot} from '../actions/botAction'

class WorkflowPanel extends React.Component {
    pyURL = 'http://127.0.0.1:5000/'
    vetoedIndexes = []
    specialKeys = [
        'ctrlleft', 
        'altleft', 
        'shiftleft', 
        'winleft'
    ]
    checkboxesDict = {
        ctrlleft: false,
        altleft: false,
        shiftleft: false,
        winleft: false,
    }

    onDrop = (data,event) => {
        console.log('hello!')
        console.log(data)
        console.log(event);
    }
    deleteEvent = (start,end) => {
        axios.get(this.pyURL+'delete-event/'+this.props.botName,{params:{
            start,
            end
        }}).then((reply)=>{
            this.props.updateBot(reply.data)
        }) 
    }

    deleteSubEvent = (start,end,field,id) => {
        axios.get(this.pyURL+'delete-sub-event/'+this.props.botName,{params:{
            start,
            end,
            field,
            id
        }}).then((reply)=>{
            this.props.updateBot(reply.data)
        })
    }

    reorderEvents = (order,sortable,event) => {
        axios.get(this.pyURL+'reorder-events/'+this.props.botName,{params:{
            data:JSON.stringify({
                order
            })
        }}).then((reply)=>{
            this.props.updateBot(reply.data)
        })  
    }

    render() {
        // Dynamically load ClickCards, TypingCards and IfCards
        console.log(this.props.bot)
        this.vetoedIndexes = [];
        const cards = 
            this.props.bot.events.map((event, index) => {
                if(!this.vetoedIndexes.includes(index)){
                    if (event.type === 'mouse' && event.direction === 'up') {
                        let start = index-1
                        let end = index
                        return (
                            <div key={event.time} data-id={JSON.stringify({start,end})}>
                                <ClickCard deleteEvent={()=>{this.deleteEvent(start,end)}} />
                                <div className={'arrow-down'}>
                                    <img src={ArrowDown} alt={'arrow-down'}/>
                                </div>
                            </div>
                        )
                    }
                    if (event.type === 'keyboard') {
                        let text = event.key
                        let endIndex = index;
                        //Reset checkBoxesDict to initial state 
                        this.checkboxesDict = {
                            ctrlleft: false,
                            altleft: false,
                            shiftleft: false,
                            winleft: false,
                        }
                        // Account for special key presses
                        if (this.specialKeys.includes(text)) {
                            this.checkboxesDict[text] = true
                            text = ''
                            console.log(event);
                            event.nextKeys.map((key) => {
                                text += key
                            })
                        } else {
                            for (let i = index + 1; i < this.props.bot.events.length; i++) {
                                const nextEvent = this.props.bot.events[i]
                                if (nextEvent.type === 'keyboard' && !this.specialKeys.includes(nextEvent.key)) {
                                    text += nextEvent.key
                                    this.vetoedIndexes.push(i)
                                    endIndex++
                                } else {
                                    break
                                }
                            }
                        }
                        let start = index;
                        let end = endIndex;
                        return (
                            <div data-id={JSON.stringify({start,end})} key={event.time}>
                                <TypingCard start={start} end={end} deleteEvent={this.deleteEvent} checkboxesDict={this.checkboxesDict} text={text} />
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
                                <IfCard deleteSubEvent={this.deleteSubEvent} deleteEvent={()=>{this.deleteEvent(start,end)}} event={event} variables={this.props.bot.variables} botName={this.props.botName}/>
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
                                <LoopCard deleteSubEvent={this.deleteSubEvent} deleteEvent={()=>{this.deleteEvent(start,end)}} event={event} variables={this.props.bot.variables} botName={this.props.botName}/>
                                <div className={'arrow-down'}>
                                    <img src={ArrowDown} alt={'arrow-down'}/>
                                </div>
                            </div>
                        )
                    }                         
                }
            })
        return (
            <Droppable
                types={['fruit']} // <= allowed drop types
                onDrop={this.onDrop}
            >
                <Paper elevation={3}>
                    <Sortable
                        options={{animation:150}}
                        onChange={this.reorderEvents}
                    >
                        {cards}
                    </Sortable>
                </Paper>
            </Droppable>
        )
    }
}

const mapStateToProps = state => ({
    bot: state.botReducer.bot
})

const mapDispatchToProps = dispatch => ({
    updateBot: (bot) => dispatch(updateBot(bot))
})
export default connect(mapStateToProps,mapDispatchToProps)(WorkflowPanel)
