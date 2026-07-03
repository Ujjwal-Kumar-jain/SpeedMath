'use client';

import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Modal, OverlayTrigger, Tooltip, InputGroup } from 'react-bootstrap';
import { FaBolt, FaPlusCircle, FaMinusCircle, FaTimesCircle, FaDivide, FaLock, FaShoppingCart, FaUserCircle, FaEnvelope, FaUser } from 'react-icons/fa';
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

  // Signup Modal State
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [signupName, setSignupName] = useState('');

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
        const opsParam = selectedOperations.join(',');
        router.push(`/practice?category=${opsParam}&difficulty=${difficulty}`);
      }
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
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
    <>
      <div className="landing-bg min-vh-100 d-flex align-items-center pb-5">
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
      </div>

      {/* --- INFO SECTION (SCROLL DOWN) --- */}
      <div className="bg-white py-5">
        <Container className="py-5">
          <Row className="justify-content-center">
            <Col lg={12}>
              
              {/* Section 1: What is Speed Math */}
              <div className="mb-5">
                <h2 className="fw-bold mb-4 text-dark" style={{ letterSpacing: '-1px' }}>What Is Speed Math?</h2>
                <p className="text-secondary fs-5 mb-4 lh-lg">
                  Speed Math is the ability to perform mathematical calculations quickly and accurately, a crucial skill for competitive exams like the CAT exam, where time is a key factor. The Quantitative Aptitude section of the CAT tests both mathematical understanding and problem-solving speed. Speed Math can reduce the need for calculators and help candidates manage their time more effectively, leading to improved accuracy and higher scores.
                </p>
                <p className="text-dark fw-medium fs-5 mb-4">
                  CAT aspirants should focus on Speed Math which will help them to improve their performance for several reasons:
                </p>
                <Row className="g-4">
                  <Col md={4}>
                    <Card className="h-100 border-0 shadow-sm bg-light-blue">
                      <Card.Body className="p-4">
                        <h5 className="fw-bold text-primary-custom mb-3">Time Management</h5>
                        <p className="text-secondary mb-0">The ability to solve math problems faster offers a significant advantage when dealing with a vast number of questions in limited time.</p>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={4}>
                    <Card className="h-100 border-0 shadow-sm bg-light-blue">
                      <Card.Body className="p-4">
                        <h5 className="fw-bold text-primary-custom mb-3">Improved Accuracy</h5>
                        <p className="text-secondary mb-0">Speed Math isn't just about speed; accuracy is just as important. Speed Math techniques ensure you reach the correct answer while saving time.</p>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={4}>
                    <Card className="h-100 border-0 shadow-sm bg-light-blue">
                      <Card.Body className="p-4">
                        <h5 className="fw-bold text-primary-custom mb-3">Better Focus</h5>
                        <p className="text-secondary mb-0">By saving time on simpler calculations, you can devote more attention to complex, time-consuming problems that require deeper thought.</p>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </div>

              <hr className="my-5 text-muted" />

              {/* Section 2: Formulas */}
              <div className="mb-5">
                <h2 className="fw-bold mb-4 text-dark" style={{ letterSpacing: '-1px' }}>Speed Maths Question Formulas</h2>
                <p className="text-secondary fs-5 mb-4 lh-lg">
                  Speed Math focuses on using formulas and shortcuts to perform quick calculations, step-wise problem-solving without detailed manual steps. These formulas are important for effectively solving speed math questions in exams like CAT.
                </p>
                
                <div className="bg-light-custom rounded-4 p-4 p-md-5">
                  <div className="mb-4">
                    <h5 className="fw-bold text-dark"><span className="text-primary-custom me-2">1.</span>Multiplication Shortcuts</h5>
                    <p className="text-secondary ms-4 mb-0"><strong>Vedic Math Trick:</strong> Break down two-digit numbers for faster multiplication. For instance, to multiply 98 × 97, calculate 100 - 98 = 2 and 100 - 97 = 3. Subtract 2 + 3 from 100 and multiply the differences (2 × 3 = 6), giving the final answer: 9506.</p>
                  </div>
                  <div className="mb-4">
                    <h5 className="fw-bold text-dark"><span className="text-primary-custom me-2">2.</span>Percentage Shortcuts</h5>
                    <p className="text-secondary ms-4 mb-0"><strong>10% Rule:</strong> To calculate 10% of any number, simply move the decimal one place to the left. For example, 10% of 450 = 45.<br/><strong>50% Rule:</strong> For 50%, divide the number by 2. For example, 50% of 600 = 300.</p>
                  </div>
                  <div className="mb-4">
                    <h5 className="fw-bold text-dark"><span className="text-primary-custom me-2">3.</span>Square Roots</h5>
                    <p className="text-secondary ms-4 mb-0">To approximate square roots for numbers close to perfect squares, use nearby values. For example, for √52, use √49 = 7 and adjust the answer slightly.</p>
                  </div>
                  <div className="mb-4">
                    <h5 className="fw-bold text-dark"><span className="text-primary-custom me-2">4.</span>LCM and HCF</h5>
                    <p className="text-secondary ms-4 mb-0">Use the prime factorization method to calculate the Least Common Multiple (LCM) and Highest Common Factor (HCF) efficiently.</p>
                  </div>
                  <div className="mb-0">
                    <h5 className="fw-bold text-dark"><span className="text-primary-custom me-2">5.</span>Simplification Techniques</h5>
                    <p className="text-secondary ms-4 mb-0"><strong>BODMAS Rule:</strong> Prioritize the order of operations—Brackets, Orders (powers and roots), Division and Multiplication, Addition and Subtraction—while simplifying complex expressions.</p>
                  </div>
                </div>
              </div>

              <hr className="my-5 text-muted" />

              {/* Section 3: How to improve */}
              <div className="mb-5">
                <h2 className="fw-bold mb-4 text-dark" style={{ letterSpacing: '-1px' }}>How Can I Improve Speed Maths for CAT?</h2>
                <p className="text-secondary fs-5 mb-4 lh-lg">
                  Improving Speed Math for CAT requires consistent effort and a structured strategy. Here's a step-by-step guide to help develop these skills:
                </p>
                
                <Row className="g-4">
                  {[
                    { title: 'Daily Practice', desc: 'Dedicate 30 minutes daily to practicing Speed Math questions using CAT-specific resources. Regular practice will help you become used to the exam format and increase your calculation speed.' },
                    { title: 'Focus on Accuracy First', desc: 'Initially, aim for accuracy rather than speed. As your confidence and precision improve, it will automatically increase your speed.' },
                    { title: 'Timed Tests', desc: 'Once you\'re comfortable with Speed Math concepts, start taking timed tests. Gradually reduce the time allotted for each question to be familiar with real exam pressure.' },
                    { title: 'Mock Tests', desc: 'Full-length CAT mock tests are essential. They provide a real-time exam experience, allowing you to apply Speed Math skills under pressure and refine your time management.' },
                    { title: 'Revise Regularly', desc: 'Consistent practice and regularity are important for Speed Math. Frequent practice makes the techniques more automatic, and helps identify weak areas for improvement.' },
                  ].map((item, idx) => (
                    <Col md={6} key={idx}>
                      <div className="d-flex align-items-start">
                        <div className="bg-primary-custom text-white rounded-circle d-flex align-items-center justify-content-center fw-bold me-3 flex-shrink-0" style={{ width: '40px', height: '40px' }}>
                          {idx + 1}
                        </div>
                        <div>
                          <h5 className="fw-bold text-dark mb-2">{item.title}</h5>
                          <p className="text-secondary">{item.desc}</p>
                        </div>
                      </div>
                    </Col>
                  ))}
                </Row>
              </div>

            </Col>
          </Row>
        </Container>
      </div>

      {/* Guest vs Login Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered contentClassName="border-0 rounded-4 shadow-lg">
        <Modal.Header closeButton className="border-0 pb-0"></Modal.Header>
        <Modal.Body className="px-4 px-md-5 pb-5 pt-0">
          <div className="text-center mb-4">
            <div className="bg-light-blue text-primary-custom rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '64px', height: '64px' }}>
              <FaUserCircle size={32} />
            </div>
            <h3 className="fw-bold text-dark mb-1">Login to Play</h3>
            <p className="text-muted small">Log in to unlock all features and save your score!</p>
          </div>

          {error && <div className="alert alert-danger py-2 small border-0 rounded-3 shadow-sm">{error}</div>}

          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3" controlId="modalEmail">
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

            <Form.Group className="mb-4" controlId="modalPassword">
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
              className="w-100 py-2 fw-bold btn-custom-primary rounded-3 shadow-sm mb-3"
              disabled={loading}
              style={{ fontSize: '1.05rem' }}
            >
              {loading ? 'Logging in...' : 'Login & Play'}
            </Button>
          </Form>

          <div className="text-center position-relative my-3">
            <hr className="text-muted" />
            <span className="px-3 position-absolute top-50 start-50 translate-middle text-muted small fw-medium" style={{ backgroundColor: '#fff' }}>OR</span>
          </div>

          <Button 
            variant="light" 
            className="w-100 py-3 fw-bold border rounded-3 text-secondary shadow-sm"
            onClick={() => {
              const opsParam = selectedOperations.join(',');
              router.push(`/practice?category=${opsParam}&difficulty=${difficulty}&guest=true`);
            }}
          >
            Play as Guest
          </Button>

          <div className="text-center mt-4">
            <span className="text-muted small">Don&apos;t have an account? </span>
            <span 
              className="text-primary-custom fw-bold small cursor-pointer" 
              style={{cursor: 'pointer'}} 
              onClick={() => { setShowModal(false); setShowSignupModal(true); }}
            >
              Sign up
            </span>
          </div>
        </Modal.Body>
      </Modal>

      {/* Signup Modal for Practice Page */}
      <Modal show={showSignupModal} onHide={() => setShowSignupModal(false)} centered contentClassName="border-0 rounded-4 shadow-lg">
        <Modal.Header closeButton className="border-0 pb-0"></Modal.Header>
        <Modal.Body className="px-4 px-md-5 pb-5 pt-0">
          <div className="text-center mb-4">
            <div className="bg-light-blue text-primary-custom rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '64px', height: '64px' }}>
              <FaBolt size={28} />
            </div>
            <h3 className="fw-bold text-dark mb-1">Create an Account</h3>
            <p className="text-muted small">Join Coachify to unlock premium features and track your speed!</p>
          </div>

          {error && <div className="alert alert-danger py-2 small border-0 rounded-3 shadow-sm">{error}</div>}

          <Form onSubmit={handleSignup}>
            <Form.Group className="mb-3" controlId="pageSignupName">
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

            <Form.Group className="mb-3" controlId="pageSignupEmail">
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

            <Form.Group className="mb-4" controlId="pageSignupPassword">
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
              {loading ? 'Signing up...' : 'Sign Up & Play'}
            </Button>
          </Form>

          <div className="text-center">
            <span className="text-muted small">Already have an account? </span>
            <span 
              className="text-primary-custom fw-bold small cursor-pointer" 
              style={{cursor: 'pointer'}} 
              onClick={() => { setShowSignupModal(false); setShowModal(true); }}
            >
              Login
            </span>
          </div>
        </Modal.Body>
      </Modal>

      {/* Premium Features Modal */}
      <Modal show={showPremiumModal} onHide={() => setShowPremiumModal(false)} centered contentClassName="border-0 rounded-4 shadow-lg overflow-hidden">
        <Modal.Header closeButton className="border-0 pb-0 pt-4 px-4 px-md-5">
          <Modal.Title className="fw-bold text-dark d-flex align-items-center fs-4">
            <FaShoppingCart className="text-primary-custom me-2" /> CAT Sankalp Sale
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="px-4 px-md-5 pb-5 pt-3">
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
              setShowPremiumModal(false);
              router.push('/checkout');
            }}
          >
            Upgrade to Premium Now
          </Button>
        </Modal.Body>
      </Modal>
    </>
  );
}
