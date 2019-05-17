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
        text: this.props.text,
        variable: this.props.event.variable,
        tabValue: this.props.text ? 0 : 1,
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
            typingEvent = {
                start,
                end,
                text,
                specialKeys,
                parent,
                field
            }
        } else {
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
                                    className={'if-card-option'}
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
