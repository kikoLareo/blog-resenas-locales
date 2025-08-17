import { useState } from "react";
import { Header } from "./components/Header";
import { HeroSection } from "./components/HeroSection";
import { FeaturedSections } from "./components/FeaturedSections";
import { NewsletterCTA } from "./components/NewsletterCTA";
import { Footer } from "./components/Footer";
import { ReviewDetail } from "./components/ReviewDetail";

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'review'>('home');
  const [selectedReviewId, setSelectedReviewId] = useState<string>('');

  const handleReviewClick = (reviewId: string) => {
    setSelectedReviewId(reviewId);
    setCurrentView('review');
    window.scrollTo(0, 0);
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    window.scrollTo(0, 0);
  };

  if (currentView === 'review') {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <ReviewDetail reviewId={selectedReviewId} onBack={handleBackToHome} />
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <HeroSection onReviewClick={handleReviewClick} />
        <FeaturedSections onReviewClick={handleReviewClick} />
        <NewsletterCTA />
      </main>
      <Footer />
    </div>
  );
}