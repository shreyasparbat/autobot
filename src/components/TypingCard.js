import React from 'react'
import {
    Grid,
    Card,
    CardContent,
    Typography,
    Checkbox,
    FormGroup,
    FormControlLabel,
    TextField,
    Button
} from '@material-ui/core'
import Icon from '@material-ui/core/Icon';
import axios from 'axios'

// CSS import
import './css/TypingCard.css'

// Redux imports
import {connect} from 'react-redux'
import {updateBot} from '../actions/botAction'

class TypingCard extends React.Component {
    state = {
        checkedCtrl: this.props.checkboxesDict.ctrlleft,
        checkedAlt: this.props.checkboxesDict.altleft,
        checkedShift: this.props.checkboxesDict.shiftleft,
        checkedWin: this.props.checkboxesDict.winleft,
        text: this.props.text
    }
    pyURL = 'http://127.0.0.1:5000/'

    handleCheckboxChange = name => (event) => {
        this.setState({
            [name]: event.target.checked
        })
    }

    handleTextChange = text => (event) => {
        this.setState({
            [text]: event.target.value
        })
    }

    saveChanges = () => {
        const {start,end} = this.props;
        const {text} = this.state;
        let specialKeys = [];
        // for(let key in this.state){
        //     if(this.state[key] && key != 'text'){
        //         specialKeys.push(key);
        //     }
        // }
        const ifEvent = {
            id,
            start,
            end,
            text,
            specialKeys
        }
        axios.get(this.pyURL+'edit-typing-event/test',{params:{
            data: JSON.stringify(ifEvent)
        }}).then((reply)=>{
            this.props.updateBot(reply.data)
        })
    }

    componentDidMount = () => {
    }

    render() {
        const { subEvent,deleteSubEvent,deleteEvent,start,end} = this.props;
        return (
            <div className={'ui typing-card'}>
                <Card elevation={3}>
                    <Icon className={'delete-event-button'} onClick={subEvent ? deleteSubEvent : ()=>{deleteEvent(start,end)}}>
                        clear
                    </Icon>
                    <CardContent className={'content'}>
                        <Grid
                            container
                            spacing={0}
                            direction="column"
                            alignItems="center"
                            justify="center"
                        >
                            <div className={'title'}>
                                <Typography variant="h5" component="h2">
                                    Type
                                </Typography>
                            </div>
                            <div className={'checkboxes'}>
                                <FormGroup row>
                                    <FormControlLabel
                                        label={'Ctrl'}
                                        control={(
                                            <Checkbox
                                                checked={this.state.checkedCtrl}
                                                onChange={this.handleCheckboxChange('checkedCtrl')}
                                                value={'checkedCtrl'}
                                                color={'default'}
                                            />
                                        )}
                                    />
                                    <FormControlLabel
                                        label={'Alt'}
                                        control={(
                                            <Checkbox
                                                checked={this.state.checkedAlt}
                                                onChange={this.handleCheckboxChange('checkedAlt')}
                                                value={'checkedAlt'}
                                                color={'default'}
                                            />
                                        )}
                                    />
                                    <FormControlLabel
                                        label={'Shift'}
                                        control={(
                                            <Checkbox
                                                checked={this.state.checkedShift}
                                                onChange={this.handleCheckboxChange('checkedShift')}
                                                value={'checkedShift'}
                                                color={'default'}
                                            />
                                        )}
                                    />
                                    <FormControlLabel
                                        label={'Win'}
                                        control={(
                                            <Checkbox
                                                checked={this.state.checkedWin}
                                                onChange={this.handleCheckboxChange('checkedWin')}
                                                value={'checkedWin'}
                                                color={'default'}
                                            />
                                        )}
                                    />
                                </FormGroup>
                            </div>
                            <TextField
                                id="outlined-text"
                                label="Text"
                                value={this.state.text}
                                // onBlur={()=>{alert('hi!')}}
                                onChange={this.handleTextChange('text')}
                                margin="normal"
                                variant="outlined"
                                color={'inherit'}
                            />
                            <Button onClick={this.saveChanges} variant={'contained'} color={'secondary'}>
                                Change
                            </Button>
                        </Grid>
                    </CardContent>
                </Card>
            </div>
        )
    }
}

const mapDispatchToProps = dispatch => ({
    updateBot: (bot) => {dispatch(updateBot(bot))}
})

export default connect(null,mapDispatchToProps)(TypingCard)
