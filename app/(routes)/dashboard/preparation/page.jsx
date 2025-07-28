'use client';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { SearchIcon, BookOpenIcon, VideoIcon, FileTextIcon, GlobeIcon } from 'lucide-react';
import Link from 'next/link';

const iconMap = {
  article: <BookOpenIcon className="text-blue-500 dark:text-blue-400 w-5 h-5" />,
  video: <VideoIcon className="text-red-500 dark:text-red-400 w-5 h-5" />,
  doc: <FileTextIcon className="text-green-500 dark:text-green-400 w-5 h-5" />,
  other: <GlobeIcon className="text-gray-500 dark:text-gray-400 w-5 h-5" />,
};

const borderColorMap = {
  article: 'border-l-4 border-blue-500 dark:border-blue-400',
  video: 'border-l-4  dark:border-red-400',
  doc: 'border-l-4 border-green-500 dark:border-green-400',
  other: 'border-l-4 border-gray-500 dark:border-gray-400',
};

export default function PreparationUserPage() {
  const [preparations, setPreparations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchPreparations = async () => {
      try {
        const res = await axios.get('/api/preparation/get');
        setPreparations(res.data?.data || []);
      } catch (err) {
        console.error('Error fetching preparation topics:', err);
      }
    };
    fetchPreparations();
  }, []);

  const filteredPreparations = preparations.filter((prep) =>
    prep.topic.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="min-h-screen px-6 py-10 bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Heading */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white ">📚 Preparation Resources</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Browse and prepare with curated links across various topics.
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-md mx-auto">
          <SearchIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400 dark:text-gray-500" />
          <Input
            type="text"
            placeholder="Search topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Topics */}
        <div className="space-y-6">
          {filteredPreparations.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400">No matching topics found.</p>
          ) : (
            filteredPreparations.map((prep, index) => (
              <Accordion key={prep._id} type="single" collapsible className="bg-white dark:bg-gray-900 shadow-md rounded-xl border border-gray-200 dark:border-gray-700">
                <AccordionItem value={`item-${index}`}>
                  <AccordionTrigger className="text-lg font-medium text-left px-6 py-4 text-gray-800 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                    {prep.topic}
                  </AccordionTrigger>
                  <AccordionContent className="bg-gray-50 dark:bg-gray-800 px-6 py-5 rounded-b-xl">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {prep.links.map((link, idx) => (
                        <Link
                          key={idx}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex gap-3 items-start p-4 rounded-xl hover:shadow-lg border-l-4 border-gray-200 dark:border-gray-600 transition hover:scale-[1.01] bg-white dark:bg-gray-700 ${borderColorMap[link.type] || borderColorMap.other}`}
                        >
                          <div className="mt-1">{iconMap[link.type] || iconMap.other}</div>
                          <div>
                            <h3 className="text-base font-semibold text-gray-900 dark:text-white">{link.title}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {link.type} • {link.source || 'Unknown Source'}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
