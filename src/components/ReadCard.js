// Library imports
import React from 'react'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import axios from 'axios'

// Other imports
import './css/ReadCard.css'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Icon from '@material-ui/core/Icon'
import Input from '@material-ui/core/Input'

// Redux imports
import { connect } from 'react-redux'
import { updateBot } from '../actions/botAction'

/**
 *  ReadCard.js
 *      Renders the Read event
 *      Rendered in WorkflowPanel.js
 *                  LoopCard.js
 *                  IfCard.js
 *
 *      Props:
 *          index (Number: represents the index of the read event in its respective events array)(required)
 *          event (Obj: represents the read event)(required)
 *          deleteEvent (Function: Function to delete this event from the bot)(required)
 *          parent (String: id which represents the parent event if there is any)(as required)
 *          field (String: represents the field of the parent event that it belongs to)(as required)
 */

class ReadCard extends React.Component {
    // Retake mouse click
    pyURL = 'http://127.0.0.1:5000/'
    constructor(props){
        super(props)
        this.state = {
            xCoord: props.event.position[0],
            yCoord: props.event.position[1],
            varName: props.event.variable,
        }
    }

    retakeRead = () => {
        const {index,field,parent} = this.props;
        axios.get(this.pyURL+'record-read-event/'+this.props.botName,{params:{
            index,
            field,
            parent
        }}).then(reply=>{
            console.log(reply.data)
        })
    }

    editReadEvent = () => {
        const { index,field,parent} = this.props;
        const { xCoord , yCoord , varName} = this.state;
        axios.get(this.pyURL+'edit-read-event/'+this.props.botName,{params:{
            index,
            field,
            parent,
            xCoord,
            yCoord,
            varName
        }}).then(reply=>{
            this.props.updateBot(reply.data)
        })
    }

    render() {
        const {index,field,parent,deleteEvent,event} = this.props;
        return (
            <div 
                className={'ui read-card'}
            >
                <Card elevation={3}>
                    <Icon className={'delete-event-button'} onClick={()=>{deleteEvent(index,index,field,parent)}}>
                        clear
                    </Icon>
                    <CardContent className={'content'}>
                        <div className={'title'}>
                            <Typography variant="h5" component="h2">
                                Read
                            </Typography>
                        </div>
                        <div style={{display:'flex',flexDirection:'row'}}>
                            <div style={{padding:'5px',display:'flex',flexDirection:'row'}}>
                                <Typography variant="h6">
                                    x:
                                </Typography>
                                <Input onBlur={this.editReadEvent} type="number" value={this.state.xCoord} onChange={(event)=>{this.setState({"xCoord":event.target.value})}}/>
                            </div>
                            <div style={{padding:'5px',display:'flex',flexDirection:'row'}}>
                                <Typography variant="h6">
                                    y:
                                </Typography>
                                <Input onBlur={this.editReadEvent} type="number" value={this.state.yCoord} onChange={(event)=>{this.setState({"yCoord":event.target.value})}}/>
                            </div>
                            <div style={{width:'50px',padding:'5px',display:'flex',flexDirection:'row'}}>
                                <Typography variant="h6">
                                    as
                                </Typography>
                                <Input style={{width:'40px'}} onBlur={this.editReadEvent} value={this.state.varName} onChange={(event)=>{this.setState({"varName":event.target.value})}}/>
                            </div>
                        </div>
                        <div className={'retake-button'}>
                            <Button onClick={this.retakeRead} variant={'contained'} color={'secondary'}>
                                Record read
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }
}

const mapDispatchToProps = dispatch => ({
    updateBot: (bot) => {dispatch(updateBot(bot))},
})

export default connect (null,mapDispatchToProps)(ReadCard)