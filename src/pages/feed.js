import React from "react";
import PostFeed from "../components/post/PostFeed";
import PostCreationPage from "../components/post/postpg";
import { PostProvider, usePosts } from "../context/PostContext";
import "../App.css";

/**
 * The `feed` component serves as the main page for displaying and creating posts.
 * It utilizes the `PostProvider` context to manage post-related state and functionality.
 * 
 * @component
 * @returns {JSX.Element} The feed page containing the post creation section and the post feed.
 */
export default function Feed() {
    const { refreshPosts } = usePosts(); // Access the refreshPosts function from context

    return (
        <PostProvider>
            <div className="feed-container">
                <div className="post-creation-section">
                    <PostCreationPage />
                </div>
                <div className="post-feed-section">
                    <div className="feed-header-container">
                        <h2 className="feed-header">Your Feed</h2>
                        <button
                            className="refresh-posts-button"
                            onClick={() => {
                                refreshPosts(); // Refresh the posts
                                window.location.reload(); // Reload the page
                            }}
                            
                        >
                            Refresh Posts
                        </button>
                    </div>
                    <div className="scroll-container">
                        <PostFeed />
                    </div>
                </div>
            </div>
        </PostProvider>
    );
};

