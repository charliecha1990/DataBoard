import React from "react";
import { Route } from "react-router";
import { withTracker } from "meteor/react-meteor-data";

import User from "/imports/api/users/User";
import callWithPromise from "/imports/util/callWithPromise";

import PageBase from "../components/PageBase";
import AdminTab from "../components/admin/AdminTab";
import Loading from "../components/Loading";
import RejectDialog from "../components/admin/RejectDialog";
import { Provider } from "../helpers/Context";
import Message from '../components/message/Message'
import Grid from "@material-ui/core/Grid";
import { requiredSubselectionMessage } from "graphql/validation/rules/ScalarLeafs";

class AdminPage extends React.Component {
  constructor(props){
    super(props);
    
    this.state = {
      rejectDialogOpen: false,
      notice: "",
      message: '',
      open: false,
      type: ''
    };

    this.handleApprove = this.handleApprove.bind(this);
    this.handleReject = this.handleReject.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }
 
  handleApprove = (id,name) => {
    event.preventDefault();
    let params= { userId: id }

    callWithPromise("dataSet.approve", params)
      .then(error => this.props.pushMessage(error));

    this.pushMessage(`${name}'s request has been approved`, 'success')

    // this.props.pushMessage(<Message type={{success: true}} message={`${name}'s request has been approved`}/>);
  };

  handleReject = (id,name) => {
    event.preventDefault();
    let params= { userId: id }

    callWithPromise("dataSet.reject", params)
      // .then(error => this.props.pushMessage(<Message message={error} type='error'/>));
      .then(error => this.props.pushMessage(error));

    this.pushMessage(`${name}'s request has been rejected`, 'error')

    // this.props.pushMessage(<Message type={{warning: true}} message={`${name}'s request has been rejected`}/>);
  };


  pushMessage = (message, type) => {
    this.setState({
      message,
      type,
      open: true
    })
  }

  handleClose = () => {
    this.setState({
      open: false
    })
  }

  /******************************** Event handlers for reject dialog   *******************************/

  handleRejectDialogClose = () => {
    this.setState({ rejectDialogOpen: false });
  };

  handleSendRejection = reason => {
    this.setState({ rejectDialogOpen: false, notice: reason });
  };

  handleNoticeChange = event => {
    this.setState({ notice: event.target.value });
  };

  /********************************************************************************/

  render() {
    const {
      users,
      showRemoved,
      dataSets,
      requestArray,
      loading,
      requestHistory,
      classes,
      match, 
      frontendSkills, 
      backendSkills, 
      dataSkills,
      ...props
    } = this.props;
    const { rejectDialogOpen, notice, message, type, open } = this.state;

    if (loading) {
      return <PageBase {...props}><Loading /></PageBase>;
    }

    return (
      <PageBase {...props}>
        <Provider value={this.state.notice}>
          <Grid container justify="center">
            <Grid item xs={12}>
              <AdminTab
                requestArray={requestArray}
                onApprove={this.handleApprove}
                onReject={this.handleReject}
                frontendSkills={frontendSkills} 
                backendSkills={backendSkills} 
                dataSkills={dataSkills}
                dataSets={dataSets}
              />
              <RejectDialog
                open={rejectDialogOpen}
                notice={notice}
                onClose={this.handleRejectDialogClose}
                onSend={this.handleSendRejection}
                onNoticeChange={this.handleNoticeChange}
              />
              {this.state.open && <Message open={open} onClose={this.handleClose} message={message} type={type}/>}
            </Grid>
          </Grid>
        </Provider>
      </PageBase>
    );
  }
}

export default withTracker(() => {
  const usersHandle = Meteor.subscribe("users.all", { includeDeleted: true });

  return {
    loading: !usersHandle.ready(),
    users: User.find(
      {},
      {
        disableEvents: true
      }
    ).fetch()
  };
})(AdminPage);
