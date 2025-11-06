import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

const PostCard = ({ post }) => {
  const { state } = useApp();

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const truncateContent = (content, maxLength = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <article className="post-card">
      {post.featuredImage && (
        <div className="post-image">
          <img src={post.featuredImage} alt={post.title} />
        </div>
      )}
      
      <div className="post-content">
        <div className="post-meta">
          <span className="post-date">
            {formatDate(post.createdAt)}
          </span>
          {post.categories && post.categories.length > 0 && (
            <div className="post-categories">
              {post.categories.map(category => (
                <span key={category._id} className="category-tag">
                  {category.name}
                </span>
              ))}
            </div>
          )}
        </div>

        <h2 className="post-title">
          <Link to={`/posts/${post._id}`}>{post.title}</Link>
        </h2>

        <p className="post-excerpt">
          {post.excerpt || truncateContent(post.content)}
        </p>

        <div className="post-footer">
          <div className="post-author">
            By {post.author?.name || 'Unknown Author'}
          </div>
          
          {state.user && state.user._id === post.author?._id && (
            <div className="post-actions">
              <Link to={`/edit-post/${post._id}`} className="btn-edit">
                Edit
              </Link>
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

export default PostCard;