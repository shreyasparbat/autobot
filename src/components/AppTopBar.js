// Library imports
import React from 'react'
import axios from 'axios'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'

// Define component
export default class AppTopBar extends React.Component {
    render() {
        return (
            <div>
                <AppBar position="static" color={'primary'}>
                    <Toolbar>
                        <Button
                            color="inherit"
                            onClick={() => console.log(process.env.PYURL + '/record?bot_name:' + this.props.botName)}
                        >
                            Record
                        </Button>
                        <Button
                            color="inherit"
                            onClick={() => axios.get(process.env.PYURL + '/play?bot_name:' + this.props.botName)}
                        >
                            Play
                        </Button>
                    </Toolbar>
                </AppBar>
            </div>
        )
    }
}
