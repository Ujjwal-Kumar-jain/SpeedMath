'use client';

import React, { useState, Suspense } from 'react';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

function RegisterContent() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      router.push('/login');
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center min-vh-100 py-5">
      <Card className="p-4 shadow-sm" style={{ width: '100%', maxWidth: '400px', borderRadius: '15px' }}>
        <Card.Body>
          <div className="text-center mb-4">
            <h2 className="fw-bold text-primary-custom mb-1">Create Account</h2>
            <p className="text-muted small">Join Coachify today</p>
          </div>
          
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicName">
              <Form.Label className="fw-medium small">Full Name</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Enter your name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="py-2"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label className="fw-medium small">Email address</Form.Label>
              <Form.Control 
                type="email" 
                placeholder="Enter email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="py-2"
              />
            </Form.Group>

            <Form.Group className="mb-4" controlId="formBasicPassword">
              <Form.Label className="fw-medium small">Password</Form.Label>
              <Form.Control 
                type="password" 
                placeholder="Create a password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="py-2"
              />
            </Form.Group>

            <Button 
              variant="primary" 
              type="submit" 
              className="w-100 py-2 fw-bold btn-custom-primary border-0 mb-3"
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Sign Up'}
            </Button>
            
            <div className="text-center mt-3">
              <span className="text-muted small">Already have an account? </span>
              <Link href="/login" className="text-primary-custom fw-semibold text-decoration-none small">
                Login
              </Link>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default function Register() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RegisterContent />
    </Suspense>
  );
}
