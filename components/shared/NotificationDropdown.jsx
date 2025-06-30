'use client';

import React, { useState, useRef, useEffect } from 'react';
import { BellIcon, EyeOff, Trash2 } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';
import clsx from 'clsx';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { IoCloseCircleOutline, IoCloseOutline } from 'react-icons/io5';
import axios from 'axios';

export default function NotificationDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const dropdownRef = useRef(null);
    const [username, setUsername] = useState(null)
    useEffect(() => {
        const fetchUserData = async (username) => {
            try {
                const res = await fetch(`/api/get-user?username=${username}`);
                const data = await res.json();
                const userInfo = data?.userData;
                if (userInfo?.notifications) {
                    const unreadNotis = userInfo?.notifications?.filter((n) => !n.read) || [];
                    setNotifications(unreadNotis);
                }
            } catch (error) {
                console.error('Failed to fetch user data:', error);
            }
        };

        const init = () => {
            const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
            if (token) {
                try {
                    const decoded = jwtDecode(token);
                    if (decoded?.username) {
                        fetchUserData(decoded.username);
                        setUsername(decoded?.username);
                    }
                } catch (err) {
                    console.error('Invalid token');
                }
            }
        };

        init();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const markNotificationAsRead = async (notificationId) => {
        try {
            const resp = await axios.post("/api/mark-notification-read", {
                id: notificationId,
                username,
            });
    
            // Remove the read notification from state
            setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
        } catch (error) {
            console.error("Failed to mark notification as read:", error);
        }
    };
    


    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen((prev) => !prev)}
                className="relative p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                aria-label="Notifications"
            >
                <BellIcon className="w-5 h-5 text-gray-800 dark:text-white" />
                {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                        {notifications.length}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 pb-3 bg-white dark:bg-gray-800 shadow-xl rounded-lg z-50">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700 font-semibold text-gray-800 dark:text-white">
                        Notifications
                    </div>
                    <ul className="max-h-60 overflow-y-auto divide-y divide-gray-200 dark:divide-gray-700 px-2">
                        {notifications.length === 0 ? (
                            <li className="p-4 text-sm text-gray-500 dark:text-gray-400">
                                No new notifications.
                            </li>
                        ) : (
                            notifications.map((notification, idx) => (

                                <li
                                    key={notification.id || idx}
                                    className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                                >
                                    {
                                        notification?.link ? (
                                            <div className='flex gap-2 px-2 rounded-md'>
                                                <Link href={notification.link}>
                                                    < p className="text-sm text-gray-800 dark:text-white">
                                                        {notification.message}
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        {new Date(notification.createdAt).toLocaleString(undefined, {
                                                            dateStyle: 'medium',
                                                            timeStyle: 'short',
                                                        })}
                                                    </p>
                                                </Link>
                                                {!notification.read && (
                                                    <button
                                                        onClick={() => markNotificationAsRead(notification.id)}
                                                        className="size-2 text-red-300 p-2 cursor-pointer"
                                                    >
                                                        <EyeOff />
                                                    </button>
                                                )}
                                            </div>
                                        ) : (
                                            <div className='flex gap-2 px-2 rounded-md'>
                                                <div>
                                                    < p className="text-sm text-gray-800 dark:text-white">
                                                        {notification.message}
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        {new Date(notification.createdAt).toLocaleString(undefined, {
                                                            dateStyle: 'medium',
                                                            timeStyle: 'short',
                                                        })}
                                                    </p>
                                                </div>
                                                {!notification.read && (
                                                    <button
                                                        onClick={() => markNotificationAsRead(notification.id)}
                                                        className="size-3 text-red-300 p-2 cursor-pointer"
                                                    >
                                                        <EyeOff />
                                                    </button>
                                                )}
                                            </div>
                                        )
                                    }
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
}
