import { useState } from 'react';
import { WeeklyPlanner } from './components/WeeklyPlanner';

export default function App() {
  return (
    <div className="min-h-screen bg-[#EEC6CA] p-4 md:p-8">
      <WeeklyPlanner />
    </div>
  );
}