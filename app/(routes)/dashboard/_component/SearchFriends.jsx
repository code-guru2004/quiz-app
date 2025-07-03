'use client';
import useGlobalContextProvider from '@/app/_context/ContextApi';
import axios from 'axios';
import { Mail, User, UserRoundPlus } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const SearchFriends = () => {
    const [search, setSearch] = useState('');
    const [results, setResults] = useState([]);
    const {username} = useGlobalContextProvider();
    useEffect(() => {
        const timeout = setTimeout(async() => {
            if (search.trim()) {
                try {
                    const resp = await axios.get(`/api/find-friend?term=${search}`);
                    const filteredUsers = resp.data.users.filter((user)=>user.username !==username)
                    setResults(filteredUsers);
                } catch (error) {
                    
                }
                // fetch(`/api/find-friend?term=${search}`)
                //     .then(res => res.json())
                //     .then(data =>{ 
                //         const filteredUsers = data.users.filter((user)=>user.username !==username)
                //         setResults(filteredUsers);
                //     }
                //     )
                //     .catch(err => console.error(err));
            } else {
                setResults([]);
            }
        }, 800); // debounce delay

        return () => clearTimeout(timeout);
    }, [search]);
    async function addfriend(friendUsername,email){
        try {
            const resp = await axios.post("/api/add-friend",{
                username,
                friend:{friendUsername,
                email
                }
            });
            if(resp.data.success){
                toast.success(resp.data.message)
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const message = error.response?.data?.message || "Something went wrong";
                toast.error(message);
            } else {
                toast.error("An unexpected error occurred");
            }
        }
    }

    return (
        <div className="p-4">
            <input
                type="text"
                placeholder="Search users by username"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border p-2 rounded w-full"
            />
            <ul className="mt-4">
                {results.map((user) => (
                    <li key={user._id} className="border-b py-2 flex justify-between items-center hover:bg-green-300 dark:hover:bg-gray-700 transition-all px-4">
                        <div>
                            <Link href={`/profile/${user.username}`} className='hover:underline underline-offset-3 mb-2 flex items-center'>
                            <User />{user.username} 
                            <br />
                            </Link>
                            {/* <p className='text-xs flex justify-center items-center gap-2'>
                            <Mail className='size-3'/>{user.email}
                            </p> */}
                        </div>
                        
                        <div>
                            <button onClick={()=>addfriend(user.username,user.email)}>
                                <UserRoundPlus />
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SearchFriends;
