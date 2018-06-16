import React from 'react';
import Moment from 'react-moment';
import { colors } from '../../config/color';

export const TimelineItem = ({
  timestamp, content, author, authorEmail, upvote, downvote, comment, handleSubmit, _id,
}) => {
  const initial = author.substr(0, 1);
  return (
    <div className="timeline-item">
      <div
        className="user-avatar"
        style={{ backgroundColor: colors[(initial.charCodeAt(0)) % colors.length] }}
      >
        {initial.toUpperCase()}
      </div>
      <div className="user-name"> {author}{' '}{content} </div>
      <div className="timeline-timestamp"><Moment fromNow>{ timestamp }</Moment></div>
      <div className="timeline-votes">
        <span
          role="img"
          aria-label="thumb-up"
          style={{ cursor: 'pointer' }}
          onClick={() => {
            handleSubmit({ upvote: upvote + 1 }, _id);
        }}
        > 👍
        </span>{ upvote } { }
        <span
          role="img"
          aria-label="thumb-down"
          style={{ cursor: 'pointer' }}
          onClick={() => {
            handleSubmit({ downvote: downvote + 1 }, _id);
        }}
        > 👎
        </span>{ downvote } { }
      </div>
    </div>
  );
};
