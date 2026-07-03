'use client';

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Spinner, Table, ProgressBar } from 'react-bootstrap';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FaChartPie, FaCheckCircle, FaTimesCircle, FaTrophy, FaHistory } from 'react-icons/fa';
import Link from 'next/link';

interface Attempt {
  _id: string;
  category: string;
  difficulty: string;
  questionSignature: string;
  isCorrect: boolean;
  createdAt: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/?login=true');
    } else if (status === 'authenticated') {
      const hasPurchased = (session.user as any)?.hasPurchased;
      if (!hasPurchased) {
        router.push('/checkout');
      } else {
        fetchAttempts();
      }
    }
  }, [status, session, router]);

  const fetchAttempts = async () => {
    try {
      const res = await fetch('/api/user/attempts');
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Failed to fetch attempts');
      }
      
      setAttempts(data.attempts);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-vh-100 d-flex justify-content-center align-items-center bg-light">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  // Calculate Metrics
  const totalAttempts = attempts.length;
  const correctAttempts = attempts.filter(a => a.isCorrect).length;
  const overallAccuracy = totalAttempts === 0 ? 0 : Math.round((correctAttempts / totalAttempts) * 100);

  // Category Breakdown
  const categories = ['Addition', 'Subtraction', 'Multiplication', 'Division'];
  const categoryStats = categories.map(cat => {
    const catAttempts = attempts.filter(a => a.category === cat);
    const catTotal = catAttempts.length;
    const catCorrect = catAttempts.filter(a => a.isCorrect).length;
    const catAccuracy = catTotal === 0 ? 0 : Math.round((catCorrect / catTotal) * 100);
    return { name: cat, total: catTotal, accuracy: catAccuracy };
  });

  // Find strongest category (must have at least 1 attempt)
  const activeCategories = categoryStats.filter(c => c.total > 0);
  const strongestCategory = activeCategories.length > 0 
    ? activeCategories.reduce((prev, current) => (prev.accuracy > current.accuracy) ? prev : current)
    : { name: 'None', accuracy: 0 };

  return (
    <div className="min-vh-100 bg-light py-5">
      <Container className="py-4">
        <div className="mb-5">
          <h2 className="fw-bold text-dark d-flex align-items-center mb-1">
            <FaChartPie className="text-primary-custom me-3" /> 
            My Premium Dashboard
          </h2>
          <p className="text-muted fs-5">Welcome back, {session?.user?.name || 'Scholar'}! Here are your detailed analytics.</p>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        {/* Top KPI Cards */}
        <Row className="g-4 mb-5">
          <Col md={4}>
            <Card className="border-0 shadow-sm rounded-4 h-100">
              <Card.Body className="p-4 text-center">
                <div className="text-muted mb-2 fw-medium">Total Questions Attempted</div>
                <h1 className="display-4 fw-bold text-dark mb-0">{totalAttempts}</h1>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="border-0 shadow-sm rounded-4 h-100">
              <Card.Body className="p-4 text-center">
                <div className="text-muted mb-2 fw-medium">Overall Accuracy</div>
                <div className="d-flex align-items-center justify-content-center">
                  <h1 className="display-4 fw-bold text-primary-custom mb-0 me-2">{overallAccuracy}%</h1>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="border-0 shadow-sm rounded-4 h-100" style={{ background: 'linear-gradient(135deg, #f0e6ff 0%, #e6d8ff 100%)' }}>
              <Card.Body className="p-4 text-center d-flex flex-column justify-content-center align-items-center">
                <FaTrophy className="text-warning fs-1 mb-2" />
                <div className="text-primary-custom mb-1 fw-medium">Strongest Category</div>
                <h3 className="fw-bold text-dark mb-0">{strongestCategory.name}</h3>
                {strongestCategory.name !== 'None' && <small className="text-muted">{strongestCategory.accuracy}% Accuracy</small>}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="g-4">
          {/* Category Breakdown */}
          <Col lg={4}>
            <Card className="border-0 shadow-sm rounded-4 h-100">
              <Card.Header className="bg-white border-0 pt-4 pb-0 px-4">
                <h5 className="fw-bold text-dark">Category Breakdown</h5>
              </Card.Header>
              <Card.Body className="p-4">
                {categoryStats.map((stat, idx) => (
                  <div key={idx} className="mb-4 last-child-mb-0">
                    <div className="d-flex justify-content-between mb-1">
                      <span className="fw-medium text-dark">{stat.name}</span>
                      <span className="text-muted small">{stat.total} attempts</span>
                    </div>
                    <div className="d-flex align-items-center">
                      <ProgressBar 
                        now={stat.accuracy} 
                        variant={stat.accuracy >= 80 ? 'success' : stat.accuracy >= 50 ? 'warning' : 'danger'} 
                        className="flex-grow-1 me-3"
                        style={{ height: '8px' }}
                      />
                      <span className="fw-bold small" style={{ width: '35px' }}>{stat.accuracy}%</span>
                    </div>
                  </div>
                ))}
              </Card.Body>
            </Card>
          </Col>

          {/* Recent History Table */}
          <Col lg={8}>
            <Card className="border-0 shadow-sm rounded-4 h-100">
              <Card.Header className="bg-white border-0 pt-4 pb-0 px-4 d-flex justify-content-between align-items-center">
                <h5 className="fw-bold text-dark mb-0 d-flex align-items-center">
                  <FaHistory className="text-secondary me-2" /> Recent History
                </h5>
                <Link href="/practice" className="btn btn-sm btn-outline-primary rounded-pill px-3">
                  Practice More
                </Link>
              </Card.Header>
              <Card.Body className="p-4">
                {attempts.length === 0 ? (
                  <div className="text-center py-5 text-muted">
                    <p>You haven't attempted any questions yet.</p>
                    <Link href="/practice" className="btn btn-primary btn-custom-primary mt-2">Start Practicing</Link>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <Table hover className="align-middle border-light">
                      <thead className="bg-light">
                        <tr>
                          <th className="border-0 rounded-start">Date</th>
                          <th className="border-0">Category</th>
                          <th className="border-0">Question</th>
                          <th className="border-0 text-center rounded-end">Result</th>
                        </tr>
                      </thead>
                      <tbody>
                        {attempts.slice(0, 10).map((attempt) => (
                          <tr key={attempt._id}>
                            <td className="text-muted small">
                              {new Date(attempt.createdAt).toLocaleDateString('en-GB', {
                                day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                              })}
                            </td>
                            <td>
                              <div className="fw-medium text-dark">{attempt.category}</div>
                              <Badge bg="light" text="dark" className="border fw-normal">{attempt.difficulty}</Badge>
                            </td>
                            <td className="fw-bold fs-5 text-secondary">{attempt.questionSignature} = ?</td>
                            <td className="text-center">
                              {attempt.isCorrect ? (
                                <Badge bg="success" className="px-3 py-2 rounded-pill"><FaCheckCircle className="me-1" /> Correct</Badge>
                              ) : (
                                <Badge bg="danger" className="px-3 py-2 rounded-pill"><FaTimesCircle className="me-1" /> Incorrect</Badge>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                    {attempts.length > 10 && (
                      <div className="text-center mt-3 text-muted small">
                        Showing your 10 most recent attempts.
                      </div>
                    )}
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      
      <style dangerouslySetInnerHTML={{__html: `
        .last-child-mb-0:last-child {
          margin-bottom: 0 !important;
        }
      `}} />
    </div>
  );
}
