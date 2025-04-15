import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const PostContext = createContext();

export const usePosts = () => useContext(PostContext);

export const PostProvider = ({ children }) => {
    const [posts, setPosts] = useState([]);
    const token = localStorage.getItem("token");

    const CACHE_KEY = "postFeedCache_v1"; // Ensure unique cache key
    const CACHE_EXPIRATION = 10 * 60 * 1000; // 10 minutes in milliseconds

    // Fetch posts from the API
    const fetchPosts = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/posts/feed", {
                headers: { Authorization: `Bearer ${token}` },
            });

            console.log("Fetched Posts from API:", response.data);

            const cacheData = {
                posts: response.data,
                timestamp: Date.now(),
            };
            localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
            console.log("Saved to localStorage:", localStorage.getItem(CACHE_KEY));

            setPosts(response.data);
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    };

    // Add a new post
    const addPost = async (postData) => {
        try {
            const response = await axios.post("http://localhost:5000/api/posts", postData, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const newPost = response.data;

            // Update the posts state
            setPosts((prevPosts) => {
                const updatedPosts = [newPost, ...prevPosts];

                // Update the cache in localStorage
                const cacheData = {
                    posts: updatedPosts,
                    timestamp: Date.now(),
                };
                localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
                console.log("✅ Cache updated with new post:", cacheData);

                return updatedPosts;
            });

            return newPost;
        } catch (error) {
            console.error("Error adding post:", error);
            throw error;
        }
    };

    // Clear the cache
    const clearCache = () => {
        console.log("🧹 Clearing cache...");
        localStorage.removeItem(CACHE_KEY); // Remove the cached posts
        setPosts([]); // Clear the posts state
        console.log("✅ Cache cleared and posts state reset.");
    };

    const loadPosts = async () => {
        try {
            const cachedData = localStorage.getItem(CACHE_KEY);

            if (cachedData) {
                console.log("Cached Data Found:", cachedData);
                const { posts: cachedPosts, timestamp } = JSON.parse(cachedData);

                if (Date.now() - timestamp < CACHE_EXPIRATION) {
                    console.log("✅ Loading posts from cache");
                    setPosts(cachedPosts);
                    return;
                } else {
                    console.log("⚠️ Cache expired. Fetching fresh posts from API...");
                }
            } else {
                console.log("❌ No cache found. Fetching posts from API...");
            }

            await fetchPosts();
        } catch (error) {
            console.error("Error accessing localStorage:", error);
        }
    };

    useEffect(() => {
        loadPosts();
    }, []);

    return (
        <PostContext.Provider value={{ posts, fetchPosts, addPost, clearCache }}>
            {children}
        </PostContext.Provider>
    );
};
