import React, { Component } from 'react';
import MediaQuery from 'react-responsive';

import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import MailIcon from '@material-ui/icons/Mail';

class ResponsiveDrawer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: true,
        }
    }

    componentDidMount () {

        // if the screen is not mobile, set the state to open drawer
        // you shouldn't be able to close the drawer from an open one on desktop

        // on mobile, you should open to see the small drawer
        // then, you can click on the menu icon to open the full drawer
        // once you click an option, the drawer should close and then load that tab
        // profile will need some refactoring

    }

    handleDrawerOpen = () => {
        this.setState({
            open: true
        })
    }

    handleDrawerClose = () => {
        this.setState({
            open: false,
        })
    }

    render() {
        return (
            <Drawer
                variant="permanent"
                className={this.state.open ? "drawer drawer-open" : "drawer drawer-closed" }
                open={this.state.open}
            >
                <MediaQuery maxWidth={768}>
                    <div>
                        {this.state.open 
                            ? <IconButton onClick={this.handleDrawerClose} style={{ float: 'right' }}>
                                <ChevronLeftIcon />
                              </IconButton>
                            : <IconButton onClick={this.handleDrawerOpen}>
                                <ChevronRightIcon/>
                              </IconButton>
                        }
                    </div>
                    <Divider style={{ width: '100%' }}/>
                </MediaQuery>        

                <List>
                {['Edit Profile', 'Stats', 'Notification Settings', "Security"].map((text, index) => (
                    <ListItem button key={text}>
                    <ListItemIcon><MailIcon /></ListItemIcon>
                    <ListItemText primary={text} />
                    </ListItem>
                ))}
                </List>
            </Drawer>
        )
    }
}

export default ResponsiveDrawer;