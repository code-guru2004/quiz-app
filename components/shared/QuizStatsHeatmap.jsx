'use client';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import ReactTooltip from 'react-tooltip';

export default function QuizStatsHeatmap({ username }) {
    const [heatmapData, setHeatmapData] = useState([]);
    const today = new Date();
    const startOfYear = new Date(today.getFullYear(), 0, 1);
    useEffect(() => {
        const fetchStats = async () => {
            const res = await axios.get(`/api/user/get-stats?username=${username}`);
            const data = await res.data.data;
            const calendarData = data.calendar;
            const heatmapData = Object.entries(calendarData).map(([date, count]) => ({
                date,
                count
            }));
            setHeatmapData(heatmapData);
        };

        fetchStats();
    }, [username]);



    return (
        <div>
            <h2 className="text-xl font-semibold mb-4 text-emerald-800">Quiz Activity</h2>
            <CalendarHeatmap
                startDate={startOfYear}
                endDate={today}
                values={heatmapData}
                showWeekdayLabels
                weekdayLabels={['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']}
                classForValue={(value) => {
                    if (!value || !value.count) return 'color-empty';
                    if (value.count >= 4) return 'color-github-4';
                    if (value.count >= 3) return 'color-github-3';
                    if (value.count >= 2) return 'color-github-2';
                    return 'color-github-1';
                }}
                tooltipDataAttrs={(value) => ({
                    'data-tip': `${value.date || 'No quizzes'} — ${value.count || 0} quizzes`,
                  })}
            />
<ReactTooltip />
        </div>
    );
}
