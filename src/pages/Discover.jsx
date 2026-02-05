import React, { useState, useEffect } from 'react';
import { Song } from '@/entities/Song';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Music, Users as UsersIcon, Play, TrendingUp, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { motion, AnimatePresence } from 'framer-motion';

const GENRES = ["all", "pop", "rock", "hip-hop", "r&b", "electronic", "country", "folk", "jazz", "classical", "alternative", "indie"];
const MOODS = ["all", "uplifting", "melancholic", "energetic", "calm", "dark", "romantic", "aggressive", "dreamy"];

const DiscoverCard = ({ song }) => (
    <Link to={createPageUrl(`ProjectView?id=${song.id}`)} className="block group">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-neutral-900 border border-white/10 rounded-xl overflow-hidden transition-all duration-300 hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-900/20"
        >
            <div className="aspect-square w-full overflow-hidden relative">
                <img 
                    src={song.cover_art_url || `https://source.unsplash.com/random/400x400/?music,${song.genre}&sig=${song.id}`}
                    alt={song.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center">
                        <Play className="w-6 h-6 text-black ml-1" />
                    </div>
                </div>
            </div>
            <div className="p-4">
                <p className="font-bold text-white truncate">{song.title}</p>
                <p className="text-sm text-neutral-400 truncate">{song.artist || 'Unknown Artist'}</p>
                <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-300 capitalize">
                        {song.genre}
                    </span>
                    {song.mood && (
                        <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-300 capitalize">
                            {song.mood}
                        </span>
                    )}
                </div>
            </div>
        </motion.div>
    </Link>
);

const TrendingCard = ({ song, index }) => (
    <Link to={createPageUrl(`ProjectView?id=${song.id}`)} className="flex items-center gap-4 p-3 rounded-lg hover:bg-neutral-800/50 transition-colors group">
        <span className="text-2xl font-bold text-neutral-600 w-8">{index + 1}</span>
        <img 
            src={song.cover_art_url || `https://source.unsplash.com/random/80x80/?music&sig=${song.id}`}
            alt={song.title}
            className="w-12 h-12 rounded-md object-cover"
        />
        <div className="flex-1 min-w-0">
            <p className="font-semibold text-white truncate group-hover:text-purple-400 transition-colors">{song.title}</p>
            <p className="text-sm text-neutral-400 truncate">{song.artist || 'Unknown Artist'}</p>
        </div>
        <TrendingUp className="w-4 h-4 text-green-400" />
    </Link>
);

export default function Discover() {
    const [songs, setSongs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGenre, setSelectedGenre] = useState('all');
    const [selectedMood, setSelectedMood] = useState('all');
    const [activeTab, setActiveTab] = useState('all');

    useEffect(() => {
        const fetchSongs = async () => {
            setIsLoading(true);
            try {
                // In a real app, we'd filter for public songs only
                // For now, we'll show all songs as if they're discoverable
                const allSongs = await Song.list('-created_date');
                setSongs(allSongs || []);
            } catch (error) {
                console.error("Failed to fetch songs:", error);
                setSongs([]);
            }
            setIsLoading(false);
        };
        fetchSongs();
    }, []);

    const filteredSongs = songs.filter(song => {
        const matchesSearch = song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (song.artist && song.artist.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesGenre = selectedGenre === 'all' || song.genre === selectedGenre;
        const matchesMood = selectedMood === 'all' || song.mood === selectedMood;
        
        return matchesSearch && matchesGenre && matchesMood;
    });

    const trendingSongs = [...songs].slice(0, 5);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                    <Sparkles className="w-8 h-8 text-purple-400" />
                    Discover
                </h1>
                <p className="text-neutral-400 mt-1">Explore incredible music from creators around the world.</p>
            </div>

            {/* Search and Filters */}
            <div className="bg-neutral-900 border border-white/10 rounded-xl p-6 space-y-4">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                    <Input
                        placeholder="Search songs, artists, genres..."
                        className="bg-neutral-800 border-white/20 pl-12 h-12 text-lg"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                
                <div className="flex flex-wrap gap-4">
                    <div className="flex-1 min-w-[200px]">
                        <label className="text-sm text-neutral-400 mb-2 block">Genre</label>
                        <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                            <SelectTrigger className="bg-neutral-800 border-white/20">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-neutral-800 border-white/20 text-white">
                                {GENRES.map(genre => (
                                    <SelectItem key={genre} value={genre} className="capitalize">
                                        {genre}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    
                    <div className="flex-1 min-w-[200px]">
                        <label className="text-sm text-neutral-400 mb-2 block">Mood</label>
                        <Select value={selectedMood} onValueChange={setSelectedMood}>
                            <SelectTrigger className="bg-neutral-800 border-white/20">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-neutral-800 border-white/20 text-white">
                                {MOODS.map(mood => (
                                    <SelectItem key={mood} value={mood} className="capitalize">
                                        {mood}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="bg-neutral-800">
                        <TabsTrigger value="all" className="data-[state=active]:bg-purple-600">All Tracks</TabsTrigger>
                        <TabsTrigger value="trending" className="data-[state=active]:bg-purple-600">Trending</TabsTrigger>
                        <TabsTrigger value="new" className="data-[state=active]:bg-purple-600">New Releases</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                        <AnimatePresence>
                            {isLoading ? (
                                Array(8).fill(0).map((_, i) => (
                                    <div key={i} className="bg-neutral-900 border border-white/10 rounded-xl aspect-square">
                                        <Skeleton className="w-full h-full" />
                                    </div>
                                ))
                            ) : (
                                filteredSongs.map(song => (
                                    <DiscoverCard key={song.id} song={song} />
                                ))
                            )}
                        </AnimatePresence>
                    </div>
                    
                    {!isLoading && filteredSongs.length === 0 && (
                        <div className="text-center py-16">
                            <Music className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
                            <p className="text-neutral-400 text-lg">No songs found matching your criteria.</p>
                            <Button 
                                onClick={() => {
                                    setSearchTerm('');
                                    setSelectedGenre('all');
                                    setSelectedMood('all');
                                }}
                                className="mt-4 bg-purple-600 hover:bg-purple-700"
                            >
                                Clear Filters
                            </Button>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <div className="bg-neutral-900 border border-white/10 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-green-400" />
                            Trending Now
                        </h3>
                        <div className="space-y-2">
                            {isLoading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <div key={i} className="flex items-center gap-4 p-3">
                                        <Skeleton className="w-8 h-8" />
                                        <Skeleton className="w-12 h-12 rounded-md" />
                                        <div className="flex-1 space-y-2">
                                            <Skeleton className="h-4 w-full" />
                                            <Skeleton className="h-3 w-2/3" />
                                        </div>
                                    </div>
                                ))
                            ) : (
                                trendingSongs.map((song, index) => (
                                    <TrendingCard key={song.id} song={song} index={index} />
                                ))
                            )}
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 border border-purple-500/30 rounded-xl p-6">
                        <UsersIcon className="w-8 h-8 text-purple-300 mb-3" />
                        <h3 className="text-lg font-semibold text-white mb-2">Find Collaborators</h3>
                        <p className="text-sm text-neutral-300 mb-4">
                            Connect with producers, songwriters, and artists to create amazing music together.
                        </p>
                        <Button className="w-full bg-white text-black hover:bg-neutral-200">
                            Coming Soon
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}