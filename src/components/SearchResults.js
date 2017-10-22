/*
    author: Alexander Zolotov
*/

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router-dom'

import JobsList from './containers/JobsList';
import EventBriteItemList from './containers/EventBriteItemList';
import UdemyItemList from './containers/UdemyItemList';
import FreelancerProjectItemList from './containers/FreelancerProjectItemList';

import "../css/searchResults.css"

import {openSearchResultsComplete} from '../redux/actions/actions'

class SearchResults extends React.Component {
  componentWillMount() {
    this.props.openSearchResultsComplete();
  }

  render() {
    const jobsList = (this.props.currentCategory == "RESULTS_CATEGORY_JOBS") 
    ? <JobsList items={this.props.searchResults.jobs} onAddBookmark={(e) => this.props.onAddBookmark(e)}/> : null;
    
    const eventsList = (this.props.currentCategory == "RESULTS_CATEGORY_EVENTS") 
    ? <EventBriteItemList items={this.props.searchResults.events} onAddBookmark={(e) => this.props.onAddBookmark(e)}/> : null;
    
    const udemyCoursesList = (this.props.currentCategory == "RESULTS_CATEGORY_COURSES") 
    ? <UdemyItemList items={this.props.searchResults.courses} onAddBookmark={(e) => this.props.onAddBookmark(e)}/> : null;
    
    const freelancerProjectList = (this.props.currentCategory == "RESULTS_CATEGORY_GIGS") 
    ? <FreelancerProjectItemList items={this.props.searchResults.gigs} 
        onAddBookmark={(e) => this.props.onAddBookmark(e)}/> : null;

    if(this.props.isFetchInProgress) {
      return <div className="row mt left search_results_container"><h2>Searching...</h2></div>;
    }
    else {
      return (
        <div className="row mt left search_results_container">
        <div className="col-lg-12">
            {jobsList}    
            {eventsList}
            {udemyCoursesList}
            {freelancerProjectList}
        </div>
      </div>
    );
    }
  }

}

SearchResults.propTypes = {
  currentCategory: PropTypes.string.isRequired,
  searchResults: PropTypes.object.isRequired,
  isFetchInProgress: PropTypes.bool.isRequired,

  openSearchResultsComplete: PropTypes.func.isRequired,
}
  
const mapStateToProps = state => ({
  currentCategory: state.currentCategory,
  searchResults : state.searchResults,
  isFetchInProgress : state.isFetchInProgress
})

const mapDispatchToProps = dispatch => ({
  openSearchResultsComplete: bindActionCreators(openSearchResultsComplete, dispatch)
})

  
//withRouter - is a workaround for problem of shouldComponentUpdate when using react-router-v4 with redux
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SearchResults));