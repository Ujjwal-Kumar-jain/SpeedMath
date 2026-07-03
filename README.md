# Coachify - Speed Math Practice App

A comprehensive Next.js web application designed to help CAT (Common Admission Test) aspirants and students improve their mental calculation speed and accuracy. 

The application offers an interactive numpad, varying difficulty levels, and different mathematical operations (Addition, Subtraction, Multiplication, Division). It also features a premium tier with Razorpay integration and user analytics stored in MongoDB.

## Features

- **Interactive Practice Area**: Generate dynamic math questions with a built-in virtual numpad and automatic answer submission.
- **Multiple Operations & Difficulties**: Choose between Addition, Subtraction, Multiplication (Premium), and Division (Premium) across Easy, Medium (Premium), and Hard (Premium) levels.
- **Authentication**: Secure user authentication using NextAuth (Credentials provider). Guest mode is also supported.
- **Premium Tier (Razorpay Integration)**: Seamless checkout flow allowing users to unlock premium features.
- **Analytics & Dashboard**: Track user performance (accuracy, time taken, score) which is persisted to a MongoDB database.
- **Focus Mode**: A distraction-free mode for focused practice.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Styling**: Vanilla CSS + [React Bootstrap](https://react-bootstrap.github.io/)
- **Database**: [MongoDB](https://www.mongodb.com/) (Mongoose)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **Payment Gateway**: [Razorpay](https://razorpay.com/)

## Getting Started

### Prerequisites
Make sure you have Node.js (v18 or higher) and npm installed.

### Environment Variables
Create a `.env.local` file in the root of the project and add the following variables:

```env
# MongoDB Connection String
MONGODB_URI=your_mongodb_connection_string

# NextAuth Configuration
NEXTAUTH_SECRET=your_super_secret_string
NEXTAUTH_URL=http://localhost:3000

# Razorpay Keys
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
```

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```
3. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application running.

## Deployment

This project is fully optimized and ready to be deployed on **Vercel**.

1. Import your GitHub repository to Vercel.
2. Add the environment variables listed above in the Vercel project settings.
3. Deploy!

## License

This project is open-source and available under the [MIT License](LICENSE).
