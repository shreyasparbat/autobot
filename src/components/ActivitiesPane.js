// Library imports
import React from 'react'
import axios from 'axios'
import Drawer from '@material-ui/core/Drawer'
import Divider from '@material-ui/core/Divider'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListSubheader from '@material-ui/core/ListSubheader';
import Input from '@material-ui/core/Input';
import Icon from '@material-ui/core/Icon';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card'
import {Draggable} from 'react-drag-and-drop'

// Redux imports
import {updateBot} from '../actions/botAction'
import {connect} from 'react-redux'

// CSS import
import './css/ActivitiesPane.css'

// Create component
class ActivitiesPane extends React.Component {
    state = {
        newVarName:'',
        newVarValue:''
    }
    pyURL = 'http://127.0.0.1:5000/'
    // Define actions taken when activity is selected

    componentWillMount(){
        // console.log(this.props.bot.variables)
    }
    selectActivity(type) {
        axios.get(this.pyURL+'add-event/'+this.props.botName,{params:{
            type
        }}).then(reply=>{
            this.props.updateBot(reply.data)
        })
    }

    addVariable = () => {
        const {newVarName,newVarValue = '',newVarType='string'} = this.state;
        if(newVarName){ //Variable must have a name
            if(!this.props.bot.variables.find(e=>{
                return e.name == newVarName
            })){
                axios.get(this.pyURL+'add-variable/'+this.props.botName,{params:{
                    "name":newVarName,
                    "value":newVarValue,
                    "type":newVarType
                }}).then((reply)=>{
                    this.props.updateBot(reply.data)
                })
                this.setState({
                    newVarName:'',
                    newVarValue:'',
                    newVarType:'',
                })                      
            }
        } else {
            alert('Please give your variable a name!')
        }
    }

    deleteVariable = (index) => {
        axios.get(this.pyURL+'delete-variable/'+this.props.botName,{params:{
            index
        }}).then((reply)=>{
            this.props.updateBot(reply.data)
        })
    }

    editVariable = (name,curValue,newValue) => {
        // Only make request if newValue is different from currentValue
        if(curValue != newValue){
            axios.get(this.pyURL+'edit-variable/'+this.props.botName,{params:{
                "name":name,
                "newValue":newValue,
            }}).then((reply)=>{
                this.props.updateBot(reply.data)
            })            
        }
    }



    render() {
        return (
            <div>
                <Drawer
                    variant="permanent"
                    anchor="left"
                    open
                >
                    <div />
                    <Divider />
                    {/* Activities List */}
                    <List className={'activity-list'}>
                        <ListSubheader className={'list-header'} >
                            <ListItemText primary={
                                <Typography variant="h5" className={'list-header-text'}>Activities</Typography>
                            }/>
                        </ListSubheader>
                        {['Mouse Click', 'Type', 'If','Loop','Read'].map((text, index) => (
                            <Draggable type="activity" data={text}>
                                <ListItem
                                    button
                                    key={text}
                                    onClick={() => this.selectActivity(text.toLowerCase())}
                                >
                                    <ListItemText primary={text} />
                                </ListItem>
                            </Draggable>
                        ))}
                    </List>
                    <Divider />
                    {/* Variables List */}
                    <List className={'variable-list'}>
                        <ListSubheader className={'list-header'}>
                            <ListItemText primary={
                                <Typography variant="h5" className={'list-header-text'}>Variables</Typography>
                            }/>
                        </ListSubheader>
                        {this.props.bot.variables.map((variable, index) => (
                            <ListItem
                                style={{flexDirection:'row',display:'flex'}}
                                key={variable.name}
                                onClick={() => this.selectActivity(index)}
                            >
                                <ListItemText style={{padding:'0',textAlign:'right',width:'75px','wordBreak':'break-all'}} primary={variable.name} />
                                <ListItemText primary={'='} />
                                <Input  style={{width:'50px'}} onBlur={(event)=>{this.editVariable(variable.name,variable.value,event.target.value)}} defaultValue={variable.value}/>
                                <Button onClick={()=>{this.deleteVariable(index)}}>
                                    <Icon style={{color:'red'}}>
                                        clear
                                    </Icon>
                                </Button>
                            </ListItem>
                        ))}
                        <ListItem>
                            <Card className={'add-variable-input'}>
                                <Typography variant="h6" >Add Variable</Typography>
                                <Input placeholder='Name' value={this.state.newVarName} onChange={(event)=>{this.setState({newVarName:event.target.value})}}/>
                                <Input placeholder='Value 'value={this.state.newVarValue} onChange={(event)=>{this.setState({newVarValue:event.target.value})}}/>
                                <Select
                                    value={this.state.newVarType ? this.state.newVarType : "string"}
                                    onChange={(event)=>{this.setState({ newVarType: event.target.value })}}
                                    input={<Input name="name" id="name-disabled" />}
                                >
                                    <MenuItem value="string">string</MenuItem>
                                    <MenuItem value="number">number</MenuItem>
                                    <MenuItem value="array">array</MenuItem>
                                </Select>
                                <Button onClick={this.addVariable}>
                                    <Icon>
                                        add
                                    </Icon>
                                </Button>
                            </Card>
                        </ListItem>
                    </List>
                </Drawer>
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
export default connect(mapStateToProps,mapDispatchToProps)(ActivitiesPane);
