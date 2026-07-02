'use client';

import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FaBolt, FaPlusCircle, FaMinusCircle, FaTimesCircle, FaDivide, FaLock } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { useSession, signIn } from 'next-auth/react';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession();
  
  // Premium Status Check
  const hasPurchased = session?.user && (session.user as any).hasPurchased;
  const isFreeUser = !hasPurchased;

  const [showModal, setShowModal] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [difficulty, setDifficulty] = useState('Easy');
  const [selectedOperations, setSelectedOperations] = useState<string[]>(['Addition']);

  // Login Modal State
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
      const opsParam = selectedOperations.join(',');
      router.push(`/practice?category=${opsParam}&difficulty=${difficulty}`);
    }
  };

  const toggleOperation = (op: string) => {
    if (selectedOperations.includes(op)) {
      setSelectedOperations(selectedOperations.filter(item => item !== op));
    } else {
      setSelectedOperations([...selectedOperations, op]);
    }
  };

  const availableOperations = isFreeUser 
    ? ['Addition', 'Subtraction'] 
    : ['Addition', 'Subtraction', 'Multiplication', 'Division'];

  const allSelected = availableOperations.length > 0 && availableOperations.every(op => selectedOperations.includes(op));

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedOperations([]);
    } else {
      setSelectedOperations([...availableOperations]);
    }
  };

  return (
    <div className="landing-bg min-vh-100 d-flex align-items-center">
      <Container>
        <Row className="align-items-center gy-5">
          {/* Left Column */}
          <Col lg={7} className="pe-lg-5">
            <h1 className="display-4 fw-bold mb-4">
              <span className="text-dark">CAT</span>{' '}
              <span 
                className="fw-bold" 
                style={{ 
                  background: 'linear-gradient(45deg, #f39c12, #5C35A5)', 
                  WebkitBackgroundClip: 'text', 
                  WebkitTextFillColor: 'transparent' 
                }}
              >
                Speed Maths
              </span><br />
              <span className="text-dark">Practice Questions</span>
            </h1>
            
            <p className="text-secondary mb-5 fs-5">
              At Coachify, we empower students with accessible and transformative education to shape future-ready minds. 
              This Speed Maths tool is designed to test and improve your rapid calculation skills across addition, 
              subtraction, multiplication, and division. Choose your options and hit &apos;Let&apos;s get started&apos; on your 
              quest for numerical mastery!
            </p>

            <div className="d-flex gap-3 flex-wrap">
              <div className="stat-box bg-white rounded-3 shadow-sm p-3 text-center flex-grow-1">
                <h3 className="fw-bold mb-1">20K+</h3>
                <small className="text-muted">Total number of users</small>
              </div>
              <div className="stat-box bg-white rounded-3 shadow-sm p-3 text-center flex-grow-1">
                <h3 className="fw-bold mb-1">4</h3>
                <small className="text-muted">Operations available</small>
              </div>
              <div className="stat-box bg-white rounded-3 shadow-sm p-3 text-center flex-grow-1">
                <h3 className="fw-bold mb-1">3</h3>
                <small className="text-muted">Difficulty levels</small>
              </div>
            </div>
          </Col>

          {/* Right Column (Card) */}
          <Col lg={5}>
            <Card className="shadow-lg border-0 rounded-4 overflow-hidden">
              <div className="card-header-custom text-white p-4">
                <h4 className="mb-0 d-flex align-items-center fw-semibold">
                  <FaBolt className="text-warning me-2 fs-3" />
                  <em>Start Practicing Now...</em>
                </h4>
              </div>
              
              <Card.Body className="p-4 bg-light-custom">
                {/* Operations Section */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="fw-bold mb-0">Select operations</h6>
                  <small 
                    className="text-primary-custom cursor-pointer fw-semibold" 
                    onClick={toggleSelectAll}
                    style={{cursor: 'pointer'}}
                  >
                    {allSelected ? 'Deselect All' : 'Select All'}
                  </small>
                </div>
                <small className="text-muted d-block mb-3">You can select multiple operations</small>

                <Row className="g-3 mb-4">
                  <Col xs={6}>
                    <div 
                      className={`operation-box rounded-3 p-3 d-flex align-items-center justify-content-between border ${selectedOperations.includes('Addition') ? 'border-primary-custom bg-light-blue' : 'bg-white'}`}
                      onClick={() => toggleOperation('Addition')}
                    >
                      <div className="d-flex align-items-center text-primary-custom fw-medium">
                        <FaPlusCircle className="text-success me-2 fs-5" /> Addition
                      </div>
                      <Form.Check 
                        type="checkbox" 
                        checked={selectedOperations.includes('Addition')} 
                        readOnly 
                      />
                    </div>
                  </Col>
                  <Col xs={6}>
                    <div 
                      className={`operation-box rounded-3 p-3 d-flex align-items-center justify-content-between border ${selectedOperations.includes('Subtraction') ? 'border-primary-custom bg-light-blue' : 'bg-white'}`}
                      onClick={() => toggleOperation('Subtraction')}
                    >
                      <div className="d-flex align-items-center text-dark fw-medium">
                        <FaMinusCircle className="text-danger me-2 fs-5" /> Subtraction
                      </div>
                      <Form.Check 
                        type="checkbox" 
                        checked={selectedOperations.includes('Subtraction')} 
                        readOnly 
                      />
                    </div>
                  </Col>
                  <Col xs={6}>
                    <div 
                      className={`operation-box rounded-3 p-3 d-flex align-items-center justify-content-between border ${selectedOperations.includes('Multiplication') ? 'border-primary-custom bg-light-blue' : 'bg-white'} ${isFreeUser ? 'opacity-50 text-muted' : ''}`}
                      onClick={() => isFreeUser ? setShowPremiumModal(true) : toggleOperation('Multiplication')}
                    >
                      <div className={`d-flex align-items-center fw-bold ${isFreeUser ? 'text-secondary' : 'text-warning'}`}>
                        <FaTimesCircle className="me-2 fs-5" /> Multiplication
                      </div>
                      {isFreeUser ? <FaLock className="text-secondary" /> : (
                        <Form.Check 
                          type="checkbox" 
                          checked={selectedOperations.includes('Multiplication')} 
                          readOnly 
                        />
                      )}
                    </div>
                  </Col>
                  <Col xs={6}>
                    <div 
                      className={`operation-box rounded-3 p-3 d-flex align-items-center justify-content-between border ${selectedOperations.includes('Division') ? 'border-primary-custom bg-light-blue' : 'bg-white'} ${isFreeUser ? 'opacity-50 text-muted' : ''}`}
                      onClick={() => isFreeUser ? setShowPremiumModal(true) : toggleOperation('Division')}
                    >
                      <div className={`d-flex align-items-center fw-bold ${isFreeUser ? 'text-secondary' : 'text-primary-custom'}`}>
                        <FaDivide className="me-2 fs-5" /> Division
                      </div>
                      {isFreeUser ? <FaLock className="text-secondary" /> : (
                        <Form.Check 
                          type="checkbox" 
                          checked={selectedOperations.includes('Division')} 
                          readOnly 
                        />
                      )}
                    </div>
                  </Col>
                </Row>

                {/* Difficulty Section */}
                <h6 className="fw-bold mb-3">Select difficulty</h6>
                <div className="d-flex gap-2 mb-4">
                  <Button 
                    variant={difficulty === 'Easy' ? 'outline-primary' : 'outline-secondary'} 
                    className={`rounded-pill px-4 ${difficulty === 'Easy' ? 'border-primary-custom text-primary-custom bg-light-blue' : 'border-light-gray text-dark bg-white'}`}
                    onClick={() => setDifficulty('Easy')}
                  >
                    Easy
                  </Button>

                  <OverlayTrigger
                    placement="top"
                    overlay={isFreeUser ? <Tooltip id="tooltip-medium">Premium Required</Tooltip> : <></>}
                  >
                    <div className="d-inline-block">
                      <Button 
                        variant={difficulty === 'Medium' ? 'outline-primary' : 'outline-secondary'} 
                        className={`rounded-pill px-4 d-flex align-items-center gap-2 ${difficulty === 'Medium' ? 'border-primary-custom text-primary-custom bg-light-blue' : 'border-light-gray text-dark bg-white'} ${isFreeUser ? 'opacity-50' : ''}`}
                        onClick={() => isFreeUser ? setShowPremiumModal(true) : setDifficulty('Medium')}
                      >
                        {isFreeUser && <FaLock className="small" />} Medium
                      </Button>
                    </div>
                  </OverlayTrigger>

                  <OverlayTrigger
                    placement="top"
                    overlay={isFreeUser ? <Tooltip id="tooltip-hard">Premium Required</Tooltip> : <></>}
                  >
                    <div className="d-inline-block">
                      <Button 
                        variant={difficulty === 'Hard' ? 'outline-primary' : 'outline-secondary'} 
                        className={`rounded-pill px-4 d-flex align-items-center gap-2 ${difficulty === 'Hard' ? 'border-primary-custom text-primary-custom bg-light-blue' : 'border-light-gray text-dark bg-white'} ${isFreeUser ? 'opacity-50' : ''}`}
                        onClick={() => isFreeUser ? setShowPremiumModal(true) : setDifficulty('Hard')}
                      >
                        {isFreeUser && <FaLock className="small" />} Hard
                      </Button>
                    </div>
                  </OverlayTrigger>
                </div>

                <Button 
                  variant="primary" 
                  size="lg" 
                  className="w-100 rounded-3 fw-bold btn-custom-primary mb-3"
                  onClick={() => {
                    if (selectedOperations.length === 0) return alert('Select at least one operation!');
                    
                    if (status === 'authenticated') {
                      const op = selectedOperations[0];
                      router.push(`/practice?category=${op}&difficulty=${difficulty}`);
                    } else {
                      setShowModal(true);
                    }
                  }}
                >
                  Let&apos;s get started
                </Button>
                
                <div className="text-center">
                  <a href="#" className="text-primary-custom text-decoration-none fw-medium">View leaderboard</a>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Guest vs Login Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold text-dark">Login to Play</Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-2 pb-4">
          <p className="text-muted mb-4 small">
            Log in to unlock all features, track your speed, and save to the leaderboard!
          </p>

          {error && <div className="alert alert-danger py-2 small">{error}</div>}

          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3" controlId="modalEmail">
              <Form.Label className="fw-medium small mb-1">Email address</Form.Label>
              <Form.Control 
                type="email" 
                placeholder="Enter email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-4" controlId="modalPassword">
              <Form.Label className="fw-medium small mb-1">Password</Form.Label>
              <Form.Control 
                type="password" 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Button 
              variant="primary" 
              type="submit"
              className="w-100 py-2 fw-bold btn-custom-primary mb-3"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login & Play'}
            </Button>
          </Form>

          <div className="text-center position-relative my-3">
            <hr className="text-muted" />
            <span className="bg-white px-2 position-absolute top-50 start-50 translate-middle text-muted small fw-medium" style={{ backgroundColor: 'white' }}>OR</span>
          </div>

          <Button 
            variant="light" 
            className="w-100 py-3 fw-bold border text-secondary"
            onClick={() => {
              const opsParam = selectedOperations.join(',');
              router.push(`/practice?category=${opsParam}&difficulty=${difficulty}&guest=true`);
            }}
          >
            Play as Guest
          </Button>

          <div className="text-center mt-3">
            <span className="text-muted small">Don&apos;t have an account? </span>
            <Link href={`/register?callbackUrl=${encodeURIComponent(`/practice?category=${selectedOperations.join(',')}&difficulty=${difficulty}`)}`} className="text-primary-custom fw-semibold text-decoration-none small">
              Sign up
            </Link>
          </div>
        </Modal.Body>
      </Modal>

      {/* Premium Features Modal */}
      <Modal show={showPremiumModal} onHide={() => setShowPremiumModal(false)} centered>
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold text-dark d-flex align-items-center">
            <FaBolt className="text-warning me-2" /> Unlock Premium
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-3 pb-4">
          <p className="text-muted mb-4">
            Take your speed math skills to the next level with our premium features. Perfect for competitive exams like CAT!
          </p>
          
          <ul className="list-unstyled mb-4">
            <li className="d-flex align-items-center mb-3">
              <FaTimesCircle className="text-primary-custom me-3 fs-5" />
              <span className="fw-medium">Advanced Operations (Multiplication & Division)</span>
            </li>
            <li className="d-flex align-items-center mb-3">
              <FaBolt className="text-warning me-3 fs-5" />
              <span className="fw-medium">Higher Difficulties (Medium & Hard)</span>
            </li>
            <li className="d-flex align-items-center mb-3">
              <FaPlusCircle className="text-success me-3 fs-5" />
              <span className="fw-medium">Save all attempts and view detailed analytics</span>
            </li>
          </ul>

          <Button 
            variant="warning" 
            className="w-100 py-3 fw-bold text-dark"
            onClick={() => {
              setShowPremiumModal(false);
              // In the future, this could route to a pricing page or stripe checkout
              alert('Premium checkout flow coming soon!');
            }}
          >
            Upgrade to Premium Now
          </Button>
        </Modal.Body>
      </Modal>
    </div>
  );
}
