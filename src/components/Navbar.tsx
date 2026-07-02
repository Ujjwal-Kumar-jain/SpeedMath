'use client';

import React from 'react';
import { Navbar, Container, Button } from 'react-bootstrap';

export default function AppNavbar() {
  return (
    <Navbar className="bg-white shadow-sm py-3" sticky="top">
      <Container>
        <Navbar.Brand href="/" className="d-flex flex-column align-items-start">
          <span className="text-primary-custom fw-bold lh-1" style={{ fontSize: '2rem', letterSpacing: '-1px' }}>
            Coachify
          </span>
          <span className="text-primary-custom fw-semibold" style={{ fontSize: '0.85rem', letterSpacing: '0.5px' }}>
            Learn • Lead • Succeed
          </span>
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Button variant="primary" className="btn-custom-primary rounded-pill px-4 fw-bold">
            Login
          </Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
