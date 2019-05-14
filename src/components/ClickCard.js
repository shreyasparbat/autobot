// Library imports
import React from 'react'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import axios from 'axios'

// Other imports
import './css/ClickCard.css'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Icon from '@material-ui/core/Icon'

export default class ClickCard extends React.Component {
    // Retake mouse click
    pyURL = 'http://127.0.0.1:5000/'

    // onDrag = (event) => {
    //     event.preventDefault();
    //     this.setState({
    //         draggedTask: 'hi'
    //     });
    // }

    // onDragOver = (event) => {
    //   event.preventDefault();
    // }
    // onDrop = (event ) => {
    //     // const { completedTasks, draggedTask, todos } = this.state;
    //     // this.setState({
    //     //     completedTasks: [...completedTasks, draggedTask],
    //     //     todos: todos.filter(task => task.taskID !== draggedTask.taskID),
    //     //     draggedTask: {},
    //     // });
    //     alert('hi!');
    // }

    render() {
        const { subEvent,deleteSubEvent,deleteEvent} = this.props;
        return (
            <div 
                // draggable 
                // onDrag={(event) => this.onDrag(event)} 
                // onDragOver={(event => this.onDragOver(event))}
                // onDrop={event => this.onDrop(event)}
                className={'ui click-card'}
            >
                <Card elevation={3}>
                    <Icon className={'delete-event-button'} onClick={subEvent ? deleteSubEvent : deleteEvent}>
                        clear
                    </Icon>
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
