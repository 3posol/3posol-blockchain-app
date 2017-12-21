import React from 'react';
import TimeAgo from 'react-timeago';

class Message extends React.Component {
  render() {
    // Was the message sent by the current user. If so, add a css class
    const fromMe = this.props.fromMe ? 'me' : 'you';
    const timeStampClass = this.props.fromMe ? 'timeStampMe' : 'timeStampYou';
    var timeStamp = this.getTimeStamp(this.props.time);
    return (
      <div>
      <div className={`bubble ${fromMe}`}>
        { this.props.message}
      </div>
      <div className={`${timeStampClass}`}>
      <TimeAgo date={this.props.time} minPeriod={60}/>
      </div>
      </div>
    );
  }
}

Message.defaultProps = {
  message: '',
  username: '',
  fromMe: false
};

export default Message;
