import { createContext, useContext, useState, useEffect, useCallback } from "react";
import axiosInstance from "../services/axiosInstance";

const PostContext = createContext();

export const usePosts = () => useContext(PostContext);

export const PostProvider = ({ children }) => {
    const [posts, setPosts] = useState([]);
    const CACHE_KEY = "postFeedCache_v1"; // Ensure unique cache key
    const CACHE_EXPIRATION = 10 * 60 * 1000; // 10 minutes in milliseconds

    // Fetch posts from the API
    const fetchPosts = useCallback(async () => {
        try {
            const response = await axiosInstance.get("/posts/feed");

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
    }, []); // No need for `token` dependency as axiosInstance handles the token

    // Add a new post
    const addPost = async (postData) => {
        try {
            const response = await axiosInstance.post("/posts", postData);

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

    // Refresh posts by clearing the cache and fetching fresh data
    const refreshPosts = useCallback(async () => {
        console.log("🔄 Refreshing posts...");
        localStorage.removeItem(CACHE_KEY); // Clear the cache
        await fetchPosts(); // Fetch fresh posts
    }, [fetchPosts]);

    // Load posts from cache or fetch from API
    const loadPosts = useCallback(async () => {
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
    }, [fetchPosts, CACHE_EXPIRATION]); // Add `fetchPosts` as a dependency

    // Clear the cache
    const clearCache = useCallback(() => {
        console.log("🧹 Clearing cache...");
        localStorage.removeItem(CACHE_KEY); // Remove the cached posts
        setPosts([]); // Clear the posts state
        console.log("✅ Cache cleared and posts state reset.");
    }, []);

    useEffect(() => {
        loadPosts();
    }, [loadPosts]); // Add `loadPosts` as a dependency

    return (
        <PostContext.Provider value={{ posts, fetchPosts, addPost, clearCache, refreshPosts }}>
        {children}
    </PostContext.Provider>
    );
};
