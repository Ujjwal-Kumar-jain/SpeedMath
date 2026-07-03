'use client';

import React, { useState } from 'react';
import { Navbar, Container, Button, Form, InputGroup, Modal, OverlayTrigger, Tooltip, Badge } from 'react-bootstrap';
import { FaSearch, FaShoppingCart, FaWhatsapp, FaChevronDown, FaBolt, FaTimesCircle, FaPlusCircle, FaUserCircle, FaEnvelope, FaLock, FaUser, FaCrown } from 'react-icons/fa';
import { FiPhone } from 'react-icons/fi';
import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AppNavbar() {
  const { data: session } = useSession();
  const router = useRouter();
  const [showSaleModal, setShowSaleModal] = useState(false);

  // Login & Signup Modal State
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [signupName, setSignupName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError(res.error);
      setLoading(false);
    } else {
      setShowLoginModal(false);
      window.location.reload();
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: signupName, email, password })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Auto login after signup
      const loginRes = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (loginRes?.error) {
        setError(loginRes.error);
        setLoading(false);
      } else {
        setShowSignupModal(false);
        window.location.reload();
      }
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <Navbar className="bg-white shadow-sm py-2 border-bottom" sticky="top" expand="xl">
      <Container fluid className="px-4">
        <div className="d-flex align-items-center w-100">
          
          {/* 1. Logo */}
          <Navbar.Brand href="/" className="d-flex flex-column align-items-start me-4 me-lg-5">
            <span className="text-primary-custom fw-bold lh-1" style={{ fontSize: '1.4rem', letterSpacing: '-1px' }}>
              Coachify
            </span>
            <span className="text-primary-custom fw-semibold" style={{ fontSize: '0.65rem', letterSpacing: '0.5px' }}>
              Learn • Lead • Succeed
            </span>
          </Navbar.Brand>

          {/* 2. Full Search Bar (Desktop Only) */}
          <Form className="d-none d-lg-block" style={{ width: '100%', maxWidth: '450px' }}>
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

          {/* Right Side Icons & Buttons Container */}
          <div className="d-flex align-items-center gap-2 gap-md-4 ms-auto">
            
            {/* Search Icon (Mobile Only) */}
            <a href="#" className="d-block d-lg-none text-dark mt-1">
              <FaSearch size={18} />
            </a>

            {/* Premium Badge (Mobile Only) */}
            <div className="d-lg-none d-flex align-items-center">
              {(session?.user as any)?.hasPurchased && (
                <Badge bg="warning" text="dark" className="rounded-pill shadow-sm d-flex align-items-center" style={{ fontSize: '0.7rem', padding: '0.4em 0.5em' }}>
                  <FaCrown className="text-danger" />
                </Badge>
              )}
            </div>

            {/* CAT SANKALP SALE Button (Desktop Only) */}
            <Button 
              className="d-none d-lg-flex rounded px-3 border-0 align-items-center gap-2 me-lg-4"
              style={{ backgroundColor: '#9b00ff', color: 'white' }}
              onClick={() => setShowSaleModal(true)}
            >
              <FaShoppingCart /> <span className="fst-italic fw-bold">CAT SANKALP SALE</span>
            </Button>

            {/* My Dashboard (Desktop Only) */}
            <div className="d-none d-lg-flex align-items-center">
              {session ? (
                <Link href="/dashboard" className="d-flex align-items-center text-decoration-none hover-primary">
                  <span className="text-dark fw-medium me-2" style={{ fontSize: '0.95rem' }}>
                    Hi, {session.user?.name?.split(' ')[0]}
                  </span>
                  {(session.user as any)?.hasPurchased && (
                    <Badge bg="warning" text="dark" className="rounded-pill d-flex align-items-center shadow-sm" style={{ fontSize: '0.75rem', padding: '0.4em 0.6em' }}>
                      <FaCrown className="me-1 text-danger" /> Premium
                    </Badge>
                  )}
                </Link>
              ) : (
                <a href="#" className="text-dark text-decoration-none fw-medium" style={{ fontSize: '0.95rem' }}>
                  My Dashboard
                </a>
              )}
            </div>


            {/* WhatsApp Icon (Both) */}
            <OverlayTrigger
              placement="bottom"
              trigger="click"
              rootClose
              overlay={
                <Tooltip id="whatsapp-tooltip" className="fs-6 px-2 py-1 fw-bold">
                  +91 83060 56876
                </Tooltip>
              }
            >
              <div className="cursor-pointer">
                <FaWhatsapp size={22} color="#25D366" />
              </div>
            </OverlayTrigger>

            {/* Login/Logout Button (Both, smaller padding on mobile) */}
            {session ? (
              <Button 
                className="btn-custom-primary rounded px-3 px-md-4 py-1 py-md-2 fw-medium border-0"
                style={{ fontSize: '0.9rem' }}
                onClick={() => signOut()}
              >
                Logout
              </Button>
            ) : (
              <Button 
                className="btn-custom-primary rounded px-3 px-md-4 py-1 py-md-2 fw-medium border-0"
                style={{ fontSize: '0.9rem' }}
                onClick={() => setShowLoginModal(true)}
              >
                Login
              </Button>
            )}
          </div>
        </div>
      </Container>

      {/* Premium Sale Modal */}
      <Modal show={showSaleModal} onHide={() => setShowSaleModal(false)} centered contentClassName="border-0 rounded-4 shadow-lg overflow-hidden">
        <Modal.Header closeButton className="border-0 pb-0 pt-4 px-4 px-md-5">
          <Modal.Title className="fw-bold text-dark d-flex align-items-center fs-4">
            {(session?.user as any)?.hasPurchased ? (
              <><FaCrown className="text-warning me-2" /> Premium Member</>
            ) : (
              <><FaShoppingCart className="text-primary-custom me-2" /> CAT Sankalp Sale</>
            )}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="px-4 px-md-5 pb-5 pt-3">
          {(session?.user as any)?.hasPurchased ? (
            <div className="text-center">
              <div className="bg-light-blue rounded-4 p-4 mb-4 border border-primary-custom shadow-sm" style={{ backgroundColor: '#f0e6ff' }}>
                <FaCrown size={48} className="text-warning mb-3" />
                <h4 className="fw-bold text-primary-custom mb-2">You are a Premium Member!</h4>
                <p className="text-dark small mb-0 fw-medium">Thank you for your purchase.</p>
              </div>
              <p className="text-muted mb-4 px-2">
                You have full access to advanced operations, all difficulties, and detailed analytics on your personal dashboard!
              </p>
              <Button 
                className="w-100 py-3 fw-bold border-0 shadow rounded-3 mt-2"
                style={{ background: 'linear-gradient(135deg, #9b00ff 0%, #6a00ff 100%)', color: '#fff', fontSize: '1.05rem' }}
                onClick={() => {
                  setShowSaleModal(false);
                  router.push('/dashboard');
                }}
              >
                Go to My Dashboard
              </Button>
            </div>
          ) : (
            <>
              <div className="bg-light-blue rounded-4 p-4 mb-4 text-center border border-primary-custom position-relative shadow-sm" style={{ backgroundColor: '#f0e6ff' }}>
                <h4 className="fw-bold text-primary-custom mb-3">Unlock Premium at <span className="text-danger">25% OFF!</span></h4>
                <p className="text-dark small mb-0 fw-medium">Use code <span className="badge bg-white text-primary-custom border border-primary-custom fs-6 px-3 py-2 ms-1 shadow-sm">SANKALP25</span> at checkout</p>
              </div>

              <p className="text-muted mb-4 text-center px-2">
                Take your speed math skills to the next level with our premium features. Perfect for competitive exams like CAT!
              </p>
              
              <ul className="list-unstyled mb-4">
                <li className="d-flex align-items-center mb-3">
                  <div className="text-white rounded-circle d-flex align-items-center justify-content-center me-3 flex-shrink-0 shadow-sm" style={{ width: '32px', height: '32px', backgroundColor: '#9b00ff' }}>
                    <FaTimesCircle size={14} />
                  </div>
                  <span className="fw-medium text-dark">Advanced Operations (Multiplication & Division)</span>
                </li>
                <li className="d-flex align-items-center mb-3">
                  <div className="bg-warning text-dark rounded-circle d-flex align-items-center justify-content-center me-3 flex-shrink-0 shadow-sm" style={{ width: '32px', height: '32px' }}>
                    <FaBolt size={14} />
                  </div>
                  <span className="fw-medium text-dark">Higher Difficulties (Medium & Hard)</span>
                </li>
                <li className="d-flex align-items-center mb-3">
                  <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center me-3 flex-shrink-0 shadow-sm" style={{ width: '32px', height: '32px' }}>
                    <FaPlusCircle size={14} />
                  </div>
                  <span className="fw-medium text-dark">Save all attempts and view detailed analytics</span>
                </li>
              </ul>

              <Button 
                className="w-100 py-3 fw-bold border-0 shadow rounded-3 mt-2"
                style={{ background: 'linear-gradient(135deg, #9b00ff 0%, #6a00ff 100%)', color: '#fff', fontSize: '1.05rem' }}
                onClick={() => {
                  setShowSaleModal(false);
                  if (!session) {
                    setShowLoginModal(true);
                  } else {
                    router.push('/checkout');
                  }
                }}
              >
                Upgrade to Premium Now
              </Button>
            </>
          )}
        </Modal.Body>
      </Modal>

      {/* Login Modal */}
      <Modal show={showLoginModal} onHide={() => setShowLoginModal(false)} centered contentClassName="border-0 rounded-4 shadow-lg">
        <Modal.Header closeButton className="border-0 pb-0"></Modal.Header>
        <Modal.Body className="px-4 px-md-5 pb-5 pt-0">
          <div className="text-center mb-4">
            <div className="bg-light-blue text-primary-custom rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '64px', height: '64px' }}>
              <FaUserCircle size={32} />
            </div>
            <h3 className="fw-bold text-dark mb-1">Welcome Back</h3>
            <p className="text-muted small">Enter your details to access your account</p>
          </div>

          {error && <div className="alert alert-danger py-2 small border-0 rounded-3 shadow-sm">{error}</div>}

          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3" controlId="navbarEmail">
              <Form.Label className="fw-medium small mb-1 text-secondary">Email address</Form.Label>
              <InputGroup className="shadow-sm rounded-3 overflow-hidden">
                <InputGroup.Text className="bg-light border-0 text-muted px-3">
                  <FaEnvelope />
                </InputGroup.Text>
                <Form.Control 
                  type="email" 
                  placeholder="name@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border-0 bg-light py-2 shadow-none"
                />
              </InputGroup>
            </Form.Group>

            <Form.Group className="mb-4" controlId="navbarPassword">
              <Form.Label className="fw-medium small mb-1 text-secondary">Password</Form.Label>
              <InputGroup className="shadow-sm rounded-3 overflow-hidden">
                <InputGroup.Text className="bg-light border-0 text-muted px-3">
                  <FaLock />
                </InputGroup.Text>
                <Form.Control 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="border-0 bg-light py-2 shadow-none"
                />
              </InputGroup>
            </Form.Group>

            <Button 
              variant="primary" 
              type="submit"
              className="w-100 py-2 fw-bold btn-custom-primary rounded-3 shadow-sm mb-4"
              disabled={loading}
              style={{ fontSize: '1.05rem' }}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </Form>

          <div className="text-center">
            <span className="text-muted small">Don&apos;t have an account? </span>
            <span 
              className="text-primary-custom fw-bold small cursor-pointer" 
              style={{cursor: 'pointer'}} 
              onClick={() => { setShowLoginModal(false); setShowSignupModal(true); }}
            >
              Sign up
            </span>
          </div>
        </Modal.Body>
      </Modal>

      {/* Signup Modal */}
      <Modal show={showSignupModal} onHide={() => setShowSignupModal(false)} centered contentClassName="border-0 rounded-4 shadow-lg">
        <Modal.Header closeButton className="border-0 pb-0"></Modal.Header>
        <Modal.Body className="px-4 px-md-5 pb-5 pt-0">
          <div className="text-center mb-4">
            <div className="bg-light-blue text-primary-custom rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '64px', height: '64px' }}>
              <FaBolt size={28} />
            </div>
            <h3 className="fw-bold text-dark mb-1">Create an Account</h3>
            <p className="text-muted small">Join Coachify to unlock premium features!</p>
          </div>

          {error && <div className="alert alert-danger py-2 small border-0 rounded-3 shadow-sm">{error}</div>}

          <Form onSubmit={handleSignup}>
            <Form.Group className="mb-3" controlId="signupName">
              <Form.Label className="fw-medium small mb-1 text-secondary">Full Name</Form.Label>
              <InputGroup className="shadow-sm rounded-3 overflow-hidden">
                <InputGroup.Text className="bg-light border-0 text-muted px-3">
                  <FaUser />
                </InputGroup.Text>
                <Form.Control 
                  type="text" 
                  placeholder="John Doe" 
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  required
                  className="border-0 bg-light py-2 shadow-none"
                />
              </InputGroup>
            </Form.Group>

            <Form.Group className="mb-3" controlId="signupEmail">
              <Form.Label className="fw-medium small mb-1 text-secondary">Email address</Form.Label>
              <InputGroup className="shadow-sm rounded-3 overflow-hidden">
                <InputGroup.Text className="bg-light border-0 text-muted px-3">
                  <FaEnvelope />
                </InputGroup.Text>
                <Form.Control 
                  type="email" 
                  placeholder="name@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border-0 bg-light py-2 shadow-none"
                />
              </InputGroup>
            </Form.Group>

            <Form.Group className="mb-4" controlId="signupPassword">
              <Form.Label className="fw-medium small mb-1 text-secondary">Password</Form.Label>
              <InputGroup className="shadow-sm rounded-3 overflow-hidden">
                <InputGroup.Text className="bg-light border-0 text-muted px-3">
                  <FaLock />
                </InputGroup.Text>
                <Form.Control 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="border-0 bg-light py-2 shadow-none"
                />
              </InputGroup>
            </Form.Group>

            <Button 
              variant="primary" 
              type="submit"
              className="w-100 py-2 fw-bold btn-custom-primary rounded-3 shadow-sm mb-4"
              disabled={loading}
              style={{ fontSize: '1.05rem' }}
            >
              {loading ? 'Signing up...' : 'Sign Up'}
            </Button>
          </Form>

          <div className="text-center">
            <span className="text-muted small">Already have an account? </span>
            <span 
              className="text-primary-custom fw-bold small cursor-pointer" 
              style={{cursor: 'pointer'}} 
              onClick={() => { setShowSignupModal(false); setShowLoginModal(true); }}
            >
              Login
            </span>
          </div>
        </Modal.Body>
      </Modal>

    </Navbar>
  );
}
