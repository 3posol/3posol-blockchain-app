/*
    author: Alexander Zolotov
*/

import React, { Component } from 'react';
import { withCookies, Cookies } from 'react-cookie';

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router-dom'

import PropTypes from 'prop-types';

import {Icon} from 'react-fa'

import Axios from 'axios'

import ConfigMain from '~/configs/main'

import TasksWidget from '~/src/theme/components/TasksWidget'

import DetailsPopup from '~/src/components/common/DetailsPopup';

import "~/src/theme_new/css/common.css"
import "~/src/theme_new/css/tasksManagement.css"

import {
  setTasks,
  fetchTasksInitiate,
  fetchTasksComplete,
} from '~/src/redux/actions/tasks'

import {
  openSignUpForm,
} from '~/src/redux/actions/authorization'


const BackendURL = ConfigMain.getBackendURL();

const TaskCategoryYour = {
  type: "my_tasks",
  name: "Your tasks"
};

const TaskCategoryOther = {
  type: "other_tasks",
  name: "Other tasks"
};

const TaskCategoryAssign = {
  type: "assign_tasks",
  name: "Assign tasks"
};

class TaskManagement extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      tasksCategory: TaskCategoryYour,
      scannerQuery: "",
    }
  }

  handleChange(e) {
    e.preventDefault();
    this.setState({scannerQuery: e.target.value});
  }

  storeAndFetchTasks() {
    const { cookies } = this.props;
    const lastViewedRoadmap = cookies.get('lastViewedRoadmap');

    if (this.props.userProfile._id && lastViewedRoadmap) {

      this.createAndSaveNewTask(lastViewedRoadmap);
      cookies.remove('lastViewedRoadmap');
    }
    else {
      this.props.onFetchAllTasks(true);
    }
  }

  componentWillMount() {
    this.storeAndFetchTasks();
  }

  componentDidUpdate(prevProps, prevState) {
    console.log("componentDidUpdate prevProps.userProfile._id: " + prevProps.userProfile._id);
    console.dir(this.props.userProfile);
    if (!prevProps.userProfile._id && this.props.userProfile._id) {
      console.log("!prevProps.userProfile._id && this.props.userProfile._id");
      this.selectCategory("my_tasks");
      this.storeAndFetchTasks();
    }
  }

  selectCategory(newCategoryType) {
    let newCategory = {};

    if (newCategoryType == "my_tasks") {
      newCategory = TaskCategoryYour;
    }
    else if (newCategoryType == "assign_tasks") {
      newCategory = TaskCategoryAssign;
    }
    else {
      newCategory = TaskCategoryOther;
    }

    let copy = Object.assign({}, this.state, {tasksCategory: newCategory});
    this.setState(copy);
  }

  createAndSaveNewTask(roadmap) {
    //TODO: Move this to Redux
    console.log("TaskManagement::createAndSaveNewTask");
    this.props.fetchTasksInitiate();
    let userName = `${this.props.userProfile.firstName} ${this.props.userProfile.lastName}`;
    const url = `${BackendURL}/taskSave?userID=${this.props.userProfile._id}
    &userName=${userName}&type=${'find_mentor'}&roadmapID=${roadmap.id}&roadmapName=${roadmap.name}&isHidden=0`;

    Axios.get(url)
    .then((response) =>this.handleSaveNewTaskSuccess(response))
    .catch((error) =>this.handleSaveNewTaskError(error));
  }

  handleSaveNewTaskSuccess(response) {
    console.log("TaskManagement::handleSaveNewTaskSuccess");
    console.dir(response.data);
    this.props.fetchTasksComplete();
    this.props.onFetchAllTasks(true);
  }

  handleSaveNewTaskError(error) {
    this.props.fetchTasksComplete();
    this.props.onFetchAllTasks(true);
  }
  
  handleOpenConfirmTaskDetailsPopup(item){
    console.log(item);
    let copy = Object.assign({}, this.state, {isDetailsPopupOpen: true,detailsPopupItem: item});
    this.setState(copy)
  }

  handleCloseConfirmTaskDetailsPopup(item) {
    let copy = Object.assign({}, this.state, {isDetailsPopupOpen: false});
    this.setState(copy)
    this.props.onFetchAllTasks(true);
  }

  handleAcceptConfirm(item){
    let userID = this.props.userProfile ? this.props.userProfile._id : undefined; //"59fdda7f82fff92dc7527d28";
    var params={
      _id:this.state.detailsPopupItem._id,
      taskAsigneeId:userID
    }
    Axios.get(`${ConfigMain.getBackendURL()}/taskAssign?_id=${this.state.detailsPopupItem._id}&taskAsigneeId=${userID}`)
    .then((response) =>this.handleCloseConfirmTaskDetailsPopup(response))
    .catch((error) =>this.handleCloseConfirmTaskDetailsPopup(error));
  }

  handleOpenCancelTaskDetailsPopup(item){
    console.log(item);
    let copy = Object.assign({}, this.state, {isDetailsPopupOpenCancelTask: true,detailsPopupItem: item});
    this.setState(copy)
  }

  handleCloseCancelTaskDetailsPopup(item) {
    let copy = Object.assign({}, this.state, {isDetailsPopupOpenCancelTask: false});
    this.setState(copy)
    this.props.onFetchAllTasks(true);
  }

  handleAcceptCancel(item){
    let userID = this.props.userProfile ? this.props.userProfile._id : undefined; //"59fdda7f82fff92dc7527d28";
    var params={
      _id:this.state.detailsPopupItem._id,
      taskAsigneeId:userID
    }
    Axios.get(`${ConfigMain.getBackendURL()}/taskCancel?_id=${this.state.detailsPopupItem._id}&taskAsigneeId=${userID}`)
    .then((response) =>this.handleCloseCancelTaskDetailsPopup(response))
    .catch((error) =>this.handleCloseCancelTaskDetailsPopup(error));
  }
  
  renderTasks() {
    let filteredTasks = [];

    filteredTasks = this.props.tasks.filter(function(task) {
      return task.name && task.name != "";
    });

    if (filteredTasks.length > 0) {
      const DummyImages = [
        "http://sociamibucket.s3.amazonaws.com/assets/images/custom_ui/medium.png",
        "http://sociamibucket.s3.amazonaws.com/assets/images/custom_ui/howcast.png",
      ];

      return (
        <ul>
          {
            filteredTasks.map(function(task, i) {
              return (
              <li>
                <div className="tasks-management-my-task">
                  <img src={DummyImages[Math.floor(Math.random() * (DummyImages.length - 0)) + 0]}></img>
                  <span>{task.name}</span>
                  <div id="subtasks">
                    <div className="subtask">
                      Find potential investors
                    </div>
                    <div className="subtask">
                      Speak to David about patent
                    </div>
                    <div className="subtask">
                    </div>
                  </div>
                </div>
              </li>
              );
            })
          }
        </ul>
      );
    }
    else {
      return (<ul></ul>);
    }
  }

  renderNetworkTasks() {
    if (this.state.scannerQuery != "") {
      let foundTasks = [];
      
      const scannerQuery = this.state.scannerQuery.toLowerCase();

      foundTasks = this.props.tasks.filter(function(task) {
        return task.name && task.name.toLowerCase().startsWith(scannerQuery);
      });

      if (foundTasks.length > 0) {
        return (
          <ul id="tasks-scanner-list-tasks">
            {
              foundTasks.map(function(task, i) {
                return (<li key={i}>
                <div>
                  <a href="#">{task.name}</a>
                </div>
              </li>);
              })
            }
          </ul>
        );
      }
      else {
        return (<span>Nothing found</span>);
      }
    }
  }

  render() {
    return (
        <div className="content-2-columns-wrapper">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-9">
                <div className="content-2-columns-left">
                  <div id="tasks-management-my-tasks">
                    <div className="container-fluid">
                      <div className="row">
                        <div className="col-lg-12">
                          <div className="content-2-columns-left-title">My Tasks</div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-lg-12">
                          <div id="my-tasks-container">
                            {this.renderTasks()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-3">
              <div className="content-2-columns-right">
                <div id="tasks-scanner-container">
                  <div className="container-fluid">
                    <div className="row">
                      <div className="col-lg-12">
                       <div className="content-2-columns-right-title">Network tasks scanner</div>
                    </div>
                  </div>
                  <div id="tasks-scanner-container-bg">
                  <div className="row">
                     <div className="col-lg-12">
                       <div id="scanner-input-container">
                         <input type="text" autoComplete="off" id="scanner_trees" placeholder="" onChange={(e) => this.handleChange(e)}/>
                       </div>
                     </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-12">
                      <div>
                        <p>Complete network quests to earn tokens</p>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-12">
                      {this.renderNetworkTasks()}
                    </div>
                  </div>
                  </div>
                  
                  </div>
                </div>
                </div>
              </div>
            </div>
            </div>
          </div>
    );
  }
}

TaskManagement.propTypes = {
  tasks: PropTypes.array.isRequired,
  isTasksFetchInProgress: PropTypes.bool.isRequired,

  openSignUpForm: PropTypes.func.isRequired,
  setTasks: PropTypes.func.isRequired,
  fetchTasksInitiate: PropTypes.func.isRequired,
  fetchTasksComplete: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  userProfile: state.userProfile,
  isAuthorized: state.isAuthorized,
  tasks: state.tasks,
  isTasksFetchInProgress: state.isTasksFetchInProgress,
});

const mapDispatchToProps = dispatch => ({
  openSignUpForm: bindActionCreators(openSignUpForm, dispatch),
  setTasks: bindActionCreators(setTasks, dispatch),
  fetchTasksInitiate: bindActionCreators(fetchTasksInitiate, dispatch),
  fetchTasksComplete: bindActionCreators(fetchTasksComplete, dispatch),
})

//withRouter - is a workaround for problem of shouldComponentUpdate when using react-router-v4 with redux
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withCookies(TaskManagement)));