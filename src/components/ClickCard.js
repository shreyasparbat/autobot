// Library imports
import React from 'react'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import axios from 'axios'

// Other imports
import './css/ClickCard.css'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'

export default class ClickCard extends React.Component {
    // Retake mouse click
    pyURL = 'http://127.0.0.1:5000/'

    render() {
        const { subEvent,deleteSubEvent,deleteEvent} = this.props;
        return (
            <div className={'ui click-card'}>
                <Card elevation={3}>
                    <Button onClick={subEvent ? deleteSubEvent : deleteEvent} variant={'contained'} color={'secondary'}>
                        X
                    </Button>
                    <CardContent className={'content'}>
                        <div className={'title'}>
                            <Typography variant="h5" component="h2">
                                Click
                            </Typography>
                        </div>
                        <div className={'retake-button'}>
                            <Button variant={'contained'} color={'secondary'}>
                                Retake Click
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }
}
