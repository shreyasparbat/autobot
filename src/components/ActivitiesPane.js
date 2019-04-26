// Library imports
import React from 'react'
import Drawer from '@material-ui/core/Drawer'
import Divider from '@material-ui/core/Divider'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'

// Create component
export default class ActivitiesPane extends React.Component {
    // Define actions taken when activity is selected
    selectActivity(activityIndex) {
        console.log(activityIndex)
    }

    render() {
        return (
            <div>
                <Drawer
                    variant="permanent"
                    anchor="left"
                    open
                >
                    <div />
                    <Divider />
                    <List>
                        {['Mouse Click', 'Type'].map((text, index) => (
                            <ListItem
                                button
                                key={text}
                                onClick={() => this.selectActivity(index)}
                            >
                                <ListItemText primary={text} />
                            </ListItem>
                        ))}
                    </List>
                </Drawer>
            </div>
        )
    }
}
