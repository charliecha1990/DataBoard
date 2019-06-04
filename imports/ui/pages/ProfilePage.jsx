import React from "react";
import { withRouter } from "react-router-dom";
import { compose } from "recompose";
import { withTracker } from "meteor/react-meteor-data";

import { withStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";

import Dialog from "../components/Profile/Dialog";
import PageBase from "../components/PageBase";
import PersonalTable from "../components/Profile/PersonalTable";

import DataSet from "/imports/api/dataSet/DataSet";
import callWithPromise from "/imports/util/callWithPromise";
import { withMessageContext } from "/imports/ui/helpers/MessageContext";
import DataSets from "../../api/dataSet/DataSet";

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

    componentWillMount() {
        const dataSetsHandle = Meteor.subscribe("dataSets");

        var dataSet = DataSet.find(
            { userId: Meteor.userId() },
            { sort: { createdAt: -1 }, limit: 1 }
        ).fetch();
        dataSet = dataSet.length == 0 ? "" : dataSet[0];
        var dataSets = DataSet.find({}).fetch();

        this.setState({
            frontEndLevel: dataSet.frontEndLevel,
            backEndLevel: dataSet.backEndLevel,
            dataLevel: dataSet.backEndLevel,
            name: dataSet.name
        });
        console.log("mounted");
    }

    handleChange = attribute => event => {
        this.setState({
            [attribute]: event.target.value
        });
    };

    handleSubmit = () => {
        // Alert when name is empty
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
            console.log(this.state);

            callWithPromise("dataSet.create", para)
                .then(id => console.log(id))
                .then(() => {});
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

        console.log(dataSets, dataSet, this.state);

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
// export default compose(
//     withRouter,
//     withTracker(() => {
//         const dataSetsHandle = Meteor.subscribe("dataSets");

//         var dataSet = DataSet.find(
//             { userId: Meteor.userId() },
//             { sort: { createdAt: -1 }, limit: 1 }
//         ).fetch();
//         dataSet = dataSet.length == 0 ? "" : dataSet[0];
//         var dataSets = DataSet.find({}).fetch();

//         console.log(
//             "userID: " + Meteor.userId(),
//             "my exported dataSet:",
//             dataSet
//         );

//         return {
//             dataSet,
//             dataSets,
//             connected: Meteor.status().connected,
//             loading: !dataSetsHandle.ready()
//         };
//     }),
//     withMessageContext,
//     withStyles(styles)
// )(ProfilePage);
