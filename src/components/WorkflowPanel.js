// Library imports
import React from 'react'
import Paper from '@material-ui/core/Paper'
import axios from 'axios'

// Custom component imports
import ClickCard from './ClickCard'
import TypingCard from './TypingCard'
import './css/WorkflowPanel.css'
import ArrowDown from './css/ArrowDown.svg'

export default class WorkflowPanel extends React.Component {
    state = {
        bot: {
            variables: [],
            events: []
        }
    }
    pyURL = 'http://127.0.0.1:5000/'
    specialKeys = ['ctrlleft', 'altleft', 'shiftleft', 'winleft']
    checkboxesDict = {
        ctrlleft: false,
        altleft: false,
        shiftleft: false,
        winleft: false,
    }



    componentDidMount() {
        // Load steps
        axios.get(this.pyURL + 'load-steps/' + this.props.botName).then((reply) => {
            this.setState({
                bot: reply.data
            })
        })
        .catch(err=>{
            console.log(err)
        })
        // console.log('hi')
    }

    render() {
        return (
            <div>
                <Paper elevation={3}>
                    {
                        // Dynamically load ClickCards and TypingCards
                        this.state.bot.events.map((event, index) => {
                            if (event.type === 'mouse' && event.direction === 'up') {
                                return (
                                    <div>
                                        <ClickCard/>
                                        <div className={'arrow-down'}>
                                            <img src={ArrowDown} alt={'arrow-down'}/>
                                        </div>
                                    </div>
                                )
                            }
                            if (event.type === 'keyboard') {
                                let text = event.key

                                // Account for special key presses
                                if (this.specialKeys.includes(text)) {
                                    this.checkboxesDict[text] = true
                                    text = ''
                                    event.nextKeys.map((key) => {
                                        text += key
                                    })
                                } else {
                                    for (let i = index + 1; i < this.state.bot.events.length; i++) {
                                        const nextEvent = this.state.bot.events[i]
                                        if (nextEvent.type === 'keyboard' && !this.specialKeys.includes(nextEvent.key)) {
                                            text += nextEvent.key
                                            this.state.bot.events.splice(i, 1)
                                            i--
                                        } else {
                                            break
                                        }
                                    }
                                }
                                return (
                                    <div>
                                        <TypingCard checkboxesDict={this.checkboxesDict} text={text} />
                                        <div className={'arrow-down'}>
                                            <img src={ArrowDown} alt={'arrow-down'}/>
                                        </div>
                                    </div>
                                )
                            }
                        })
                    }
                </Paper>
            </div>
        )
    }
}
