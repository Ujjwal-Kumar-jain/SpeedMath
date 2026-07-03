'use client';

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, InputGroup, Alert, Spinner } from 'react-bootstrap';
import { FaShieldAlt, FaCheckCircle, FaLock, FaBolt, FaTimesCircle, FaPlusCircle } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Script from 'next/script';

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session, status, update } = useSession();
  
  const [coupon, setCoupon] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const basePrice = 999;
  const discountAmount = couponApplied ? Math.round(basePrice * 0.25) : 0;
  const finalPrice = basePrice - discountAmount;

  // Protect route
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/?login=true'); // Or redirect to home
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-vh-100 d-flex justify-content-center align-items-center bg-light">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  // If already purchased, no need to be here
  if (session?.user && (session.user as any).hasPurchased && !success) {
    return (
      <div className="min-vh-100 d-flex flex-column justify-content-center align-items-center bg-light">
        <FaCheckCircle className="text-success mb-3" size={64} />
        <h3 className="fw-bold text-dark">You are already a Premium Member!</h3>
        <p className="text-muted">Enjoy your advanced features.</p>
        <Button variant="primary" className="btn-custom-primary mt-3 px-4 py-2" onClick={() => router.push('/practice')}>
          Go to Practice
        </Button>
      </div>
    );
  }

  const handleApplyCoupon = () => {
    if (coupon.trim().toUpperCase() === 'SANKALP25') {
      setCouponApplied(true);
      setCouponError('');
    } else {
      setCouponError('Invalid coupon code');
      setCouponApplied(false);
    }
  };

  const handlePayment = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: finalPrice })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Payment initiation failed');
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Enter the Key ID generated from the Dashboard
        amount: data.order.amount,
        currency: data.order.currency,
        name: "Coachify",
        description: "Premium Upgrade",
        order_id: data.order.id,
        handler: async function (response: any) {
          try {
            setLoading(true);
            const verifyRes = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              })
            });

            const verifyData = await verifyRes.json();

            if (!verifyRes.ok) {
              throw new Error(verifyData.message || 'Payment verification failed');
            }

            // Update session dynamically
            await update({ hasPurchased: true });
            
            setSuccess(true);
            
            // Redirect after a short success message
            setTimeout(() => {
              router.push('/dashboard');
            }, 2000);
          } catch (err: any) {
            setError(err.message || 'An error occurred during payment verification');
            setLoading(false);
          }
        },
        prefill: {
          name: session?.user?.name || "",
          email: session?.user?.email || "",
        },
        theme: {
          color: "#9b00ff"
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
          }
        }
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();

    } catch (err: any) {
      setError(err.message || 'An error occurred during checkout');
      setLoading(false);
    }
  };

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <div className="min-vh-100 bg-light py-5">
        <Container className="py-4">
        {success ? (
          <Row className="justify-content-center">
            <Col md={8} lg={6} className="text-center">
              <Card className="border-0 shadow-lg rounded-4 p-5">
                <div className="mb-4">
                  <div className="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width: '80px', height: '80px' }}>
                    <FaCheckCircle size={40} />
                  </div>
                </div>
                <h2 className="fw-bold text-dark mb-3">Payment Successful!</h2>
                <p className="text-muted fs-5 mb-4">
                  Welcome to Coachify Premium. Your account has been upgraded.
                </p>
                <div className="d-flex justify-content-center">
                  <Spinner animation="border" variant="primary" size="sm" className="me-2 mt-1" />
                  <span className="text-primary-custom fw-medium">Redirecting to your dashboard...</span>
                </div>
              </Card>
            </Col>
          </Row>
        ) : (
          <>
            <div className="text-center mb-5">
              <h1 className="fw-bold text-dark display-6 mb-2">Secure Checkout</h1>
              <p className="text-muted">Upgrade your account to unlock all premium features</p>
            </div>

            <Row className="g-4 justify-content-center">
              {/* Order Summary (Left side on desktop) */}
              <Col lg={5} className="order-2 order-lg-1">
                <Card className="border-0 shadow-sm rounded-4 h-100 overflow-hidden">
                  <div className="bg-light-blue p-4 border-bottom border-light">
                    <h5 className="fw-bold text-primary-custom mb-0 d-flex align-items-center">
                      <FaBolt className="me-2" /> CAT Sankalp Premium
                    </h5>
                  </div>
                  <Card.Body className="p-4 px-md-5">
                    <h6 className="fw-bold text-dark mb-4">What's included:</h6>
                    
                    <ul className="list-unstyled mb-4">
                      <li className="d-flex align-items-center mb-3">
                        <FaTimesCircle className="text-primary-custom me-3 fs-5 flex-shrink-0" />
                        <span className="fw-medium text-secondary">Advanced Operations (Multiplication & Division)</span>
                      </li>
                      <li className="d-flex align-items-center mb-3">
                        <FaBolt className="text-warning me-3 fs-5 flex-shrink-0" />
                        <span className="fw-medium text-secondary">Higher Difficulties (Medium & Hard)</span>
                      </li>
                      <li className="d-flex align-items-center mb-3">
                        <FaPlusCircle className="text-success me-3 fs-5 flex-shrink-0" />
                        <span className="fw-medium text-secondary">Save all attempts and view detailed analytics</span>
                      </li>
                    </ul>

                    <hr className="text-muted opacity-25 my-4" />

                    {/* Price Breakdown */}
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-secondary">Base Plan (Lifetime)</span>
                      <span className="fw-medium text-dark">₹{basePrice}</span>
                    </div>
                    
                    {couponApplied && (
                      <div className="d-flex justify-content-between mb-2 text-success">
                        <span>Discount (SANKALP25)</span>
                        <span>-₹{discountAmount}</span>
                      </div>
                    )}

                    <hr className="text-muted opacity-25 my-3" />
                    
                    <div className="d-flex justify-content-between align-items-end mt-3">
                      <span className="fw-bold text-dark fs-5">Total</span>
                      <span className="fw-bold text-primary-custom fs-3">₹{finalPrice}</span>
                    </div>
                  </Card.Body>
                </Card>
              </Col>

              {/* Payment Details (Right side on desktop) */}
              <Col lg={5} className="order-1 order-lg-2">
                <Card className="border-0 shadow-sm rounded-4 mb-4">
                  <Card.Body className="p-4 px-md-5">
                    <h5 className="fw-bold text-dark mb-4">Payment Details</h5>

                    {error && <Alert variant="danger" className="py-2 small rounded-3 border-0">{error}</Alert>}

                    {/* Email display */}
                    <Form.Group className="mb-4">
                      <Form.Label className="fw-medium small text-secondary">Account Email</Form.Label>
                      <Form.Control 
                        type="email" 
                        value={session?.user?.email || ''} 
                        readOnly 
                        className="bg-light border-0 py-2 text-muted"
                      />
                    </Form.Group>

                    {/* Coupon Section */}
                    <Form.Group className="mb-4">
                      <Form.Label className="fw-medium small text-secondary">Have a coupon code?</Form.Label>
                      <InputGroup className="shadow-sm rounded-3 overflow-hidden">
                        <Form.Control 
                          placeholder="Enter code (e.g., SANKALP25)" 
                          value={coupon}
                          onChange={(e) => setCoupon(e.target.value)}
                          disabled={couponApplied || loading}
                          className="border-0 bg-light py-2 shadow-none"
                        />
                        <Button 
                          variant={couponApplied ? "success" : "secondary"} 
                          className="border-0 px-4 fw-medium"
                          onClick={handleApplyCoupon}
                          disabled={!coupon || couponApplied || loading}
                        >
                          {couponApplied ? 'Applied' : 'Apply'}
                        </Button>
                      </InputGroup>
                      {couponError && <div className="text-danger small mt-1 fw-medium">{couponError}</div>}
                      {couponApplied && <div className="text-success small mt-1 fw-medium">25% discount applied successfully!</div>}
                    </Form.Group>

                    <Button 
                      variant="primary" 
                      className="w-100 py-3 fw-bold btn-custom-primary rounded-3 shadow d-flex justify-content-center align-items-center"
                      onClick={handlePayment}
                      disabled={loading}
                      style={{ fontSize: '1.1rem' }}
                    >
                      {loading ? (
                        <>
                          <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <FaLock className="me-2" /> Pay ₹{finalPrice}
                        </>
                      )}
                    </Button>

                    <div className="text-center mt-4">
                      <div className="d-flex align-items-center justify-content-center text-muted small">
                        <FaShieldAlt className="me-1 text-success" /> 
                        <span>Secure encrypted payment</span>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
                
                <div className="text-center">
                  <Link href="/" className="text-secondary text-decoration-none small hover-dark">
                    Cancel and return to home
                  </Link>
                </div>
              </Col>
            </Row>
          </>
        )}
      </Container>
      
      <style dangerouslySetInnerHTML={{__html: `
        .hover-dark:hover {
          color: #000 !important;
          transition: color 0.2s ease-in-out;
        }
      `}} />
      </div>
    </>
  );
}
