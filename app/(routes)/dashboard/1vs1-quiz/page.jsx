'use client';
import React, { useEffect, useState } from 'react';
import SearchFriends from '../_component/SearchFriends';
import { Sword, Swords } from 'lucide-react';
import useGlobalContextProvider from '@/app/_context/ContextApi';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';

function ChallengePage() {
  const [isLoading, setIsLoading] = useState(true);
  const { username } = useGlobalContextProvider();
  const [friendList, setFriendList] = useState([])
  useEffect(() => {
    const fetchUserData = async (username) => {
      try {
        const res = await fetch(`/api/get-user?username=${username}`);
        const data = await res.json();
        console.log(data.userData);
        setFriendList(data.userData.friendList);
      } catch (error) {
        console.error("Error fetching user data:", error.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (username) {
      setIsLoading(true); // Set loading before fetch
      fetchUserData(username);
    }
  }, [username]);


  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh] text-xl font-semibold">
        Loading Battleground...
      </div>
    );
  }
  const handleChallenge = async (opponentUsername) => {
    try {
      // const res = await fetch('/api/notify-opponent', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     opponentUsername,
      //     challengerUsername: username,
      //   }),
      // });
      const res = await fetch('/api/notify-opponent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: username,
          opponent: opponentUsername
        }),
      });
  
      const data = await res.json();
  
      if (data.success) {
        //alert(`Challenge sent to ${opponentUsername}!`);
        toast.success(`Challenge sent to ${opponentUsername}!`)
      } else {
        //alert(`Failed to notify: ${data.message}`);
      }
    } catch (err) {
      console.error('Challenge Error:', err);
      //alert('Failed to send challenge.');
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      <h1 className="flex items-center justify-center text-2xl font-extrabold">
        <Swords className="mr-2" /> 1 v/s 1 Challenge
      </h1>
      <div className="my-3">
        <SearchFriends />
      </div>
      <div>
        {
          friendList?.length === 0 ? (
            <div>
              <h1>No Friend yet</h1>
            </div>
          ) : (
            <div>
              {
                friendList.map((friend, idx) => (
                  <div key={idx} className='w-full flex items-center justify-between space-y-3 border-b-2 px-3 py-2'>
                    <p>{friend.username}</p>
                    <Dialog>
                      <DialogTrigger><Sword /></DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle className={"mb-3"}>Are you want to battle with {friend.username}</DialogTitle>

                          <svg

                            viewBox="0 0 220 160"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className='w-full'
                          >
                            {/* Background */}
                            <rect width="220" height="160" rx="20" fill="#1E293B" />

                            {/* Left player bubble */}
                            <circle cx="50" cy="50" r="30" fill="#3B82F6" />
                            <text
                              x="50"
                              y="57"
                              textAnchor="middle"
                              fontSize="26"
                              fill="white"
                              fontWeight="bold"
                            >
                              ?
                            </text>

                            {/* Left username */}
                            <text
                              x="50"
                              y="100"
                              textAnchor="middle"
                              fontSize="14"
                              fill="#E2E8F0"
                              fontWeight="500"
                            >
                              {"You"}
                            </text>

                            {/* Right player bubble */}
                            <circle cx="170" cy="50" r="30" fill="#EF4444" />
                            <text
                              x="170"
                              y="57"
                              textAnchor="middle"
                              fontSize="26"
                              fill="white"
                              fontWeight="bold"
                            >
                              ?
                            </text>

                            {/* Right username */}
                            <text
                              x="170"
                              y="100"
                              textAnchor="middle"
                              fontSize="14"
                              fill="#E2E8F0"
                              fontWeight="500"
                            >
                              {friend?.username}
                            </text>

                            {/* VS circle */}
                            <circle cx="110" cy="70" r="22" fill="#FBBF24" />
                            <text
                              x="110"
                              y="77"
                              textAnchor="middle"
                              fontSize="20"
                              fill="#1E293B"
                              fontWeight="bold"
                            >
                              VS
                            </text>

                            {/* Arena base */}
                            <rect x="30" y="120" width="160" height="12" rx="6" fill="#334155" />
                          </svg>

                        </DialogHeader>
                        <div className={"w-full flex items-center justify-center"}>
                          <button
                            className="bg-yellow-400 hover:bg-yellow-500 text-gray-600 p-6"
                            onClick={()=>handleChallenge(friend.username)}
                          >
                            Start⚔️
                          </button>

                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                ))
              }
            </div>
          )
        }
      </div>
      <div>

      </div>
    </div>
  );
}

export default ChallengePage;
