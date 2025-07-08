'use client';
import useGlobalContextProvider from '@/app/_context/ContextApi';
import axios from 'axios';
import { User, UserRoundPlus } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';

const SearchFriends = ({ friendList }) => {
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
      <div className="relative" id="input">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="@john_doe"
          className="block w-full text-sm h-[50px] px-4 
      text-slate-900 dark:text-white 
      bg-white dark:bg-gray-800 
      rounded-[8px] border border-slate-200 dark:border-gray-600 
      appearance-none 
      focus:border-transparent focus:outline-2 focus:outline-primary focus:ring-0 
      hover:border-brand-500-secondary- 
      peer 
      invalid:border-error-500 invalid:focus:border-error-500 
      overflow-ellipsis overflow-hidden text-nowrap pr-[48px]"
          id="floating_outlined"
        />

        <label
          htmlFor="floating_outlined"
          className="peer-placeholder-shown:-z-10 peer-focus:z-10 
      absolute text-[14px] leading-[150%] 
      text-primary dark:text-white 
      peer-focus:text-primary peer-invalid:text-error-500 focus:invalid:text-error-500 
      duration-300 transform -translate-y-[1.2rem] scale-75 top-2 z-10 
      origin-[0] 
      bg-white dark:bg-gray-800 
      data-[disabled]:bg-gray-50-background- 
      px-2 
      peer-focus:px-2 
      peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 
      peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-[1.2rem] 
      rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
        >
          Search...
        </label>

        <div className="absolute top-3 right-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            height={24}
            width={24}
            className="text-slate-400 dark:text-white"
          >
            <path d="M10.979 16.8991C11.0591 17.4633 10.6657 17.9926 10.0959 17.9994C8.52021 18.0183 6.96549 17.5712 5.63246 16.7026C4.00976 15.6452 2.82575 14.035 2.30018 12.1709C1.77461 10.3068 1.94315 8.31525 2.77453 6.56596C3.60592 4.81667 5.04368 3.42838 6.82101 2.65875C8.59833 1.88911 10.5945 1.79039 12.4391 2.3809C14.2837 2.97141 15.8514 4.21105 16.8514 5.86977C17.8513 7.52849 18.2155 9.49365 17.8764 11.4005C17.5979 12.967 16.8603 14.4068 15.7684 15.543C15.3736 15.9539 14.7184 15.8787 14.3617 15.4343C14.0051 14.9899 14.0846 14.3455 14.4606 13.9173C15.1719 13.1073 15.6538 12.1134 15.8448 11.0393C16.0964 9.62426 15.8261 8.166 15.0841 6.93513C14.3421 5.70426 13.1788 4.78438 11.81 4.34618C10.4412 3.90799 8.95988 3.98125 7.641 4.55236C6.32213 5.12348 5.25522 6.15367 4.63828 7.45174C4.02135 8.74982 3.89628 10.2276 4.28629 11.6109C4.67629 12.9942 5.55489 14.1891 6.75903 14.9737C7.67308 15.5693 8.72759 15.8979 9.80504 15.9333C10.3746 15.952 10.8989 16.3349 10.979 16.8991Z" />
            <rect
              transform="rotate(-49.6812 12.2469 14.8859)"
              rx={1}
              height="10.1881"
              width={2}
              y="14.8859"
              x="12.2469"
            />
          </svg>
        </div>
      </div>


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
