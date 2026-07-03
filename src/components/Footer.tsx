'use client';

import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaYoutube, FaWhatsapp, FaInstagram, FaTwitter } from 'react-icons/fa';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white border-top pt-5 mt-auto">
      <Container>
        {/* Top Header Row */}
        <Row className="align-items-center mb-5">
          <Col md={6}>
            <div className="d-flex flex-column align-items-start">
              <span className="text-primary-custom fw-bold lh-1" style={{ fontSize: '2.5rem', letterSpacing: '-1px' }}>
                Coachify
              </span>
              <span className="text-primary-custom fw-semibold" style={{ fontSize: '0.85rem', letterSpacing: '0.5px' }}>
                Learn • Lead • Succeed
              </span>
            </div>
          </Col>
          <Col md={6} className="text-md-end mt-4 mt-md-0">
            <a href="#" className="text-dark text-decoration-none fw-semibold me-4 hover-primary">Youtube</a>
            <a href="#" className="text-dark text-decoration-none fw-semibold hover-primary">Whatsapp</a>
          </Col>
        </Row>

        {/* Main Footer Links */}
        <Row className="gy-4">
          {/* Column 1: Address, Contact, Follow Us */}
          <Col lg={3} md={6}>
            <h6 className="fw-bold mb-3 text-dark fs-6">Address</h6>
            <p className="text-muted small mb-4 lh-base" style={{ fontSize: '0.9rem' }}>
              VT Tower 2nd Floor Shipra Path,<br />
              opposite Hcg Hospital, Jaipur 302020.
            </p>

            <h6 className="fw-bold mb-3 text-dark fs-6">Contact</h6>
            <div className="d-flex flex-column gap-2 mb-4">
              <a href="mailto:contact@coachifylive.com" className="text-primary-custom text-decoration-none small hover-dark">contact@coachifylive.com</a>
              <span className="text-primary-custom small hover-dark">+91 83060 56876</span>
              <Link href="#" className="text-primary-custom text-decoration-none small hover-dark mt-1">Submit a Review</Link>
              <Link href="#" className="text-primary-custom text-decoration-none small hover-dark">Pre-Recorded Feedback</Link>
            </div>

            <h6 className="fw-bold mb-3 text-dark fs-6">Follow us on</h6>
            <div className="d-flex gap-3">
              <a href="#" className="text-primary-custom hover-dark"><FaInstagram size={22} /></a>
              <a href="https://wa.me/918306056876" className="text-primary-custom hover-dark"><FaWhatsapp size={22} /></a>
              <a href="#" className="text-primary-custom hover-dark"><FaYoutube size={22} /></a>
            </div>
          </Col>

          {/* Column 2: Courses */}
          <Col lg={3} md={6}>
            <h6 className="fw-bold mb-4 text-dark fs-6">Courses</h6>
            <div className="d-flex flex-column gap-2">
              <Link href="#" className="text-primary-custom text-decoration-none small hover-dark">CAT 2026 Courses</Link>
              <Link href="#" className="text-primary-custom text-decoration-none small hover-dark">CAT 2026 full Courses</Link>
              <Link href="#" className="text-primary-custom text-decoration-none small hover-dark">CAT 2026 full Courses Pre-Recorded</Link>
              <Link href="#" className="text-primary-custom text-decoration-none small hover-dark">Quant Essentials</Link>
              <Link href="#" className="text-primary-custom text-decoration-none small hover-dark">VARC Essentials</Link>
              <Link href="#" className="text-primary-custom text-decoration-none small hover-dark">DILR Essentials</Link>
            </div>
          </Col>

          {/* Column 3: Previous Year Papers */}
          <Col lg={4} md={6}>
            <h6 className="fw-bold mb-4 text-dark fs-6">Previous Year Papers</h6>
            <div className="d-flex flex-column gap-2">
              <Link href="#" className="text-primary-custom text-decoration-none small hover-dark">CAT PYQs</Link>
              <Link href="#" className="text-primary-custom text-decoration-none small hover-dark">XAT PYQs</Link>
              <Link href="#" className="text-primary-custom text-decoration-none small hover-dark">CMAT PYQs</Link>
              <Link href="#" className="text-primary-custom text-decoration-none small hover-dark">SNAP PYQs</Link>
              <Link href="#" className="text-primary-custom text-decoration-none small hover-dark">IPMAT Indore PYQs</Link>
              <Link href="#" className="text-primary-custom text-decoration-none small hover-dark">IPMAT Rohtak PYQs</Link>
              <Link href="#" className="text-primary-custom text-decoration-none small hover-dark">JIPMAT PYQs</Link>
              <Link href="#" className="text-primary-custom text-decoration-none small hover-dark">IIMK BMSAT PYQs</Link>
              <Link href="#" className="text-primary-custom text-decoration-none small hover-dark">IIMB BBA/DBE PYQs</Link>
              <Link href="#" className="text-primary-custom text-decoration-none small hover-dark">IIMB UGAT PYQs</Link>
              <Link href="#" className="text-primary-custom text-decoration-none small hover-dark">CUET PYQs</Link>
            </div>
          </Col>

          {/* Column 4: Company */}
          <Col lg={2} md={6}>
            <h6 className="fw-bold mb-4 text-dark fs-6">Company</h6>
            <div className="d-flex flex-column gap-2">
              <Link href="/" className="text-primary-custom text-decoration-none small hover-dark">Home</Link>
              <Link href="#" className="text-primary-custom text-decoration-none small hover-dark">About us</Link>
              <Link href="#" className="text-primary-custom text-decoration-none small hover-dark">Contact Us</Link>
              <Link href="#" className="text-primary-custom text-decoration-none small hover-dark">Careers</Link>
              <Link href="#" className="text-primary-custom text-decoration-none small hover-dark">Blogs</Link>
              <Link href="#" className="text-primary-custom text-decoration-none small hover-dark">Refund Policy</Link>
              <Link href="#" className="text-primary-custom text-decoration-none small hover-dark">Terms & Conditions</Link>
              <Link href="#" className="text-primary-custom text-decoration-none small hover-dark">Privacy Policy</Link>
              <Link href="#" className="text-primary-custom text-decoration-none small hover-dark">Site Map</Link>
            </div>
          </Col>
        </Row>

      </Container>
      
      {/* Full width purple copyright section */}
      <div style={{ backgroundColor: '#9b00ff' }} className="py-4 mt-5 text-center text-white">
        <Container>
          <div className="fw-medium mb-1" style={{ fontSize: '0.9rem' }}>
            Copyright © 2026 Coachify Pvt. Ltd. All rights reserved.
          </div>
          <div className="fw-medium d-flex justify-content-center align-items-center gap-2" style={{ fontSize: '0.9rem' }}>
            <Link href="#" className="text-white-50 text-decoration-none hover-white">Privacy policy</Link>
            <span className="text-white-50">|</span>
            <Link href="#" className="text-white-50 text-decoration-none hover-white">Terms & Conditions</Link>
          </div>
        </Container>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .hover-primary:hover {
          color: var(--primary-custom) !important;
          transition: color 0.2s ease-in-out;
        }
        .hover-dark:hover {
          color: #000 !important;
          transition: color 0.2s ease-in-out;
        }
        .hover-white:hover {
          color: #fff !important;
          transition: color 0.2s ease-in-out;
        }
      `}} />
    </footer>
  );
}
