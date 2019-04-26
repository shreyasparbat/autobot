// Library imports
import React from 'react'

// Custom component imports
import ActivitiesPane from './ActivitiesPane'
import AppTopBar from './AppTopBar'

// CSS import


// Define App component
export default class App extends React.Component {
    render() {
        return (
            <div className={'ui root'}>
                <div className={'ui activitiesPane'}>
                    <ActivitiesPane />
                </div>
                <div className={'ui appTopBar'}>
                    <AppTopBar />
                </div>
            </div>
        )
    }
}
