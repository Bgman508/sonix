
import React, { useState, useEffect } from 'react';
import { Song } from '@/entities/Song';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, LayoutGrid, List } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { motion, AnimatePresence } from 'framer-motion';

const ProjectCard = ({ song }) => (
    <Link to={createPageUrl(`ProjectView?id=${song.id}`)} className="block group">
        <motion.div 
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileHover={{ y: -8 }}
            className="bg-gradient-to-br from-neutral-900/90 to-neutral-900/50 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden h-full flex flex-col transition-all duration-300 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-900/30 relative"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 to-blue-600/0 group-hover:from-purple-600/10 group-hover:to-blue-600/10 transition-all duration-300"></div>
            <div className="aspect-square w-full overflow-hidden relative">
                <img 
                    src={song.cover_art_url || `https://source.unsplash.com/random/400x400/?music,abstract&sig=${song.id}`} 
                    alt={song.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60"></div>
                <div className="absolute bottom-3 left-3 right-3">
                    <span className="text-xs px-2 py-1 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30 capitalize">
                        {song.status.replace('_', ' ')}
                    </span>
                </div>
            </div>
            <div className="p-5 flex-grow relative z-10">
                <p className="font-bold text-white truncate text-lg mb-1">{song.title}</p>
                <p className="text-sm text-neutral-400 truncate">{song.artist || 'Untitled Artist'}</p>
                {song.genre && (
                    <div className="mt-3">
                        <span className="text-xs px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 capitalize">
                            {song.genre}
                        </span>
                    </div>
                )}
            </div>
        </motion.div>
    </Link>
);

const NewProjectCard = () => {
    const [title, setTitle] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const navigate = (url) => window.location.href = url;

    const handleCreate = async () => {
        if (!title.trim()) return;
        setIsCreating(true);
        try {
            const newSong = await Song.create({ title });
            navigate(createPageUrl(`ProjectView?id=${newSong.id}`));
        } catch (error) {
            console.error("Failed to create project", error);
            setIsCreating(false);
        }
    };

    return (
        <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-purple-900/20 backdrop-blur-xl border-2 border-dashed border-purple-500/30 rounded-2xl h-full flex flex-col items-center justify-center p-8 text-center transition-all duration-300 hover:border-purple-500/60 hover:bg-purple-900/30 relative overflow-hidden group"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 to-blue-600/0 group-hover:from-purple-600/5 group-hover:to-blue-600/5 transition-all duration-300"></div>
            <div className="relative z-10">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center mb-6 shadow-lg shadow-purple-900/50">
                    <Plus className="w-10 h-10 text-white" />
                </div>
                <p className="font-bold text-white text-lg mb-2">Create New Project</p>
                <p className="text-sm text-neutral-400 mb-6">Start your next masterpiece</p>
                <div className="w-full max-w-xs space-y-3">
                     <Input 
                        placeholder="Enter song title..." 
                        className="bg-neutral-800/50 border-purple-500/30 text-white text-center backdrop-blur-sm focus:border-purple-500"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleCreate()}
                    />
                    <Button 
                        onClick={handleCreate} 
                        disabled={isCreating || !title.trim()} 
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg"
                    >
                        {isCreating ? 'Creating...' : 'Start Project'}
                    </Button>
                </div>
            </div>
        </motion.div>
    );
};

export default function Projects() {
    const [songs, setSongs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('grid');

    useEffect(() => {
        const fetchSongs = async () => {
            setIsLoading(true);
            try {
                const songData = await Song.list('-updated_date');
                setSongs(songData || []);
            } catch (error) {
                console.error("Failed to fetch songs:", error);
                setSongs([]);
            }
            setIsLoading(false);
        };
        fetchSongs();
    }, []);

    const filteredSongs = songs.filter(song =>
        song.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
            >
                <div>
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent mb-2">
                        My Projects
                    </h1>
                    <p className="text-neutral-400 text-lg">All your musical ideas and works-in-progress.</p>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                        <Input 
                            placeholder="Search projects..." 
                            className="bg-neutral-900/50 backdrop-blur-xl border-white/10 pl-11 h-12 w-full focus:border-purple-500/50"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                     <Button variant="outline" size="icon" onClick={() => setViewMode('grid')} className={`h-12 w-12 ${viewMode === 'grid' ? 'bg-purple-600/20 border-purple-500/50' : 'bg-neutral-900/50 border-white/10'}`}>
                        <LayoutGrid className="w-5 h-5" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => setViewMode('list')} className={`h-12 w-12 ${viewMode === 'list' ? 'bg-purple-600/20 border-purple-500/50' : 'bg-neutral-900/50 border-white/10'}`}>
                        <List className="w-5 h-5" />
                    </Button>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                <NewProjectCard />
                <AnimatePresence>
                {isLoading ? (
                    Array(4).fill(0).map((_, i) => (
                        <div key={i} className="bg-neutral-900/50 border border-white/10 rounded-2xl aspect-square backdrop-blur-xl">
                            <Skeleton className="w-full h-full rounded-2xl" />
                        </div>
                    ))
                ) : (
                    filteredSongs.map(song => (
                        <ProjectCard key={song.id} song={song} />
                    ))
                )}
                </AnimatePresence>
            </div>
        </div>
    );
}
