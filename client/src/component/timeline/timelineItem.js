import React from 'react';
import { connect } from 'react-redux';
import Moment from 'react-moment';
import { colors } from '../../config/color';
import { CommentList } from './';
import {
  sendComment as sendCommentAC,
  deleteTimelineItem as deleteTimelineItemAC,
} from '../../actions/';
import { NavLink } from 'react-router-dom';

class TimelineItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showComments: false,
      newComment: '',
    };
  }

  render() {
    const {
      timestamp, content, author, authorId, upvote, downvote, comments, handleSubmit, _id, account, sendComment, deleteTimelineItem,
    } = this.props;
    const initial = author.substr(0, 1);
    const isAdmin = account.name === 'admin' && account.email === 'admin';


    return (
      <div className="list-item">
        <div
          className="user-avatar"
          style={{ backgroundColor: colors[(initial.charCodeAt(0)) % colors.length] }}
        >
          {initial.toUpperCase()}
        </div>

        <div className="user-name">
          <NavLink to={`/profile/${authorId}`}>{author}</NavLink>{' - '}{content}

          <div className="timeline-timestamp"><Moment fromNow>{ timestamp }</Moment></div>
          <div className="timeline-votes">
            <span
              role="img"
              aria-label="thumb-up"
              style={{ cursor: 'pointer' }}
              onClick={() => {
            handleSubmit({
 upvote: upvote + 1, _id, producerId: account._id, producerName: account.name,
});
        }}
            > 👍
            </span>{ upvote } { }
            <span
              role="img"
              aria-label="thumb-down"
              style={{ cursor: 'pointer' }}
              onClick={() => {
            handleSubmit({
 downvote: downvote + 1, _id, producerId: account._id, producerName: account.name,
});
        }}
            > 👎
            </span>{ downvote } { }
            <span
              role="img"
              aria-label="comments"
              style={{ cursor: 'pointer' }}
              onClick={() => this.setState({ showComments: !this.state.showComments })
        }
            >💬
            </span>{ comments ? comments.length : 0 }
            {isAdmin ? (<span
              role="img"
              aria-label="comments"
              style={{ cursor: 'pointer' }}
              onClick={() => deleteTimelineItem('admin12345', _id)
        }
            >🗑️ Suppr. (admin)
                        </span>) : ''}


            {this.state.showComments ?
              <div>
                <input
                  className="comment-input-text"
                  type="text"
                  value={this.state.newComment}
                  onChange={e => this.setState({ newComment: e.target.value })}
                  placeholder="Commenter..."
                />
                <button
                  className="comment-input-button"
                  onClick={() => {
                    this.setState({ newComment: '' });
                  const newComment = {
                    content: this.state.newComment,
                    author: account.name,
                    authorId: account._id,
                    authorEmail: account.email,
                    timestamp: Date.now(),
                    targetTimelineItem: _id,
                  };
                  sendComment(newComment);
                  }}
                >send
                </button>
                <CommentList comments={comments} />
                <span
                  className="userSocialLink"
                  onClick={() => this.setState({ showComments: !this.state.showComments })}
                >Fermer
                </span>
              </div>
          : null }
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  sendComment: comment => dispatch(sendCommentAC(comment)),
  deleteTimelineItem: (adminToken, id) => dispatch(deleteTimelineItemAC(adminToken, id)),

});

export default connect(null, mapDispatchToProps)(TimelineItem);

