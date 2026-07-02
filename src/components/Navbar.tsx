'use client';

import React from 'react';
import { Navbar, Container, Button, Form, InputGroup } from 'react-bootstrap';
import { FaSearch, FaShoppingCart, FaWhatsapp, FaChevronDown } from 'react-icons/fa';
import { FiPhone } from 'react-icons/fi';

export default function AppNavbar() {
  return (
    <Navbar className="bg-white shadow-sm py-2 border-bottom" sticky="top" expand="xl">
      <Container fluid className="px-4">
        <div className="d-flex align-items-center w-100 flex-wrap gap-2 gap-md-3">
          
          {/* 1. Logo */}
          <Navbar.Brand href="/" className="d-flex flex-column align-items-start me-0">
            <span className="text-primary-custom fw-bold lh-1" style={{ fontSize: '1.8rem', letterSpacing: '-1px' }}>
              Coachify
            </span>
            <span className="text-primary-custom fw-semibold" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>
              Learn • Lead • Succeed
            </span>
          </Navbar.Brand>

          {/* 2. Courses Dropdown Button */}
          <Button className="btn-custom-primary rounded px-3 fw-medium border-0 d-flex align-items-center gap-2">
            Courses <FaChevronDown size={12} />
          </Button>

          {/* 4. Search Bar */}
          <Form className="flex-grow-1 mx-md-2" style={{ minWidth: '250px', maxWidth: '500px' }}>
            <InputGroup>
              <InputGroup.Text className="bg-white border-end-0" style={{ borderColor: 'var(--primary-custom)', color: '#999' }}>
                <FaSearch size={14} />
              </InputGroup.Text>
              <Form.Control
                type="search"
                placeholder="Search for CAT Topic , PYQs...."
                className="border-start-0 shadow-none ps-0"
                style={{ borderColor: 'var(--primary-custom)', fontSize: '0.9rem' }}
                aria-label="Search"
              />
            </InputGroup>
          </Form>

          {/* 5. CAT SANKALP SALE Button */}
          <Button 
            className="rounded px-3 border-0 d-flex align-items-center gap-2"
            style={{ backgroundColor: '#9b00ff', color: 'white' }}
          >
            <FaShoppingCart /> <span className="fst-italic fw-bold">CAT SANKALP SALE</span>
          </Button>

          {/* 6. My Dashboard */}
          <a href="#" className="text-dark text-decoration-none fw-medium ms-md-4" style={{ fontSize: '0.95rem' }}>
            My Dashboard
          </a>

          {/* 7. Phone Icon */}
          <a href="#" className="text-dark ms-md-4">
            <FiPhone size={22} />
          </a>

          {/* 8. WhatsApp Icon */}
          <a href="#" className="ms-md-4">
            <FaWhatsapp size={26} color="#25D366" />
          </a>

          {/* 9. Login Button */}
          <Button className="btn-custom-primary rounded px-4 fw-medium border-0 ms-md-4 mt-2 mt-md-0" style={{ padding: '8px 0' }}>
            Login
          </Button>

        </div>
      </Container>
    </Navbar>
  );
}
