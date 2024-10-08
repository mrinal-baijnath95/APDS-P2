/* eslint-disable jsx-a11y/alt-text */
import React from "react";
import logo from "../logo.svg"
//import bootstraps to improve look
import "bootstrap/dist/css/bootstrap.min.css";
//import navLink to use react router
import {NavLink} from "react-router-dom";
//display the navbar
export default function Navbar(){
    return(
        <div>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <NavLink className="navbar-brand" to="/">
                <img style={{"width" : 25 + '%'}} src={logo}></img>
                </NavLink>
                <div className="navbar" id="navbarSupportedContext">
                    <ul className="navbar-nav ml-auto">
                        <NavLink className="nav-link" to="/">
                            List
                        </NavLink>
                        <NavLink className="nav-link" to="create">
                            Create Post
                        </NavLink>
                        <NavLink className="nav-link" to="register">
                            Register
                        </NavLink>
                        <NavLink className="nav-link" to="login">
                            Login
                        </NavLink>
                    </ul>
                </div>
            </nav>
        </div>
    );
}