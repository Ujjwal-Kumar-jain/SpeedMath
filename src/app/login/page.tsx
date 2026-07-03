'use client';

import React, { useState, Suspense } from 'react';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function LoginContent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const handleSubmit = async (e: React.FormEvent) => {
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
      router.push(callbackUrl);
      router.refresh();
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center min-vh-100 py-5">
      <Card className="p-4 shadow-sm" style={{ width: '100%', maxWidth: '400px', borderRadius: '15px' }}>
        <Card.Body>
          <div className="text-center mb-4">
            <h2 className="fw-bold text-primary-custom mb-1">Welcome Back</h2>
            <p className="text-muted small">Login to your Coachify account</p>
          </div>
          
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Form onSubmit={handleSubmit}>
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
                placeholder="Password" 
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
              {loading ? 'Logging in...' : 'Login'}
            </Button>

            {callbackUrl !== '/' && (
              <Button 
                variant="outline-secondary" 
                className="w-100 py-2 fw-medium mb-3"
                onClick={() => {
                  const url = new URL(callbackUrl, window.location.origin);
                  url.searchParams.set('guest', 'true');
                  router.push(url.pathname + url.search);
                }}
              >
                Skip and play as guest
              </Button>
            )}
            
            <div className="text-center mt-3">
              <span className="text-muted small">Don&apos;t have an account? </span>
              <Link href={`/register?callbackUrl=${encodeURIComponent(callbackUrl)}`} className="text-primary-custom fw-semibold text-decoration-none small">
                Sign up
              </Link>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default function Login() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
