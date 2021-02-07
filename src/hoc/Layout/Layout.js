import React, {Component} from "react";
import MenuToggle from "../../components/Navigation/MenuToggle/MenuToggle";
import Drawer from "../../components/Navigation/Drawer/Drawer";
import classes from "./Layout.css";
import {connect} from "react-redux";


class Layout extends Component {
    state = {
        menu: false
    }

    toggleMenuHandler = () => {
        this.setState({
            menu: !this.state.menu
        })
    }

    menuCloseHandler = () => {
        this.setState({
            menu: false
        })
    }


    render() {

        let page = (
            <div className={classes.Layout}>
                <main>
                    {this.props.children}
                </main>
            </div>
        )

        if (this.props.isAuthenticated) {
            page = (
                <div className={classes.Layout}>
                    <Drawer
                        isOpen={this.state.menu}
                        onClose={this.menuCloseHandler}
                        isAuthenticated={this.props.isAuthenticated}
                    />
                    <MenuToggle
                        onToggle={this.toggleMenuHandler}
                        isOpen={this.state.menu}
                    />
                    <main>
                        {this.props.children}
                    </main>
                </div>
            )
        }

        return (
            <div className={classes.Layout}>
                {page}
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        isAuthenticated: !!state.auth.token
    }
}

export default connect(mapStateToProps)(Layout);