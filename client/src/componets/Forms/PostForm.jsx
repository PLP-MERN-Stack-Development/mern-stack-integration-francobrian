import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { postAPI } from '../../services/api';

const PostForm = ({ post, onSubmit, onCancel }) => {
  const { state, dispatch } = useApp();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    categories: [],
    tags: [],
    isPublished: false
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title || '',
        content: post.content || '',
        excerpt: post.excerpt || '',
        categories: post.categories?.map(cat => cat._id) || [],
        tags: post.tags || [],
        isPublished: post.isPublished || false
      });
    }
  }, [post]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCategoryChange = (categoryId) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter(id => id !== categoryId)
        : [...prev.categories, categoryId]
    }));
  };

  const handleTagsChange = (e) => {
    const tags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag);
    setFormData(prev => ({ ...prev, tags }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title cannot be more than 100 characters';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    }

    if (formData.excerpt.length > 200) {
      newErrors.excerpt = 'Excerpt cannot be more than 200 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      let response;
      
      if (post) {
        response = await postAPI.update(post._id, formData);
        dispatch({ type: 'UPDATE_POST', payload: response.data });
      } else {
        response = await postAPI.create(formData);
        dispatch({ type: 'ADD_POST', payload: response.data });
      }

      onSubmit?.(response.data);
    } catch (error) {
      const errorData = error.response?.data;
      if (errorData?.errors) {
        const formErrors = {};
        errorData.errors.forEach(err => {
          formErrors[err.path] = err.msg;
        });
        setErrors(formErrors);
      } else {
        setErrors({ submit: errorData?.message || 'Something went wrong' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="post-form">
      {errors.submit && (
        <div className="alert alert-error">{errors.submit}</div>
      )}

      <div className="form-group">
        <label htmlFor="title">Title *</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={errors.title ? 'error' : ''}
        />
        {errors.title && <span className="error-message">{errors.title}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="excerpt">Excerpt</label>
        <textarea
          id="excerpt"
          name="excerpt"
          value={formData.excerpt}
          onChange={handleChange}
          rows="3"
          placeholder="Brief description of your post (optional)"
          className={errors.excerpt ? 'error' : ''}
        />
        {errors.excerpt && <span className="error-message">{errors.excerpt}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="content">Content *</label>
        <textarea
          id="content"
          name="content"
          value={formData.content}
          onChange={handleChange}
          rows="10"
          className={errors.content ? 'error' : ''}
        />
        {errors.content && <span className="error-message">{errors.content}</span>}
      </div>

      <div className="form-group">
        <label>Categories</label>
        <div className="categories-list">
          {state.categories.map(category => (
            <label key={category._id} className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.categories.includes(category._id)}
                onChange={() => handleCategoryChange(category._id)}
              />
              {category.name}
            </label>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="tags">Tags</label>
        <input
          type="text"
          id="tags"
          name="tags"
          value={formData.tags.join(', ')}
          onChange={handleTagsChange}
          placeholder="tag1, tag2, tag3"
        />
      </div>

      <div className="form-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="isPublished"
            checked={formData.isPublished}
            onChange={handleChange}
          />
          Publish immediately
        </label>
      </div>

      <div className="form-actions">
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-secondary"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? 'Saving...' : (post ? 'Update Post' : 'Create Post')}
        </button>
      </div>
    </form>
  );
};

export default PostForm;