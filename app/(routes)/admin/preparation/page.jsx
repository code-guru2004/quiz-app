'use client';
import axios from 'axios';
import { useEffect, useState } from 'react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import Link from 'next/link';
import { Plus, ExternalLink, FileText, Video, BookOpen, Trash } from 'lucide-react';

export default function PreparationPage() {
    const [topic, setTopic] = useState('');
    const [links, setLinks] = useState([{ title: '', url: '', type: 'article', source: '' }]);
    const [preparations, setPreparations] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const resp = await axios.get('/api/preparation/get');
                setPreparations(resp?.data?.data || []);
            } catch (err) {
                console.error("Failed to fetch preparations:", err);
            }
        };
        fetchData();
    }, []);

    const handleLinkChange = (index, field, value) => {
        const updatedLinks = [...links];
        updatedLinks[index][field] = value;
        setLinks(updatedLinks);
    };

    const addLinkField = () => {
        setLinks([...links, { title: '', url: '', type: 'article', source: '' }]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch('/api/preparation/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ topic, links }),
        });

        if (res.ok) {
            setTopic('');
            setLinks([{ title: '', url: '', type: 'article', source: '' }]);
            const updated = await axios.get('/api/preparation/get');
            setPreparations(updated?.data.data);
        }
    };
    const handleDelete = async (id) => {
        try {
            const resp = await axios.post('/api/preparation/delete-topic', { id });
            if (resp.data.success) {
                setPreparations(resp.data.data);
            } else {
                console.error("Delete failed:", resp.data.message);
            }
        } catch (err) {
            console.error("Error deleting topic:", err);
        }
    };
    

    const getTypeIcon = (type) => {
        switch (type) {
            case 'video': return <Video size={16} className="text-red-500" />;
            case 'article': return <FileText size={16} className="text-blue-500" />;
            case 'doc': return <BookOpen size={16} className="text-green-600" />;
            default: return <ExternalLink size={16} />;
        }
    };

    return (
        <div className="p-6 space-y-12 max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold text-center text-blue-700">🧠 Practice Resource Manager</h1>

            {/* Form */}
            <form
                onSubmit={handleSubmit}
                className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-xl space-y-6 border"
            >
                <div>
                    <label htmlFor="topic" className="block font-semibold mb-1">Topic</label>
                    <input
                        type="text"
                        name="topic"
                        placeholder="e.g. React Hooks"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        required
                        className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {links.map((link, i) => (
                    <div key={i} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <input
                            type="text"
                            placeholder="Title"
                            value={link.title}
                            onChange={(e) => handleLinkChange(i, 'title', e.target.value)}
                            className="border p-2 rounded-md"
                            required
                        />
                        <input
                            type="url"
                            placeholder="URL"
                            value={link.url}
                            onChange={(e) => handleLinkChange(i, 'url', e.target.value)}
                            className="border p-2 rounded-md"
                            required
                        />
                        <select
                            value={link.type}
                            onChange={(e) => handleLinkChange(i, 'type', e.target.value)}
                            className="border p-2 rounded-md dark:bg-gray-700"
                        >
                            <option value="article">Article</option>
                            <option value="video">Video</option>
                            <option value="doc">Doc</option>
                            <option value="other">Other</option>
                        </select>
                        <input
                            type="text"
                            placeholder="Source (optional)"
                            value={link.source}
                            onChange={(e) => handleLinkChange(i, 'source', e.target.value)}
                            className="border p-2 rounded-md"
                        />
                    </div>
                ))}

                <div className="flex items-center justify-between pt-2">
                    <button
                        type="button"
                        onClick={addLinkField}
                        className="text-blue-600 flex items-center gap-1 hover:underline"
                    >
                        <Plus size={16} /> Add Link
                    </button>

                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        Submit
                    </button>
                </div>
            </form>

            {/* Display Topics */}
            <div className="space-y-6 flex flex-col items-center justify-center ">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">📚 All Topics</h2>
                <Accordion type="multiple" className="w-[80%]">
                    {preparations.map((prep, idx) => (
                        <AccordionItem key={idx} value={`item-${idx}`}>
                            <div className="flex justify-between items-center pr-4 w-full">
                                <AccordionTrigger className="text-lg font-medium">{prep.topic}</AccordionTrigger>
                                <button
                                    onClick={() => handleDelete(prep._id)}
                                    className="text-red-500 hover:text-red-700 transition"
                                    title="Delete topic"
                                >
                                    <Trash size={18} />
                                </button>
                            </div>

                            <AccordionContent className="space-y-2 px-4 py-2">
                                {prep.links.map((link, i) => (
                                    <div
                                        key={i}
                                        className="flex items-start justify-between gap-3 bg-gray-100 dark:bg-gray-800 p-3 rounded-md"
                                    >
                                        <div className="flex items-baseline justify-center gap-2">
                                            {getTypeIcon(link.type)}
                                            <div className="flex flex-col">
                                                <Link
                                                    href={link.url}
                                                    target="_blank"
                                                    className="text-blue-600 text-xl font-medium hover:underline"
                                                >
                                                    {link.title}
                                                </Link>
                                                <span className="text-xs text-gray-500">{link.source}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </AccordionContent>

                        </AccordionItem>
                    ))}

                </Accordion>
            </div>
        </div>
    );
}
