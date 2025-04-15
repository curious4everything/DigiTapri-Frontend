import PostFeed from "../components/post/PostFeed";
import PostCreationPage from "../components/post/postpg";
import { PostProvider } from "../context/PostContext";
import "../App.css";
import React from "react";


/**
 * The `feed` component serves as the main page for displaying and creating posts.
 * It utilizes the `PostProvider` context to manage post-related state and functionality.
 * 
 * @component
 * @returns {JSX.Element} The feed page containing the post creation section and the post feed.
 */
export default function feed(){
    return (
        <PostProvider>
            <div className="container mt-5" style={{ display: "flex", flexDirection: "row", height: "150vh" }}>
                <div style={{
                    flex: 1,
                    borderRight: "1px solid #ccc",
                    padding: "10px",
                    boxSizing: "border-box",
                    overflowY: "auto"
                }}>
                    <PostCreationPage />
                </div>
                <div style={{
                    flex: 2,
                    padding: "10px",
                    boxSizing: "border-box",
                    display: "flex",
                    flexDirection: "column",
                    height: "100%"
                }}>
                    <h2 style={{ margin: "auto", padding: "10px", borderBottom: "5px solid #ccc" }}>
                        Your Feed
                    </h2>
                    <div
                        className="scroll-container"
                        style={{
                            flex: 1,
                            overflowY: "auto",
                            border: "5px solid #ccc",
                            padding: "auto",
                            boxSizing: "border-box",
                            position: "relative", // Required for pseudo-elements
                        }}>
                         <PostFeed />
                    </div>
                </div>
            </div>
        </PostProvider>
    );
};

