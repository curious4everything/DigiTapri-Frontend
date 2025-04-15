//src/components/Postpg.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePosts } from "../../context/PostContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PostCreationPage = () => {
    // State variables for managing form inputs
    const [text, setText] = useState("");
    const [image, setImage] = useState("");
    const [visibility, setVisibility] = useState("public");
    const { addPost } = usePosts(); // Context function to add a new post
    const navigate = useNavigate(); // React Router hook for navigation

    // Handle form submission to create a new post
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior

        const token = localStorage.getItem("token");
        const rawUser = localStorage.getItem("user");
        const user = rawUser ? JSON.parse(rawUser) : null;

        console.log("🔹 Token Retrieved from LocalStorage:", token);

        if (!token) {
            // Redirect to login if the user is not authenticated
            toast.error("You must be logged in to post");
            navigate("/login");
            return;
        }

        try {
            const newPost = { text, media: image, visibility }; // Prepare post data
            console.log("📤 Submitting Post:", newPost);

            const createdPost = await addPost(newPost); // Add post using context function

            console.log("✅ Created Post Data:", createdPost);

            if (!createdPost) {
                throw new Error("Invalid response from server");
            }

            if (user) {
                // Add author information to the created post
                createdPost.author = {
                    _id: user._id,
                    username: user.username,
                };
            }
            console.log("Author after patching:", createdPost.author);

            toast.success("Post created successfully!");

            // Reset form inputs
            setText("");
            setImage("");
            setVisibility("public");
        } catch (error) {
            console.error("❌ Error Creating Post:", error.message);
            toast.error("Failed to create post");
        }
    };

    return (
        <div className="container mt-5">
            {/* Post creation form */}
            <div className="card p-4 shadow-lg" style={{ width: "100%", margin: "auto", padding: "20px" }}>
                <h2 className="mb-4 text-center">Create a Post</h2>
                <form onSubmit={handleSubmit}>
                    <fieldset>
                        {/* Text input for post content */}
                        <div className="mb-3">
                            <label className="form-label">What is on your mind?</label>
                            <textarea
                                className="form-control"
                                rows="3"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                required
                            ></textarea>
                        </div>
                        {/* Input for image URL */}
                        <div className="mb-3">
                            <label className="form-label">Add Image (URL)</label>
                            <input
                                type="text"
                                className="form-control"
                                value={image}
                                onChange={(e) => setImage(e.target.value)}
                            />
                        </div>
                        {/* Radio buttons for post visibility */}
                        <div className="mb-3">
                            <label className="form-label">Post Visibility</label>
                            <div>
                                <div className="form-check form-check-inline">
                                    <input
                                        type="radio"
                                        className="form-check-input"
                                        name="visibility"
                                        value="public"
                                        checked={visibility === "public"}
                                        onChange={() => setVisibility("public")}
                                    />
                                    <label className="form-check-label">Public</label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input
                                        type="radio"
                                        className="form-check-input"
                                        name="visibility"
                                        value="private"
                                        checked={visibility === "private"}
                                        onChange={() => setVisibility("private")}
                                    />
                                    <label className="form-check-label">Private</label>
                                </div>
                            </div>
                        </div>
                        {/* Submit button */}
                        <button type="submit" className="btn btn-primary w-100">Post</button>
                    </fieldset>
                </form>
            </div>
            {/* Toast notifications */}
            <ToastContainer />
        </div>
    );
};

export default PostCreationPage;