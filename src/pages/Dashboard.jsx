import React, { useState, useEffect } from 'react';
import { Song } from '@/entities/Song';
import { Collaboration } from '@/entities/Collaboration';
import { Button } from '@/components/ui/button';
import { Plus, FolderGit2, Users, BarChart2, Zap, Clock, TrendingUp, Music2, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';

const StatCard = ({ icon: Icon, title, value, color, trend, isLoading }) => (
    <motion.div
        whileHover={{ y: -4, scale: 1.02 }}
        className="bg-gradient-to-br from-neutral-900/90 to-neutral-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 relative overflow-hidden group"
    >
        <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
        <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${color} shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
                {trend && (
                    <div className="flex items-center gap-1 text-green-400 text-sm">
                        <TrendingUp className="w-4 h-4" />
                        <span>{trend}</span>
                    </div>
                )}
            </div>
            <p className="text-neutral-400 text-sm font-medium mb-1">{title}</p>
            {isLoading ? (
                <Skeleton className="h-8 w-24 mt-1" />
            ) : (
                <p className="text-3xl font-bold text-white">{value}</p>
            )}
        </div>
    </motion.div>
);

const ProjectItem = ({ song, isLoading }) => {
    if (isLoading) {
        return (
            <div className="flex items-center gap-4 p-4 bg-neutral-900/50 rounded-xl backdrop-blur-sm">
                <Skeleton className="w-14 h-14 rounded-lg" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                </div>
                <Skeleton className="h-4 w-16" />
            </div>
        );
    }

    const statusColors = {
        idea: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
        in_progress: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
        demo: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
        completed: 'bg-green-500/20 text-green-300 border-green-500/30',
        released: 'bg-pink-500/20 text-pink-300 border-pink-500/30'
    };

    return (
        <Link to={createPageUrl(`ProjectView?id=${song.id}`)} className="block group">
            <motion.div
                whileHover={{ x: 4 }}
                className="flex items-center gap-4 p-4 rounded-xl bg-neutral-900/30 hover:bg-neutral-800/50 border border-white/5 hover:border-purple-500/30 backdrop-blur-sm transition-all duration-200"
            >
                <div className="relative">
                    <img 
                        src={song.cover_art_url || `https://ui-avatars.com/api/?name=${song.title.charAt(0)}&background=random&color=fff&rounded=true`} 
                        alt={song.title} 
                        className="w-14 h-14 rounded-lg object-cover ring-2 ring-white/5 group-hover:ring-purple-500/50 transition-all" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-black/30 rounded-lg"></div>
                </div>
                <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white truncate group-hover:text-purple-300 transition-colors">{song.title}</p>
                    <p className="text-sm text-neutral-400 truncate">{song.artist || 'Untitled Artist'}</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className={`text-xs px-3 py-1 rounded-full border ${statusColors[song.status]} capitalize font-medium`}>
                        {song.status.replace('_', ' ')}
                    </span>
                    <p className="text-xs text-neutral-500 hidden sm:block">{formatDistanceToNow(new Date(song.updated_date), { addSuffix: true })}</p>
                    <ArrowUpRight className="w-4 h-4 text-neutral-600 group-hover:text-purple-400 transition-colors" />
                </div>
            </motion.div>
        </Link>
    );
};

export default function Dashboard() {
    const [songs, setSongs] = useState([]);
    const [stats, setStats] = useState({ projects: 0, collaborators: 0 });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [songData, collabData, allSongs] = await Promise.all([
                    Song.list('-updated_date', 5),
                    Collaboration.list(),
                    Song.list()
                ]);
                setSongs(songData || []);
                const uniqueCollabs = new Set((collabData || []).map(c => c.collaborator_email));
                
                setStats({
                    projects: (allSongs || []).length,
                    collaborators: uniqueCollabs.size
                });
            } catch (error) {
                console.error("Failed to load dashboard data:", error);
            }
            setIsLoading(false);
        };
        fetchData();
    }, []);

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
            >
                <div>
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent mb-2">
                        Welcome Back
                    </h1>
                    <p className="text-neutral-400 text-lg">Let's create something amazing today.</p>
                </div>
                <Link to={createPageUrl("Projects")}>
                    <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg shadow-purple-900/50 px-6 h-12 rounded-xl w-full md:w-auto">
                        <Plus className="w-5 h-5 mr-2" /> New Project
                    </Button>
                </Link>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    icon={FolderGit2} 
                    title="Total Projects" 
                    value={stats.projects} 
                    color="from-purple-600 to-purple-700" 
                    trend="+12%" 
                    isLoading={isLoading} 
                />
                <StatCard 
                    icon={Users} 
                    title="Collaborators" 
                    value={stats.collaborators} 
                    color="from-green-500 to-teal-600" 
                    trend="+8%" 
                    isLoading={isLoading} 
                />
                <StatCard 
                    icon={BarChart2} 
                    title="Total Plays" 
                    value="2.4K" 
                    color="from-orange-500 to-yellow-500" 
                    trend="+23%" 
                    isLoading={false} 
                />
                <StatCard 
                    icon={Zap} 
                    title="AI Credits" 
                    value="∞" 
                    color="from-pink-500 to-rose-600" 
                    isLoading={false} 
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-gradient-to-br from-neutral-900/90 to-neutral-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                            <Music2 className="w-6 h-6 text-purple-400" />
                            Recent Projects
                        </h2>
                        <Link to={createPageUrl("Projects")}>
                            <Button variant="ghost" className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10">
                                View All
                            </Button>
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {isLoading ? (
                            Array(5).fill(0).map((_, i) => <ProjectItem key={i} isLoading={true} />)
                        ) : songs.length > 0 ? (
                            songs.map(song => <ProjectItem key={song.id} song={song} />)
                        ) : (
                            <div className="text-center py-16">
                                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <Music2 className="w-8 h-8 text-white" />
                                </div>
                                <p className="text-neutral-400 mb-4">No projects yet. Start creating!</p>
                                <Link to={createPageUrl("Projects")}>
                                    <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                                        <Plus className="w-4 h-4 mr-2" /> Create Project
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-neutral-900/90 to-neutral-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-blue-400" />
                            Activity
                        </h2>
                        <div className="space-y-4">
                            <div className="text-neutral-500 text-center py-8 flex flex-col items-center">
                                <div className="w-12 h-12 bg-neutral-800/50 rounded-xl flex items-center justify-center mb-3">
                                    <Clock className="w-6 h-6 text-neutral-600" />
                                </div>
                                <p className="text-sm">Activity feed coming soon</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-purple-900/20 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-blue-600/10"></div>
                        <div className="relative z-10">
                            <Zap className="w-8 h-8 text-purple-400 mb-3" />
                            <h3 className="text-xl font-bold text-white mb-2">AI Power Tools</h3>
                            <p className="text-sm text-neutral-300 mb-4">
                                Auto-tag tracks, analyze moods, and generate metadata with AI
                            </p>
                            <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg">
                                Explore Features
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}