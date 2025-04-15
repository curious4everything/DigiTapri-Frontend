//src/components/Postfeed.js
import React, { useState, useEffect, useCallback } from "react";
import { usePosts } from "../../context/PostContext";
import {jwtDecode} from "jwt-decode"; // Correct import
import axios from "axios"; // For API calls
import { FaHeart } from "react-icons/fa";

const ZoomedImageModal = ({ image, onClose }) => {
    if (!image) return null;

    return (
        <div
            className="modal-overlay"
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1000,
            }}
            onClick={onClose}
        >
            <div
                style={{
                    position: "relative",
                }}
            >
                <img
                    src={image}
                    alt="Zoomed"
                    style={{
                        maxWidth: "90vw",
                        maxHeight: "90vh",
                        borderRadius: "10px",
                    }}
                />
                <button
                    onClick={onClose}
                    style={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        backgroundColor: "white",
                        border: "none",
                        borderRadius: "50%",
                        padding: "5px 10px",
                        cursor: "pointer",
                        fontSize: "1.2rem",
                    }}
                >
                    &times;
                </button>
            </div>
        </div>
    );
};

const PostFeed = () => {
    const { posts } = usePosts(); // Fetch posts from context
    const [selectedImage, setSelectedImage] = useState(null);
    const [likes, setLikes] = useState({}); // State to manage like counts
    const [likedPosts, setLikedPosts] = useState({}); // State to manage liked posts (user-specific)

    const token = localStorage.getItem("token");
    const loggedInUserId = token ? jwtDecode(token).userId : null;

    // Wrap fetchLikes in useCallback
    const fetchLikes = useCallback(
        async (postId) => {
            try {
                const response = await axios.get(`http://localhost:5000/api/likes/post/${postId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                // Find the like entry for the logged-in user
                const userLike = response.data.find((like) => like.user._id === loggedInUserId);

                return {
                    likeCount: response.data.length, // Total number of likes
                    userLikeId: userLike ? userLike._id : null, // The like ID for the logged-in user
                };
            } catch (error) {
                console.error(`❌ Error fetching likes for post ${postId}:`, error.message);
                return { likeCount: 0, userLikeId: null };
            }
        },
        [token, loggedInUserId] // Dependencies for fetchLikes
    );

    // Fetch all posts and include their like counts
    const fetchPostsWithLikes = useCallback(async () => {
        try {
            const postsWithLikes = await Promise.all(
                posts.map(async (post) => {
                    const { likeCount, userLikeId } = await fetchLikes(post._id);
                    return { ...post, likeCount, userLikeId };
                })
            );

            // Update likes and likedPosts state
            setLikes(
                postsWithLikes.reduce((acc, post) => {
                    acc[post._id] = post.likeCount;
                    return acc;
                }, {})
            );

            setLikedPosts(
                postsWithLikes.reduce((acc, post) => {
                    acc[post._id] = post.userLikeId; // Store the user's like ID (if exists)
                    return acc;
                }, {})
            );
        } catch (error) {
            console.error("❌ Error fetching posts with likes:", error.message);
        }
    }, [posts, fetchLikes]); // Add fetchLikes to the dependency array

    // Toggle like/unlike functionality for a post
    const toggleLike = async (postId) => {
        try {
            const userLikeId = likedPosts[postId]; // Get the user's like ID for this post

            if (userLikeId) {
                // Unlike the post
                await axios.delete(`http://localhost:5000/api/likes/post/${postId}/like/${userLikeId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setLikes((prevLikes) => ({
                    ...prevLikes,
                    [postId]: prevLikes[postId] - 1,
                }));
                setLikedPosts((prevLikedPosts) => {
                    const updatedLikedPosts = { ...prevLikedPosts };
                    delete updatedLikedPosts[postId]; // Remove the like ID
                    return updatedLikedPosts;
                });
            } else {
                // Like the post
                const response = await axios.post(
                    "http://localhost:5000/api/likes",
                    { post: postId },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setLikes((prevLikes) => ({
                    ...prevLikes,
                    [postId]: (prevLikes[postId] || 0) + 1,
                }));
                setLikedPosts((prevLikedPosts) => ({
                    ...prevLikedPosts,
                    [postId]: response.data._id, // Store the new like ID
                }));
            }
        } catch (error) {
            console.error(`❌ Error toggling like for post ${postId}:`, error.message);
        }
    };

    // Fetch posts and likes when the component mounts
    useEffect(() => {
        if (posts && posts.length > 0) {
            fetchPostsWithLikes();
        }
    }, [posts, fetchPostsWithLikes]);

    console.log("Posts:", posts);

    return (
        <div className="mt-4">
            {Array.isArray(posts) && posts.length === 0 ? (
                <p className="text-center">No posts available</p>
            ) : (
                Array.isArray(posts) &&
                posts.map((post, index) => (
                    <div
                        key={post._id}
                        className="card mb-3 fade-in-out"
                        style={{
                            width: "80%",
                            margin: "auto",
                            animation: `fadeInOut 0.5s ease-in-out ${index * 0.1}s`,
                        }}
                    >
                        <div className="card-body">
                            <h5 className="card-title">
                                {post.author?.username || "Anonymous"}{" "}
                                <span className="text-muted" style={{ fontSize: "0.9rem" }}>
                                    |{new Date(post.createdAt).toLocaleDateString("en-GB")} at{" "}
                                    {new Date(post.createdAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                                </span>
                            </h5>
                            <p className="card-text">{post.text}</p>
                            {post.media && (
                                <div className="text-center">
                                    <img
                                        src={`${post.media}?unique=${post._id}`} // Add a unique query parameter
                                        alt="Post"
                                        className="img-fluid"
                                        style={{ maxHeight: "2.5in", width: "auto", cursor: "pointer" }}
                                        onDoubleClick={() => setSelectedImage(post.media)}
                                    />
                                </div>
                            )}
                            <div className="d-flex justify-content-between align-items-center mt-3">
                                <div>
                                    <FaHeart
                                        style={{
                                            color: likedPosts[post._id] ? "red" : "gray", // Change color based on like state
                                            cursor: "pointer",
                                        }}
                                        onClick={() => toggleLike(post._id)}
                                    />
                                    <span className="ms-2">{likes[post._id] || 0} Likes</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            )}
            <ZoomedImageModal
                image={selectedImage}
                onClose={() => setSelectedImage(null)}
            />
        </div>
    );
};

export default PostFeed;
