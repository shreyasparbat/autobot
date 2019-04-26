// Library imports
import React from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'

export default class AppTopBar extends React.Component {
    render() {
        return (
            <div>
                <AppBar position="static" color="default">
                    <Toolbar>
                        <Button color="inherit">Record</Button>
                        <Button color="inherit">Play</Button>
                    </Toolbar>
                </AppBar>
            </div>
        )
    }
}