'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ChallengeAcceptPage({ params }) {
  const { challengeId } = params;
  const [challenge, setChallenge] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchChallenge = async () => {
      const res = await fetch(`/api/challenge/${challengeId}`);
      const data = await res.json();
      setChallenge(data.challenge);
    };
    fetchChallenge();
  }, [challengeId]);

  const handleAccept = async () => {
    const res = await fetch(`/api/challenge/${challengeId}/accept`, { method: 'POST' });
    const data = await res.json();
    if (data.success) {
      // Redirect to quiz page
      router.push(`/challenge-quiz/${challengeId}`);

    }
  };

  if (!challenge) return <p>Loading...</p>;

  return (
    <div className="max-w-xl mx-auto py-10 text-center">
      <h1 className="text-2xl font-bold mb-4">You were challenged by {challenge.fromUser}</h1>
      <p className="mb-6">Ready to accept and play the quiz?</p>
      <button onClick={handleAccept} className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600">
        Accept Challenge ⚔️
      </button>
    </div>
  );
}
