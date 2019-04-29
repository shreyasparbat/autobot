// Library imports
import React from 'react'
import Paper from '@material-ui/core/Paper'

// Custom component imports
import ClickCard from './ClickCard'
import TypingCard from './TypingCard'
import './css/WorkflowPanel.css'
import ArrowDown from './css/ArrowDown.svg'

export default class WorkflowPanel extends React.Component {
    render() {
        return (
            <div>
                <Paper elevation={3}>
                    <ClickCard />
                    <div className={'arrow-down'}>
                        <img src={ArrowDown} alt={'arrow-down'} />
                    </div>
                    <TypingCard />
                </Paper>
            </div>
        )
    }
}
