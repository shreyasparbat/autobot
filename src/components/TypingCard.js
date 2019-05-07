import React from 'react'
import {
    Grid,
    Card,
    CardContent,
    Typography,
    Checkbox,
    FormGroup,
    FormControlLabel,
    TextField,
    Button
} from '@material-ui/core'

// CSS import
import './css/TypingCard.css'

export default class TypingCard extends React.Component {
    state = {
        checkedCtrl: this.props.checkboxesDict.ctrlleft,
        checkedAlt: this.props.checkboxesDict.altleft,
        checkedShift: this.props.checkboxesDict.shiftleft,
        checkedWin: this.props.checkboxesDict.winleft,
        text: this.props.text
    }

    handleCheckboxChange = name => (event) => {
        this.setState({
            [name]: event.target.checked
        })
    }

    handleTextChange = text => (event) => {
        this.setState({
            [text]: event.target.value
        })
    }

    render() {
        return (
            <div className={'ui typing-card'}>
                <Card elevation={3}>
                    <Button onClick={this.props.deleteCard} variant={'contained'} color={'secondary'}>
                        X
                    </Button>
                    <CardContent className={'content'}>
                        <Grid
                            container
                            spacing={0}
                            direction="column"
                            alignItems="center"
                            justify="center"
                        >
                            <div className={'title'}>
                                <Typography variant="h5" component="h2">
                                    Type
                                </Typography>
                            </div>
                            <div className={'checkboxes'}>
                                <FormGroup row>
                                    <FormControlLabel
                                        label={'Ctrl'}
                                        control={(
                                            <Checkbox
                                                checked={this.state.checkedCtrl}
                                                onChange={this.handleCheckboxChange('checkedCtrl')}
                                                value={'checkedCtrl'}
                                                color={'default'}
                                            />
                                        )}
                                    />
                                    <FormControlLabel
                                        label={'Alt'}
                                        control={(
                                            <Checkbox
                                                checked={this.state.checkedAlt}
                                                onChange={this.handleCheckboxChange('checkedAlt')}
                                                value={'checkedAlt'}
                                                color={'default'}
                                            />
                                        )}
                                    />
                                    <FormControlLabel
                                        label={'Shift'}
                                        control={(
                                            <Checkbox
                                                checked={this.state.checkedShift}
                                                onChange={this.handleCheckboxChange('checkedShift')}
                                                value={'checkedShift'}
                                                color={'default'}
                                            />
                                        )}
                                    />
                                    <FormControlLabel
                                        label={'Win'}
                                        control={(
                                            <Checkbox
                                                checked={this.state.checkedWin}
                                                onChange={this.handleCheckboxChange('checkedWin')}
                                                value={'checkedWin'}
                                                color={'default'}
                                            />
                                        )}
                                    />
                                </FormGroup>
                            </div>
                            <TextField
                                id="outlined-text"
                                label="Text"
                                value={this.state.text}
                                onChange={this.handleTextChange('text')}
                                margin="normal"
                                variant="outlined"
                                color={'inherit'}
                            />
                            <Button variant={'contained'} color={'secondary'}>
                                Change
                            </Button>
                        </Grid>
                    </CardContent>
                </Card>
            </div>
        )
    }
}
