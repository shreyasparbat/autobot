// Library imports
import React from 'react'

// Custom component imports
import ActivitiesPane from './ActivitiesPane'
import AppTopBar from './AppTopBar'
import WorkflowPanel from './WorkflowPanel'

// CSS import
import './css/App.css'

// Define App component
export default class App extends React.Component {
    // TODO: Get botName from previous window
    botName = 'test'

    render() {
        return (
            <div className={'ui root'}>
                <div className={'ui activities-pane'}>
                    <ActivitiesPane />
                </div>
                <div className={'ui app-top-bar'}>
                    <AppTopBar botName={this.botName} />
                </div>
                <div className={'ui workflow-panel'}>
                    <WorkflowPanel botName={this.botName}/>
                </div>
            </div>
        )
    }
}
