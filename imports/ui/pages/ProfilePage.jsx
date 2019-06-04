import React from "react";
import { compose } from "recompose";

import { withStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";

import Dialog from "../components/Profile/Dialog";
import PageBase from "../components/PageBase";
import PersonalTable from "../components/Profile/PersonalTable";

import callWithPromise from "/imports/util/callWithPromise";

const styles = _theme => ({});

class ProfilePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            frontEndLevel: "",
            backEndLevel: "",
            dataLevel: "",
            name: ""
        };
    }

    handleChange = attribute => event => {
        this.setState({
            [attribute]: event.target.value
        });
    };

    handleSubmit = () => {
        if (this.state.name == "") {
            alert("Please enter your name.");
        } else {
            this.setState({ open: false });

            const para = {
                name: this.state.name,
                frontEndLevel: this.state.frontEndLevel,
                backEndLevel: this.state.backEndLevel,
                dataLevel: this.state.dataLevel,
                isApproved: true
            };

            callWithPromise("dataSet.create", para).then(() => {});
        }
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    render() {
        const {
            dataSets,
            dataSet,
            loading,
            classes,
            match,
            ...props
        } = this.props;
        var {
            name,
            frontEndLevel,
            backEndLevel,
            dataLevel,
            open
        } = this.state;

        return (
            <PageBase
                {...props}
                actionIcon={<AddIcon />}
                onAction={() => {
                    this.setState({ open: true });
                }}
            >
                <PersonalTable
                    name={dataSet.name}
                    frontEndLevel={dataSet.frontEndLevel}
                    backEndLevel={dataSet.backEndLevel}
                    dataLevel={dataSet.dataLevel}
                />
                <Dialog
                    name={name}
                    frontEndLevel={frontEndLevel}
                    backEndLevel={backEndLevel}
                    dataLevel={dataLevel}
                    open={open}
                    onClose={this.handleClose}
                    onChange={this.handleChange}
                    onSubmit={this.handleSubmit}
                />
            </PageBase>
        );
    }
}

export default compose(withStyles(styles))(ProfilePage);
