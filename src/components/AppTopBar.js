// Library imports
import React from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'

// Custom imports
import { invokeRecorder, invokePlayer } from '../pyAutomation/automator'

export default class AppTopBar extends React.Component {
    render() {
        return (
            <div>
                <AppBar position="static" color="default">
                    <Toolbar>
                        <Button
                            color="inherit"
                            onClick={() => invokeRecorder(this.props.botName)}
                        >
                            Record
                        </Button>
                        <Button
                            color="inherit"
                            onClick={() => invokePlayer(this.props.botName)}
                        >
                            Play
                        </Button>
                    </Toolbar>
                </AppBar>
            </div>
        )
    }
}
