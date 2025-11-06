import React, { useState, useEffect } from 'react';
import { useFetch } from '../../hooks/useApi';
import PostCard from './PostCard';
import SearchBar from '../Common/SearchBar';
import Pagination from '../Common/Pagination';

const PostList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [postsData, setPostsData] = useState(null);

  const { data, loading, error, refetch } = useFetch(
    `/posts?page=${currentPage}&limit=6&search=${searchTerm}`,
    [currentPage, searchTerm]
  );

  useEffect(() => {
    if (data) {
      setPostsData(data);
    }
  }, [data]);

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  if (loading && !postsData) return <div className="loading">Loading posts...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="post-list">
      <div className="post-list-header">
        <h1>Latest Posts</h1>
        <SearchBar onSearch={handleSearch} />
      </div>

      <div className="posts-grid">
        {postsData?.posts?.map(post => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>

      {postsData && postsData.totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={postsData.totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {postsData?.posts?.length === 0 && (
        <div className="no-posts">
          <p>No posts found. {searchTerm && 'Try a different search term.'}</p>
        </div>
      )}
    </div>
  );
};

export default PostList;