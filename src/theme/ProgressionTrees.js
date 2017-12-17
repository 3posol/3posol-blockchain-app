/*
    author: Alexander Zolotov
*/

import React, { Component } from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import "~/src/theme/css/common.css"
import "~/src/theme/css/progressionTrees.css"

import PopupAcceptProgressionTree from "~/src/theme/components/PopupAcceptProgressionTree"

import ActionLink from '~/src/components/common/ActionLink'

import {
  fetchRoadmaps,
  fetchRoadmapsFromAdmin,
} from '~/src/redux/actions/roadmaps'

import Axios from 'axios'

import ConfigMain from '~/configs/main'

class ProgressionTrees extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      scannerQuery: "",
      isAcceptProgressionTreePopupOpen: false,
      scannerSelectedTreeId: undefined,
    }
  }

  handleChange(e) {
    e.preventDefault();
    this.setState({scannerQuery: e.target.value});
  }

  componentWillMount() {
    this.props.fetchRoadmaps();

    this.props.fetchRoadmapsFromAdmin();
  }

  renderUserProgressionTrees() {
    const progressValueNow = 25;
    const progressValueNow1 = 41;

    const DummyProgressValues = [25, 41, 79, 85, 15, 98, 100, 29, 35, 50, 67, 75];

    let userRoadmaps = [];

    /*if (this.props.isAuthorized) {
      userRoadmaps = this.props.roadmapsAdmin.data.filter(function(roadmap) {
        return roadmap.us
      });
    }
    else {
      
    }*/

    userRoadmaps = this.props.roadmapsAdmin.data;

    return (
      <div id="progression-trees-trees">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12">
              <div className="content-2-columns-left-title">My Progress</div>
            </div>
          </div>
          <div id="my-progress-list">
          {
            userRoadmaps.map(function(roadmap, i) {
              const RandomProgressValueNow = DummyProgressValues[Math.floor(Math.random() * (DummyProgressValues.length - 0)) + 0];
            return (
            <div key={i} className="row">
              <div className="col-lg-12">
                <div className="progress">
                  <span className="col-lg-12" id="progress-bar-text">
                    <h4 id="progress-bar-roadmap-name">{roadmap.name}</h4>
                    <span className="progress-bar-skills-weightage">Core</span>
                    {
                      roadmap.weightage1.map(function(skill, i) {
                        return (<span key={i} className="progress-bar-skill-name">{skill}</span>);
                      })
                    }
                    <span className="progress-bar-skills-weightage">Bonus</span>
                    {
                      roadmap.weightage2.map(function(skill, i) {
                        return (<span key={i} className="progress-bar-skill-name">{skill}</span>);
                      })
                    }
                    <span className="progress-bar-skills-weightage">Good to Have</span>
                    {
                      roadmap.weightage3.map(function(skill, i) {
                        return (<span key={i} className="progress-bar-skill-name">{skill}</span>);
                      })
                    }
                    <span className="progress-bar-skill-name"><span className="glyphicon glyphicon-info-sign"></span></span>
                  </span>
                  <div className="progress-bar" role="progressbar" style={{'width': RandomProgressValueNow + '%'}} 
                    aria-valuenow={RandomProgressValueNow} aria-valuemin="0" aria-valuemax="100">
                  </div>
                  <sup id="progress-percents-sup">{RandomProgressValueNow}%</sup>
                </div>
              </div>
            </div>
            );
          })}
          </div>
        </div>
      </div>
    );
  }

  openTreeAcceptConfirmationPopup(treeId) {
    if (this.props.isAuthorized) {
      this.setState({scannerSelectedTreeId: treeId, isAcceptProgressionTreePopupOpen: true});
    }
  }

  onTreeAcceptConfirmationPopupClose(option, treeId) {
    this.setState({scannerSelectedTreeId: undefined, isAcceptProgressionTreePopupOpen: false});
    console.log(`Confirmation popup option: ${option} treeId: ${treeId}`);

    if (option === true && treeId) {
      const url = `${ConfigMain.getBackendURL()}/userProgressionTreeStart`;

      let foundRoadmaps = [];
      
      const scannerQuery = this.state.scannerQuery.toLowerCase();
          
      if (scannerQuery != "") {
        foundRoadmaps = this.props.roadmapsAdmin.data.filter(function(roadmap) {
          return roadmap.name && roadmap.name.toLowerCase().startsWith(scannerQuery);
        });
      }
      else {
        foundRoadmaps = this.props.roadmapsAdmin.data;
      }

      const findById = (currentRoadmap) => {
        return currentRoadmap._id == treeId;
      }

      const foundRoadmap = foundRoadmaps.find(findById);

      if (foundRoadmap) {
        const data = {userId: this.props.userProfile._id, progTree: {_id: foundRoadmap._id, name: foundRoadmap.name}};
        
        Axios.post(url, data)
          .then((response)=>this.progressionTreeStartSuccess(response))
          .catch((error)=>this.progressionTreeStartFailed(error)); 
      }
    }
  }

  progressionTreeStartSuccess(response) {
    console.log("Project fetch success: ");
  }

  progressionTreeStartFailed(error) {
    console.log("Project fetch error: " + error);
  }

  renderTreesScannerTrees() {
    const DummyTrees = [
      {name: "AI for Beginners", secondaryInfo: {
        image_1: "http://sociamibucket.s3.amazonaws.com/assets/images/custom_ui/matthewicon.png", 
        image_2: "http://sociamibucket.s3.amazonaws.com/assets/images/custom_ui/Mathildaicon.png"
        , text: "and 1282 others"}
      }, 
      {name: "AI for Intermediates", secondaryInfo: {image_1: null, image_2: null, text: "256 learners"}}, 
      {name: "AI for advanced learners", secondaryInfo: {image_1: null, image_2: null, text: "32 learners"}}, 
      {name: "AI for corporations", secondaryInfo: {
        image_1: "http://sociamibucket.s3.amazonaws.com/assets/images/custom_ui/johnicon.png", 
        image_2: null, text: "and 10 others"}
      }, 
    ];

    let foundRoadmaps = [];

    const scannerQuery = this.state.scannerQuery.toLowerCase();
    
    if (scannerQuery != "") {
      foundRoadmaps = this.props.roadmapsAdmin.data.filter(function(roadmap) {
        return roadmap.name && roadmap.name.toLowerCase().startsWith(scannerQuery);
      });
    }
    else {
      foundRoadmaps = this.props.roadmapsAdmin.data;
    }

    const openTreeAcceptConfirmationPopup = (treeId)=>this.openTreeAcceptConfirmationPopup(treeId);

    return (
      <ul id="trees-scanner-list-trees">
        {
          foundRoadmaps.map(function(roadmap, i) {
            let tree = DummyTrees[Math.floor(Math.random() * (DummyTrees.length - 0)) + 0];
            return (<li key={i}>
            <div className="tree-list-item">
              <ActionLink href="#" onClick={()=>openTreeAcceptConfirmationPopup(roadmap._id)}>{roadmap.name}</ActionLink>
              {tree.secondaryInfo ? 
              <div className="pull-right">
                <span>
                  <span>{tree.secondaryInfo.image_1 ? <img src={tree.secondaryInfo.image_1}/> : null}</span>
                  <span>{tree.secondaryInfo.image_2 ? <img src={tree.secondaryInfo.image_2}/> : null}</span>
                </span>
                {tree.secondaryInfo.text ? <div id="tree-list-item-secondary-text">{tree.secondaryInfo.text}</div> : null}
              </div> : null}
            </div>
          </li>);
          })
        }
      </ul>
    );
  }

  render() {
    return (
        <div className="content-2-columns-wrapper" id="progression-trees">
          {this.state.isAcceptProgressionTreePopupOpen 
              && <PopupAcceptProgressionTree treeId={this.state.scannerSelectedTreeId} isModalOpen={this.state.isAcceptProgressionTreePopupOpen}
                onConfirmationPopupClose={(option, treeId)=>this.onTreeAcceptConfirmationPopupClose(option, treeId)}
              />
          }
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-9">
              <div className="content-2-columns-left">
                {this.renderUserProgressionTrees()}
              </div>
              </div>
              <div className="col-lg-3">
                <div className="content-2-columns-left" id="progression-trees-scanner">
                <div id="progression-trees-scanner-container">
                  <div className="container-fluid">
                    <div className="row">
                       <div className="col-lg-12">
                         <div className="content-2-columns-right-title">Tree scanner</div>
                       </div>
                    </div>
                    <div className="row">
                       <div className="col-lg-12">
                         <div id="scanner-input-container">
                           <input type="text" autoComplete="off" id="scanner_trees" placeholder="" onChange={(e) => this.handleChange(e)}/>
                         </div>
                       </div>
                    </div>
                    <div className="row">
                      <div className="col-lg-12">
                        <div id="trees-scanner-container">
                          {this.renderTreesScannerTrees()}
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

ProgressionTrees.propTypes = {
  fetchRoadmaps: PropTypes.func.isRequired,
  fetchRoadmapsFromAdmin: PropTypes.func.isRequired,
  roadmaps: PropTypes.object.isRequired,
  roadmapsAdmin: PropTypes.object.isRequired,
  isAuthorized: PropTypes.bool.isRequired,
  userProfile: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
  roadmaps: state.roadmaps,
  roadmapsAdmin: state.roadmapsAdmin,
  isAuthorized: state.isAuthorized,
  userProfile: state.userProfile,
})

const mapDispatchToProps = dispatch => ({
  fetchRoadmaps: bindActionCreators(fetchRoadmaps, dispatch),
  fetchRoadmapsFromAdmin: bindActionCreators(fetchRoadmapsFromAdmin, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(ProgressionTrees);