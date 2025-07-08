'use client';
import useGlobalContextProvider from '@/app/_context/ContextApi';
import axios from 'axios';
import { User, UserRoundPlus } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';

const SearchFriends = ({friendList}) => {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const { username } = useGlobalContextProvider();
  const [showDropdown, setShowDropdown] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (search.trim()) {
        try {
          const resp = await axios.get(`/api/find-friend?term=${search}`);
          const filteredUsers = resp.data.users.filter(
            (user) => 
              user.username !== username &&
              !friendList.some((friend) => friend.username === user.username)
          );
          
          setResults(filteredUsers);
          setShowDropdown(true);
        } catch (error) {
          console.error('Search error:', error);
        }
      } else {
        setResults([]);
        setShowDropdown(false);
      }
    }, 500); // debounce delay

    return () => clearTimeout(timeout);
  }, [search]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  async function addfriend(friendUsername, email) {
    try {
      const resp = await axios.post('/api/add-friend', {
        username,
        friend: {
          friendUsername,
          email,
        },
      });
      if (resp.data.success) {
        toast.success(resp.data.message);
        setSearch('');
        setResults([]);
        setShowDropdown(false);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || 'Something went wrong';
        toast.error(message);
      } else {
        toast.error('An unexpected error occurred');
      }
    }
  }

  return (
    <div className="relative w-full max-w-md p-4" ref={containerRef}>
      <input
        type="text"
        placeholder="Search users by username"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 rounded w-full"
      />

      {/* Dropdown */}
      {showDropdown && results.length > 0 && (
        <ul className="absolute top-full mt-2 w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50 max-h-64 overflow-y-auto">
          {results.map((user) => (
            <li
              key={user._id}
              className="border-b border-gray-100 dark:border-gray-800 py-2 px-4 flex justify-between items-center hover:bg-green-100 dark:hover:bg-gray-800 transition-all"
            >
              <div>
                <Link
                  href={`/profile/${user.username}`}
                  className="hover:underline flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  {user.username}
                </Link>
              </div>
              <button
                onClick={() => addfriend(user.username, user.email)}
                className="text-green-500 hover:text-green-600"
                title="Add Friend"
              >
                <UserRoundPlus />
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* No results */}
      {showDropdown && results.length === 0 && (
        <div className="absolute top-full mt-2 w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50 px-4 py-2 text-sm text-gray-500">
          No users found
        </div>
      )}
    </div>
  );
};

export default SearchFriends;
