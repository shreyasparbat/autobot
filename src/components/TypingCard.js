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
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Input from '@material-ui/core/Input';
import Snackbar from '@material-ui/core/Snackbar';

// CSS import
import './css/TypingCard.css'

// Redux imports
import {connect} from 'react-redux'
import {updateBot} from '../actions/botAction'

/**
 *  TypingCard.js
 *      Renders the Typing event
 *      Rendered in WorkflowPanel.js
 *                  LoopCard.js
 *                  IfCard.js
 *
 *      Props:
 *          start (Number: represents the start index of the typing event in its respective events array)(required)
 *          end (Number: represents the end index of the typing event in its respective events array)(required)
 *          event (Obj: represents the typing event)(required)
 *          text (String: represents the resultant text rendered in the text box)(required)
 *          deleteEvent (Function: Function to delete this event from the bot)(required)
 *          checkboxesDict (Obj: object which represents which special keys are checked)(required)
 *          parent (String: id which represents the parent event if there is any)(as required)
 *          field (String: represents the field of the parent event that it belongs to)(as required)
 */

class TypingCard extends React.Component {
    state = {
        checkedCtrl: this.props.checkboxesDict.ctrlleft,
        checkedAlt: this.props.checkboxesDict.altleft,
        checkedShift: this.props.checkboxesDict.shiftleft,
        checkedWin: this.props.checkboxesDict.winleft,
        text: this.props.text,
        variable: this.props.event.variable,
        tabValue: this.props.text ? 0 : 1,
        snackbarOpen: false,
    }
    pyURL = 'http://127.0.0.1:5000/'

    handleCheckboxChange = name => (event) => {
        this.setState({
            [name]: event.target.checked
        })
    }

    handleTabChange = (event, value) => {
        this.setState({ tabValue:value });
    }

    handleTextChange = text => (event) => {
        this.setState({
            [text]: event.target.value
        })
    }

    saveChanges = () => {
        const {start,end,parent,field} = this.props;
        const {text,variable,tabValue} = this.state;
        let specialKeys = [];
        // for(let key in this.state){
        //     if(this.state[key] && key != 'text'){
        //         specialKeys.push(key);
        //     }
        // }
        let typingEvent;
        if(tabValue == 0){
            // Typing event is raw text
            typingEvent = {
                start,
                end,
                text,
                specialKeys,
                parent,
                field
            }
        } else {
            // Typing event is a variable
            typingEvent = {
                start,
                end,
                specialKeys,
                variable,
                parent,
                field
            }
        }
        axios.get(this.pyURL+'edit-typing-event/test',{params:{
            ...typingEvent
        }}).then((reply)=>{
            this.props.updateBot(reply.data)
            if(!this.state.snackbarOpen){
                this.setState({
                    snackbarOpen:true
                })                
            }
        })
    }

    componentDidMount = () => {
    }

    render() {
        const { deleteEvent,start,end} = this.props;
        return (
            <div className={'ui typing-card'}>
                <Card elevation={3}>
                    <Icon className={'delete-event-button'} onClick={deleteEvent}>
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
                            <Tabs value={this.state.tabValue} onChange={this.handleTabChange}>
                                <Tab label="Text" />
                                <Tab label="Variable" />
                            </Tabs>
                            {
                                this.state.tabValue === 0 &&
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
                            }
                            {
                                this.state.tabValue === 1 && 
                                <Select
                                    className={'variables-dropdown'}
                                    value={this.state.variable ? this.state.variable : ''}
                                    onChange={(event)=>{
                                        this.setState({
                                            variable:event.target.value
                                        })
                                    }}
                                    input={<Input name="name" id="name-disabled" />}
                                >
                                {
                                    this.props.bot.variables.map((variable,index)=>{
                                        return(
                                            <MenuItem key={variable.name} value={variable.name}>{variable.name}</MenuItem>
                                        )
                                    })
                                }
                                </Select>
                            }
                            <Button onClick={this.saveChanges} variant={'contained'} color={'secondary'}>
                                Change
                            </Button>
                        </Grid>
                    </CardContent>
                </Card>
                <Snackbar
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                  open={this.state.snackbarOpen}
                  autoHideDuration={3000}
                  onClose={()=>{this.setState({snackbarOpen:false})}}
                  ContentProps={{
                    'aria-describedby': 'message-id',
                  }}
                  message={<span id="message-id">Changes saved!</span>}
                />
            </div>
        )
    }
}

const mapStateToProps = state => ({
    bot: state.botReducer.bot
})
const mapDispatchToProps = dispatch => ({
    updateBot: (bot) => {dispatch(updateBot(bot))}
})

export default connect(mapStateToProps,mapDispatchToProps)(TypingCard)
