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
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

// Create component
export default class ActivitiesPane extends React.Component {
    state={
        variables:[],
        modalOpen:false
    }
    pyURL = 'http://127.0.0.1:5000/'
    // Define actions taken when activity is selected
    selectActivity(activityIndex) {
        console.log(activityIndex)
    }

    addVariable = () => {
        const {newVarName,newVarValue,newVarType} = this.state;
        this.setState({
            variables: [
                ...this.state.variables,
                {
                    name:newVarName,
                    value:newVarValue ? newVarValue : null,
                    type:newVarType
                }
            ]
        },()=>{
            const newVar = {
                "name": newVarName,
                "value": newVarValue,
                "type": newVarType
            }
            axios.get(this.pyURL+'add-variable/'+this.props.botName,{params:{
                newVar: JSON.stringify(newVar)
            }}).then((reply)=>{
                console.log('success!');
            })
            this.setState({
                newVarName:'',
                newVarValue:'',
                newVarType:'',
            })
        })
    }

    handleChange = event => {
        this.setState({ newVarType: event.target.value });
    };

    componentDidMount(){
        axios.get(this.pyURL + 'load-steps/' + this.props.botName).then((reply) => {
            this.setState({
                variables: reply.data.variables
            })
        })
        .catch(err=>{
            console.log(err)
        })
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
                    <List>
                        {['Mouse Click', 'Type'].map((text, index) => (
                            <ListItem
                                button
                                key={text}
                                onClick={() => this.selectActivity(index)}
                            >
                                <ListItemText primary={text} />
                            </ListItem>
                        ))}
                    </List>
                    <List style={{position:'absolute',bottom:0}}>
                        <ListSubheader>
                            <ListItemText primary='Variables' />
                        </ListSubheader>
                        {this.state.variables.map((variable, index) => (
                            <ListItem
                                key={variable.name}
                                onClick={() => this.selectActivity(index)}
                            >
                                <ListItemText primary={variable.name+'='} />
                                <Input defaultValue={variable.value}/>
                            </ListItem>
                        ))}
                        <ListItem
                            style={{display: 'flex',
                              flexDirection: 'column',
                              padding: 0}}
                        >
                            <Input placeholder='Name' value={this.state.newVarName} onChange={(event)=>{this.setState({newVarName:event.target.value})}}/>
                            <Input placeholder='Value 'value={this.state.newVarValue} onChange={(event)=>{this.setState({newVarValue:event.target.value})}}/>
                            <Select
                            value={this.state.newVarType ? this.state.newVarType : 'string'}
                            onChange={this.handleChange}
                            input={<Input name="name" id="name-disabled" />}
                            >
                                <MenuItem value="string">string</MenuItem>
                                <MenuItem value="number">number</MenuItem>
                                <MenuItem value="array">array</MenuItem>
                            </Select>
                            <Button onClick={this.addVariable}>
                                +
                            </Button>
                        </ListItem>
                    </List>
                </Drawer>
                <Modal open={this.state.modalOpen}/>
            </div>
        )
    }
}
