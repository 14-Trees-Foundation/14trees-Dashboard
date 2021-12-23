import React from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { Button } from "@mui/material";
import { useNavigate } from "react-router";

import logo from '../assets/logo_light.png'

export const ApplicationBar = () => {
  const navigate = useNavigate();
  const handleSignInClick = () => {
    navigate("/");
  }

  return (
    <Navbar
      collapseOnSelect
      expand="lg"
      bg="light"
      variant="light"
    >
      <Container fluid>
        <Navbar.Brand href="#home">
          <img className="logo-img" src={logo} alt="logo" />
        </Navbar.Brand>
      </Container>
    </Navbar>
  );
};
