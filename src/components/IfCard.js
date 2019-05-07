// Library imports
import React from 'react'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import axios from 'axios'

// Other imports
import './css/IfCard.css'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Input from '@material-ui/core/Input';
import ClickCard from './ClickCard'
import TypingCard from './TypingCard'
import ArrowDown from './css/ArrowDown.svg'

export default class IfCard extends React.Component {
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
    operators = ['==','<=','>=']
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

    render() {
        const { variables , event} = this.props
        const { varA, varB, operator, trueEvents, falseEvents , id } = event
        return (
            <div className={'ui if-card'}>
                <Card elevation={3}>
                    <Button onClick={this.props.deleteEvent} variant={'contained'} color={'secondary'}>
                        X
                    </Button>
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
                                    <MenuItem value={variable.name}>{variable.name}</MenuItem>
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
                                    <MenuItem value={operator}>{operator}</MenuItem>
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
                                    <MenuItem value={variable.name}>{variable.name}</MenuItem>
                                )
                            })
                        }
                        </Select>
                        <div style={{justifyContent:'center',display:'flex',flexDirection:'row'}}>
                            <div style={{flex:1}}>
                                <div className={'if-sub-title'}>
                                    <Typography variant="h5" component="h2">
                                        True
                                    </Typography>
                                    <div className={'arrow-down'}>
                                        <img src={ArrowDown} alt={'arrow-down'}/>
                                    </div>
                                </div>
                                {
                                // Dynamically load ClickCards and TypingCards
                                trueEvents.map((event, index) => {
                                    if (event.type === 'mouse' && event.direction === 'up') {
                                        let start = index-1;
                                        let end = index;
                                        return (
                                            <div>
                                                <ClickCard subEvent={true} deleteSubEvent={()=>{this.props.deleteSubEvent(start,end,'true',id)}} />
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
                                            for (let i = index + 1; i < trueEvents.length; i++) {
                                                const nextEvent = trueEvents[i]
                                                if (nextEvent.type === 'keyboard' && !this.specialKeys.includes(nextEvent.key)) {
                                                    text += nextEvent.key
                                                    trueEvents.splice(i, 1)
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
                            </div>
                            <div style={{flex:1}}>
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
                                    if (event.type === 'mouse' && event.direction === 'up') {
                                        return (
                                            <div>
                                                <ClickCard subEvent={true} />
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
                                            for (let i = index + 1; i < falseEvents.length; i++) {
                                                const nextEvent = falseEvents[i]
                                                if (nextEvent.type === 'keyboard' && !this.specialKeys.includes(nextEvent.key)) {
                                                    text += nextEvent.key
                                                    falseEvents.splice(i, 1)
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
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }
}
