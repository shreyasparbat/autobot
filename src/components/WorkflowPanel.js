// Library imports
import React from 'react'
import Paper from '@material-ui/core/Paper'
import axios from 'axios'
import Sortable from 'react-sortablejs';

// Custom component imports
import ClickCard from './ClickCard'
import TypingCard from './TypingCard'
import IfCard from './IfCard'
import './css/WorkflowPanel.css'
import ArrowDown from './css/ArrowDown.svg'

// Redux imports
import {connect} from 'react-redux'
import {updateBot} from '../actions/botAction'

class WorkflowPanel extends React.Component {
    pyURL = 'http://127.0.0.1:5000/'
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

    deleteEvent = (start,end) => {
        axios.get(this.pyURL+'delete-event/'+this.props.botName,{params:{
            start,
            end
        }}).then((reply)=>{
            this.props.updateBot(reply.data)
        }) 
    }

    deleteSubEvent = (start,end,eventType,id) => {
        axios.get(this.pyURL+'delete-sub-event/'+this.props.botName,{params:{
            start,
            end,
            eventType,
            id
        }}).then((reply)=>{
            this.props.updateBot(reply.data)
        })
    }

    render() {
        // Dynamically load ClickCards, TypingCards and IfCards
        const cards = this.props.bot.events.map((event, index) => {
                            if (event.type === 'mouse' && event.direction === 'up') {
                                let start = index-1
                                let end = index
                                return (
                                    <li key={event.time}>
                                        <ClickCard deleteEvent={()=>{this.deleteEvent(start,end)}} />
                                        <div className={'arrow-down'}>
                                            <img src={ArrowDown} alt={'arrow-down'}/>
                                        </div>
                                    </li>
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
                                            this.props.bot.events.splice(i, 1)
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
                                    <li key={event.time}>
                                        <TypingCard start={start} end={end} deleteEvent={this.deleteEvent} checkboxesDict={this.checkboxesDict} text={text} />
                                        <div className={'arrow-down'}>
                                            <img src={ArrowDown} alt={'arrow-down'}/>
                                        </div>
                                    </li>
                                )
                            }
                            if(event.type === 'if'){
                                let start = index;
                                let end = index;
                                return (
                                    <li key={event.time}>
                                        <IfCard deleteSubEvent={this.deleteSubEvent} deleteEvent={()=>{this.deleteEvent(start,end)}} event={event} variables={this.props.bot.variables} botName={this.props.botName}/>
                                        <div className={'arrow-down'}>
                                            <img src={ArrowDown} alt={'arrow-down'}/>
                                        </div>
                                    </li>
                                )
                            }
                        })
        return (
            <div>
                <Paper elevation={3}>
                    <Sortable
                        tag="ul"
                    >
                        {cards}
                    </Sortable>
                </Paper>
            </div>
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
