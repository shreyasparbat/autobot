// Library imports
import React from 'react'
import axios from 'axios'

// Custom component imports
import ActivitiesPane from './ActivitiesPane'
import AppTopBar from './AppTopBar'
import WorkflowPanel from './WorkflowPanel'

// CSS import
import './css/App.css'

// Redux imports
import {updateBot} from '../actions/botAction.js';
import { connect } from 'react-redux';

// Define App component
class App extends React.Component {
    // TODO: Get botName from previous window
    botName = 'test'
    pyURL = 'http://127.0.0.1:5000/'

    componentDidMount(){
        axios.get(this.pyURL + 'load-steps/' + this.botName).then((reply) => {
            // console.log(reply.data);
            this.props.updateBot(reply.data)
        })
        .catch(err=>{
            console.log(err)
        })
    }

    render() {
        return (
            <div className={'ui root'}>
                <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons"/>
                <div className={'ui activities-pane'}>
                    <ActivitiesPane botName={this.botName} />
                </div>
                <div className={'ui app-top-bar'}>
                    <AppTopBar botName={this.botName} />
                </div>
                <div className={'ui workflow-panel'}>
                    <WorkflowPanel botName={this.botName} />
                </div>
            </div>
        )
    }
}

const mapDispatchToProps = dispatch => ({
    updateBot: (bot) => dispatch(updateBot(bot))
})

export default connect(null, mapDispatchToProps)(App);
