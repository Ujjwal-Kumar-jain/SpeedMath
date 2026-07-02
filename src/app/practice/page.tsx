'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Container, Card, Button, Row, Col, Spinner, Form } from 'react-bootstrap';
import { useSession } from 'next-auth/react';

export default function PracticePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session, status } = useSession();

  const category = searchParams.get('category') || 'Addition';
  const difficulty = searchParams.get('difficulty') || 'Easy';

  const [question, setQuestion] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string; correctAnswer?: number } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [timer, setTimer] = useState(0);
  const [questionCount, setQuestionCount] = useState(1);
  const [showKeypad, setShowKeypad] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchQuestion = useCallback(async () => {
    setLoading(true);
    setError('');
    setFeedback(null);
    setUserAnswer('');
    
    // Auto-focus input when new question arrives
    setTimeout(() => {
      if (inputRef.current) inputRef.current.focus();
    }, 100);

    try {
      const res = await fetch('/api/questions/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, difficulty })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to generate question');
      }

      setQuestion(data.question);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [category, difficulty]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchQuestion();
    } else if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, fetchQuestion, router]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (question && !feedback) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [question, feedback]);

  // --- AUTO SUBMIT LOGIC ---
  useEffect(() => {
    if (!question || !userAnswer || feedback || submitting) return;
    
    // Calculate what the answer should be (length wise) on the client
    let expectedAnswer = 0;
    if (question.operator === '+') expectedAnswer = question.num1 + question.num2;
    if (question.operator === '-') expectedAnswer = question.num1 - question.num2;
    if (question.operator === '*') expectedAnswer = question.num1 * question.num2;
    if (question.operator === '/') expectedAnswer = question.num1 / question.num2;

    const expectedLength = String(expectedAnswer).length;
    
    // If the user typed enough characters (or a negative sign makes it longer)
    // Note: this auto-submits as soon as the lengths match
    if (userAnswer.replace('-', '').length >= String(Math.abs(expectedAnswer)).length) {
      handleSubmit();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userAnswer, question, feedback, submitting]);

  // --- AUTO ADVANCE ON CORRECT ANSWER ---
  useEffect(() => {
    if (feedback && feedback.isCorrect) {
      const timerId = setTimeout(() => {
        setQuestionCount(prev => prev + 1);
        fetchQuestion();
      }, 50); // Almost immediate, just enough to register the network request finished
      return () => clearTimeout(timerId);
    }
  }, [feedback, fetchQuestion]);

  const handleNumpadClick = (val: string) => {
    if (feedback) return;
    if (val === 'C') {
      setUserAnswer('');
    } else if (val === 'del') {
      setUserAnswer((prev) => prev.slice(0, -1));
    } else {
      setUserAnswer((prev) => prev + val);
    }
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (feedback) {
        setQuestionCount(prev => prev + 1);
        fetchQuestion();
      } else {
        handleSubmit();
      }
    }
  };

  const handleSubmit = async () => {
    if (!userAnswer || !question) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/questions/attempt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: question.category,
          difficulty: question.difficulty,
          signature: question.signature,
          num1: question.num1,
          num2: question.num2,
          operator: question.operator,
          userAnswer: parseInt(userAnswer, 10)
        })
      });

      const data = await res.json();
      setFeedback(data);
    } catch (err: any) {
      alert('Error submitting answer');
    } finally {
      setSubmitting(false);
    }
  };

  // Format timer as MM:SS
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  if (status === 'loading') {
    return <div className="min-vh-100 d-flex justify-content-center align-items-center"><Spinner animation="border" variant="primary" /></div>;
  }

  return (
    <>
      {/* Hide Navbar when Focus mode is ON */}
      {focusMode && (
        <style>{`
          .navbar { display: none !important; }
        `}</style>
      )}

      <Container className="py-5 d-flex justify-content-center">
        <Card className="shadow-lg border-0 overflow-hidden" style={{ width: '100%', maxWidth: '800px', borderRadius: '12px' }}>
          
          {/* Header - Light Blue */}
          <div className="d-flex justify-content-between align-items-center px-4 py-3" style={{ backgroundColor: '#eef6fc', borderBottom: '1px solid #d0e3f2' }}>
            <div style={{ width: '100px' }}>
              <div className="fw-semibold text-secondary mb-1" style={{ fontSize: '0.9rem' }}>{questionCount}/10</div>
              <div style={{ height: '3px', width: '100%', backgroundColor: '#007bff', borderRadius: '2px' }}></div>
            </div>
            
            <div className="fw-bold fs-6" style={{ color: '#007bff' }}>
              Time: {formatTime(timer)}
            </div>
            
            <div style={{ width: '100px' }} className="d-flex justify-content-end align-items-center">
              <Form.Check 
                type="switch"
                id="focus-switch"
                checked={focusMode}
                onChange={(e) => setFocusMode(e.target.checked)}
                label={<span className="text-secondary fw-medium ms-1" style={{fontSize: '0.9rem'}}>Focus</span>}
              />
            </div>
          </div>

          {/* Body */}
          <Card.Body className="p-4 p-md-5 bg-white d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '400px' }}>
            
            {error ? (
              <div className="text-center">
                <h5 className="text-danger">{error}</h5>
                <Button variant="outline-primary" className="mt-3" onClick={() => router.push('/')}>Go Back</Button>
              </div>
            ) : loading ? (
              <div className="text-center">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3 text-muted">Generating unique question...</p>
              </div>
            ) : (
              <>
                {/* Question Text */}
              <h1 className="fw-bold mb-4 text-dark" style={{ fontSize: '5.5rem', letterSpacing: '-2px' }}>
                {question.num1} {question.operator} {question.num2}
              </h1>

              {/* Input Box */}
              <div className="w-100 mt-2" style={{ maxWidth: '500px' }}>
                <Form.Control
                  ref={inputRef}
                  type="number"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={!!feedback || submitting}
                  className="text-center fw-bold rounded-3"
                  style={{ 
                    height: '130px',
                    borderColor: feedback ? (feedback.isCorrect ? '#28a745' : '#dc3545') : '#e0e0e0', 
                    borderWidth: '1px',
                    boxShadow: 'none',
                    color: feedback ? (feedback.isCorrect ? '#28a745' : '#dc3545') : '#222',
                    fontSize: '5.5rem',
                    letterSpacing: '-1px',
                    backgroundColor: '#f6f6f6'
                  }}
                  autoFocus
                />
              </div>

                {/* Feedback Overlay */}
                {feedback && !feedback.isCorrect && (
                  <div className="mt-3 text-danger fw-bold fs-5 text-center">
                    Correct Answer: {feedback.correctAnswer}
                    <div className="small text-muted fw-normal mt-1">(Press Enter for next question)</div>
                  </div>
                )}

                {/* Show Keypad Toggle */}
                <div 
                  className="mt-3 text-secondary small cursor-pointer" 
                  onClick={() => setShowKeypad(!showKeypad)}
                  style={{ cursor: 'pointer' }}
                >
                  {showKeypad ? 'Hide keypad' : 'Show keypad'}
                </div>

                {/* Collapsible Keypad */}
                {showKeypad && (
                  <div className="numpad-container mx-auto mt-4" style={{ maxWidth: '300px', width: '100%' }}>
                    <Row className="g-2 mb-2">
                      {['7', '8', '9'].map((num) => (
                        <Col xs={4} key={num}>
                          <Button variant="light" className="w-100 py-3 fw-bold fs-5 border shadow-sm" onClick={() => handleNumpadClick(num)}>{num}</Button>
                        </Col>
                      ))}
                    </Row>
                    <Row className="g-2 mb-2">
                      {['4', '5', '6'].map((num) => (
                        <Col xs={4} key={num}>
                          <Button variant="light" className="w-100 py-3 fw-bold fs-5 border shadow-sm" onClick={() => handleNumpadClick(num)}>{num}</Button>
                        </Col>
                      ))}
                    </Row>
                    <Row className="g-2 mb-2">
                      {['1', '2', '3'].map((num) => (
                        <Col xs={4} key={num}>
                          <Button variant="light" className="w-100 py-3 fw-bold fs-5 border shadow-sm" onClick={() => handleNumpadClick(num)}>{num}</Button>
                        </Col>
                      ))}
                    </Row>
                    <Row className="g-2 mb-3">
                      <Col xs={4}>
                        <Button variant="danger" className="w-100 py-3 fw-bold fs-5 border shadow-sm" onClick={() => handleNumpadClick('C')}>C</Button>
                      </Col>
                      <Col xs={4}>
                        <Button variant="light" className="w-100 py-3 fw-bold fs-5 border shadow-sm" onClick={() => handleNumpadClick('0')}>0</Button>
                      </Col>
                      <Col xs={4}>
                        <Button variant="warning" className="w-100 py-3 fw-bold fs-5 border shadow-sm text-white" onClick={() => handleNumpadClick('del')}>←</Button>
                      </Col>
                    </Row>
                  </div>
                )}

              {/* Submit button completely removed as per request! */}
              {/* Next button ONLY shows when feedback is present AND incorrect */}
              <div className="mt-4 w-100" style={{ maxWidth: '400px' }}>
                {feedback && !feedback.isCorrect && (
                  <Button variant="primary" className="w-100 py-3 fw-bold btn-custom-primary" onClick={() => {
                    setQuestionCount(prev => prev + 1);
                    fetchQuestion();
                  }}>
                    Next Question
                  </Button>
                )}
              </div>
              </>
            )}
          </Card.Body>
        </Card>
      </Container>
    </>
  );
}
