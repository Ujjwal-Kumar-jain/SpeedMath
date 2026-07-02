'use client';

import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { FaBolt, FaPlusCircle, FaMinusCircle, FaTimesCircle, FaDivide } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [difficulty, setDifficulty] = useState('Easy');
  const [selectedOperations, setSelectedOperations] = useState<string[]>(['Addition']);

  const toggleOperation = (op: string) => {
    if (selectedOperations.includes(op)) {
      setSelectedOperations(selectedOperations.filter(item => item !== op));
    } else {
      setSelectedOperations([...selectedOperations, op]);
    }
  };

  const selectAll = () => {
    setSelectedOperations(['Addition', 'Subtraction', 'Multiplication', 'Division']);
  };

  return (
    <div className="landing-bg min-vh-100 d-flex align-items-center">
      <Container>
        <Row className="align-items-center gy-5">
          {/* Left Column */}
          <Col lg={7} className="pe-lg-5">
            <h1 className="display-4 fw-bold mb-4">
              <span className="text-dark">CAT</span> <span className="text-primary-custom">Speed Maths</span><br />
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
                    className="text-primary-custom cursor-pointer" 
                    onClick={selectAll}
                    style={{cursor: 'pointer'}}
                  >
                    Select All
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
                      className={`operation-box rounded-3 p-3 d-flex align-items-center justify-content-between border ${selectedOperations.includes('Multiplication') ? 'border-primary-custom bg-light-blue' : 'bg-white'}`}
                      onClick={() => toggleOperation('Multiplication')}
                    >
                      <div className="d-flex align-items-center text-dark fw-medium">
                        <FaTimesCircle className="text-warning me-2 fs-5" /> Multiplication
                      </div>
                      <Form.Check 
                        type="checkbox" 
                        checked={selectedOperations.includes('Multiplication')} 
                        readOnly 
                      />
                    </div>
                  </Col>
                  <Col xs={6}>
                    <div 
                      className={`operation-box rounded-3 p-3 d-flex align-items-center justify-content-between border ${selectedOperations.includes('Division') ? 'border-primary-custom bg-light-blue' : 'bg-white'}`}
                      onClick={() => toggleOperation('Division')}
                    >
                      <div className="d-flex align-items-center text-dark fw-medium">
                        <FaDivide className="text-primary-custom me-2 fs-5" /> Division
                      </div>
                      <Form.Check 
                        type="checkbox" 
                        checked={selectedOperations.includes('Division')} 
                        readOnly 
                      />
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
                  <Button 
                    variant={difficulty === 'Medium' ? 'outline-primary' : 'outline-secondary'} 
                    className={`rounded-pill px-4 ${difficulty === 'Medium' ? 'border-primary-custom text-primary-custom bg-light-blue' : 'border-light-gray text-dark bg-white'}`}
                    onClick={() => setDifficulty('Medium')}
                  >
                    Medium
                  </Button>
                  <Button 
                    variant={difficulty === 'Hard' ? 'outline-primary' : 'outline-secondary'} 
                    className={`rounded-pill px-4 ${difficulty === 'Hard' ? 'border-primary-custom text-primary-custom bg-light-blue' : 'border-light-gray text-dark bg-white'}`}
                    onClick={() => setDifficulty('Hard')}
                  >
                    Hard
                  </Button>
                </div>

                <Button 
                  variant="primary" 
                  size="lg" 
                  className="w-100 rounded-3 fw-bold btn-custom-primary mb-3"
                  onClick={() => {
                    if (selectedOperations.length === 0) return alert('Select at least one operation!');
                    // For MVP, we just take the first selected operation
                    const op = selectedOperations[0];
                    router.push(`/practice?category=${op}&difficulty=${difficulty}`);
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
  );
}
