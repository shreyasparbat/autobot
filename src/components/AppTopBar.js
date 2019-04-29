// Library imports
import React from 'react'
import axios from 'axios'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'

// Define component
export default class AppTopBar extends React.Component {
    render() {
        const pyURL = 'http://127.0.0.1:5000/'
        return (
            <div>
                <AppBar position="static" color={'primary'}>
                    <Toolbar>
                        <Button
                            color="inherit"
                            onClick={() => axios.get(pyURL + 'record/' + this.props.botName)}
                        >
                            Record
                        </Button>
                        <Button
                            color="inherit"
                            onClick={() => axios.get(pyURL + 'play/' + this.props.botName)}
                        >
                            Play
                        </Button>
                    </Toolbar>
                </AppBar>
            </div>
        )
    }
}
