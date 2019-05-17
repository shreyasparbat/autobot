// Library imports
import React from 'react'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import axios from 'axios'

// Other imports
import './css/ClickCard.css'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Icon from '@material-ui/core/Icon'
import Input from '@material-ui/core/Input'


export default class ClickCard extends React.Component {
    // Retake mouse click
    pyURL = 'http://127.0.0.1:5000/'

    constructor(props){
        super(props)
        this.state = {
            xCoord: props.event.position[0],
            yCoord: props.event.position[1]
        }
    }

    editClickEvent = () => {

    }

    recordClickEvent = () => {
        const { start ,end , parent, field } = this.props
        axios.get(this.pyURL+'record-click-event/test',{params:{
            start,
            end,
            parent,
            field
        }}).then((reply)=>{
            console.log(reply)
        })
    }

    render() {
        const {event,deleteEvent} = this.props;
        return (
            <div 
                className={'ui click-card'}
            >
                <Card elevation={3}>
                    <Icon className={'delete-event-button'} onClick={deleteEvent}>
                        clear
                    </Icon>
                    <CardContent className={'content'}>
                        <div className={'title'}>
                            <Typography variant="h5" component="h2">
                                Click
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
                        </div>
                        <div className={'retake-button'}>
                            <Button onClick={this.recordClickEvent} variant={'contained'} color={'secondary'}>
                                {event.position[0] == 0 && event.position[1] == 0 ? 'Record Click' : 'Retake Click'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }
}
