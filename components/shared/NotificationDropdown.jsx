'use client';

import React, { useState, useRef, useEffect } from 'react';
import { BellIcon, EyeOff, X } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';
import toast from 'react-hot-toast';
import Link from 'next/link';
import axios from 'axios';

export default function NotificationDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const dropdownRef = useRef(null);
    const [username, setUsername] = useState(null);

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
            setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
            toast.success('Notification marked as read');
        } catch (error) {
            console.error("Failed to mark notification as read:", error);
            toast.error('Failed to update notification');
        }
    };

    const clearAllNotifications = async () => {
        try {
            await axios.post("/api/mark-all-notifications-read", { username });
            setNotifications([]);
            toast.success('All notifications cleared');
        } catch (error) {
            console.error("Failed to clear notifications:", error);
            toast.error('Failed to clear notifications');
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen((prev) => !prev)}
                className="relative p-2 rounded-full transition-all hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label="Notifications"
            >
                <BellIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                {notifications.length > 0 && (
                    <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 bg-red-500 text-white text-xs rounded-full transform translate-x-1 -translate-y-1">
                        {notifications.length}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 shadow-xl rounded-lg z-50 overflow-hidden border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="font-semibold text-gray-800 dark:text-white">Notifications</h3>
                        <div className="flex items-center space-x-2">
                            {notifications.length > 0 && (
                                <button 
                                    onClick={clearAllNotifications}
                                    className="text-xs text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                                >
                                    Clear all
                                </button>
                            )}
                            <button 
                                onClick={() => setIsOpen(false)}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                    
                    <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center p-6 text-center">
                                <BellIcon className="w-8 h-8 text-gray-400 dark:text-gray-500 mb-2" />
                                <p className="text-sm text-gray-500 dark:text-gray-400">No new notifications</p>
                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">We'll notify you when something arrives</p>
                            </div>
                        ) : (
                            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                                {notifications.map((notification, idx) => (
                                    <li
                                        key={notification.id || idx}
                                        className="group hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                                    >
                                        <div className="flex items-start p-3">
                                            <div className={`flex-shrink-0 mt-1 w-2 h-2 rounded-full ${notification.read ? 'bg-transparent' : 'bg-blue-500'}`}></div>
                                            
                                            <div className="ml-3 flex-1 min-w-0">
                                                {notification?.link ? (
                                                    <Link href={notification.link} className="block">
                                                        <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                                                            {notification.message}
                                                        </p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                            {new Date(notification.createdAt).toLocaleString(undefined, {
                                                                dateStyle: 'medium',
                                                                timeStyle: 'short',
                                                            })}
                                                        </p>
                                                    </Link>
                                                ) : (
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                                                            {notification.message}
                                                        </p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                            {new Date(notification.createdAt).toLocaleString(undefined, {
                                                                dateStyle: 'medium',
                                                                timeStyle: 'short',
                                                            })}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                            
                                            <button
                                                onClick={() => markNotificationAsRead(notification.id)}
                                                className="opacity-0 group-hover:opacity-100 ml-2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-opacity"
                                                aria-label="Mark as read"
                                            >
                                                <EyeOff className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    
                    {notifications.length > 0 && (
                        <div className="p-3 border-t border-gray-200 dark:border-gray-700 text-center">
                            <Link href="/notifications" className="text-xs text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                                View all notifications
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}