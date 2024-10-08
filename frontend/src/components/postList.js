import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../App.css";

const Post = (props) => (
    <tr>
        <td>{props.post.user}</td>
        <td>{props.post.content}</td>
        <td>
            {props.post.image && (
                <img
                src={`data:image/jpeg;base64,${props.post.image}`} // Note the correction here
                alt="Post Image"
                style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'cover' }} // Ensures image fits within size limit
                />
            )}
        </td>
        <td>
            <button className="btn btn-link"
            onClick={() => {
                props.deletePost(props.post.id);
            }}>
                Delete
            </button>
        </td>
    </tr>
)

export default function PostList() {
    const [posts, setPosts] = useState([]); // Change `post` to `posts`

    // This fetches the posts from the database
    useEffect(() => {
        async function getPosts() {
            const response = await fetch('http://localhost:3001/post/');

            if (!response.ok) {
                const message = `An error occurred: ${response.statusText}`; // Use backticks for string interpolation
                window.alert(message);
                return;
            }

            const posts = await response.json(); // Change to `posts`
            setPosts(posts); // Set `posts`
        }

        getPosts();
    }, []); // Change dependency to empty array to run once

    // Delete post method
    async function deletePost(id) {
        const token = localStorage.getItem("jwt");
        await fetch(`http://localhost:3001/post/${id}`, { // Use backticks for URL
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`, // Use backticks for token
            },
        });

        const newPosts = posts.filter((el) => el._id !== id);
        setPosts(newPosts);
    }

    // This method will map out new posts on the table
    function renderPostList() { // Renamed to avoid conflict with PostList function
        return posts.map((post) => {
            return (
                <Post
                post={post}
                deletePost={() => deletePost(post._id)}
                key={post._id}
                />
            );
        });
    }

    return (
        <div className="container">
            <h3 className="header">APDS Notice Board</h3>
            <table className="table table-striped" style={{ marginTop: 20 }}>
                <thead>
                    <tr>
                        <th>User</th>
                        <th>Caption</th>
                        <th>Image</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>{renderPostList()}</tbody> {/* Call the function to render posts */}
            </table>
        </div>
    );
}
