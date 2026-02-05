
import React, { useState, useEffect } from 'react';
import { Song } from '@/entities/Song';
import { SongFile } from '@/entities/SongFile';
import { Collaboration } from '@/entities/Collaboration';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { UploadFile } from '@/integrations/Core';
import { toast } from "sonner";
import { ArrowLeft, Music, FileText, Upload, Save, Info, Users, Mic2 } from 'lucide-react';

const GENRES = ["pop", "rock", "hip-hop", "r&b", "electronic", "country", "folk", "jazz", "classical", "alternative", "indie", "reggae", "blues", "latin", "world", "experimental", "other"];
const KEYS = ["C", "C#", "Db", "D", "D#", "Eb", "E", "F", "F#", "Gb", "G", "G#", "Ab", "A", "A#", "Bb", "B"];
const STATUSES = ["idea", "in_progress", "demo", "completed", "released"];

// Main Component
export default function ProjectView() {
    const urlParams = new URLSearchParams(window.location.search);
    const songId = urlParams.get('id');
    const [song, setSong] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        if (songId) {
            const fetchSong = async () => {
                setIsLoading(true);
                try {
                    const songData = await Song.get(songId);
                    setSong(songData);
                } catch (error) {
                    console.error("Failed to fetch song:", error);
                    toast.error("Could not load project.");
                }
                setIsLoading(false);
            };
            fetchSong();
        }
    }, [songId]);

    const handleUpdate = async (updatedData) => {
        try {
            const updatedSong = await Song.update(songId, updatedData);
            setSong(updatedSong);
            toast.success("Project saved!");
        } catch (error) {
            console.error("Failed to update song:", error);
            toast.error("Failed to save project.");
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-10 w-48" />
                <Skeleton className="h-16 w-full" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Skeleton className="h-40 w-full" />
                    <Skeleton className="h-40 w-full" />
                    <Skeleton className="h-40 w-full col-span-2" />
                </div>
            </div>
        );
    }
    
    if (!song) {
        return <div className="text-center text-neutral-400">Project not found.</div>;
    }

    const TABS = {
        overview: <OverviewTab song={song} onUpdate={handleUpdate} />,
        lyrics: <LyricsTab song={song} onUpdate={handleUpdate} />,
        files: <FilesTab songId={songId} />,
        collaborators: <CollaboratorsTab songId={songId} />,
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <Link to={createPageUrl("Projects")} className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to Projects
            </Link>

            <header>
                <h1 className="text-4xl font-bold text-white">{song.title}</h1>
                <p className="text-neutral-400 text-lg mt-1">{song.artist || "Untitled Artist"}</p>
            </header>
            
            <div className="border-b border-white/10">
                <nav className="flex gap-6">
                    {Object.keys(TABS).map(tabKey => (
                         <button
                            key={tabKey}
                            onClick={() => setActiveTab(tabKey)}
                            className={`py-3 capitalize border-b-2 transition-colors ${
                                activeTab === tabKey
                                    ? 'border-purple-500 text-white'
                                    : 'border-transparent text-neutral-400 hover:text-white'
                            }`}
                        >
                            {tabKey}
                        </button>
                    ))}
                </nav>
            </div>
            
            <div>{TABS[activeTab]}</div>
        </div>
    );
}


// Sub-components for tabs
const OverviewTab = ({ song, onUpdate }) => {
    const [formData, setFormData] = useState(song);
    
    useEffect(() => setFormData(song), [song]);

    const handleChange = (field, value) => {
        setFormData(prev => ({...prev, [field]: value}));
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-neutral-900 border border-white/10 rounded-xl p-6 space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2"><Info className="w-5 h-5 text-purple-400" /> Basic Info</h3>
                    <div>
                        <label className="text-sm text-neutral-400">Title</label>
                        <Input value={formData.title} onChange={e => handleChange('title', e.target.value)} className="bg-neutral-800 border-white/20 mt-1" />
                    </div>
                     <div>
                        <label className="text-sm text-neutral-400">Artist</label>
                        <Input value={formData.artist} onChange={e => handleChange('artist', e.target.value)} className="bg-neutral-800 border-white/20 mt-1" />
                    </div>
                    <div>
                        <label className="text-sm text-neutral-400">Description</label>
                        <Textarea value={formData.description} onChange={e => handleChange('description', e.target.value)} className="bg-neutral-800 border-white/20 mt-1" />
                    </div>
                </div>
                <div className="bg-neutral-900 border border-white/10 rounded-xl p-6 space-y-4">
                     <h3 className="text-lg font-semibold flex items-center gap-2"><Music className="w-5 h-5 text-purple-400" /> Musical DNA</h3>
                    <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="text-sm text-neutral-400">Key</label>
                            <Select onValueChange={val => handleChange('key', val)} value={formData.key}>
                                <SelectTrigger className="bg-neutral-800 border-white/20 mt-1"><SelectValue placeholder="Select Key" /></SelectTrigger>
                                <SelectContent className="bg-neutral-800 border-white/20 text-white">{KEYS.map(k => <SelectItem key={k} value={k}>{k}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label className="text-sm text-neutral-400">BPM</label>
                            <Input type="number" value={formData.bpm} onChange={e => handleChange('bpm', Number(e.target.value))} className="bg-neutral-800 border-white/20 mt-1" />
                        </div>
                    </div>
                    <div>
                        <label className="text-sm text-neutral-400">Genre</label>
                        <Select onValueChange={val => handleChange('genre', val)} value={formData.genre}>
                            <SelectTrigger className="bg-neutral-800 border-white/20 mt-1"><SelectValue placeholder="Select Genre" /></SelectTrigger>
                            <SelectContent className="bg-neutral-800 border-white/20 text-white">{GENRES.map(g => <SelectItem key={g} value={g} className="capitalize">{g}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>
                     <div>
                        <label className="text-sm text-neutral-400">Status</label>
                        <Select onValueChange={val => handleChange('status', val)} value={formData.status}>
                            <SelectTrigger className="bg-neutral-800 border-white/20 mt-1"><SelectValue placeholder="Select Status" /></SelectTrigger>
                            <SelectContent className="bg-neutral-800 border-white/20 text-white">{STATUSES.map(s => <SelectItem key={s} value={s} className="capitalize">{s.replace('_', ' ')}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>
                </div>
            </div>
             <div className="flex justify-end">
                <Button onClick={() => onUpdate(formData)} className="bg-purple-600 hover:bg-purple-700"><Save className="w-4 h-4 mr-2" />Save Changes</Button>
            </div>
        </div>
    );
}

const LyricsTab = ({ song, onUpdate }) => {
    const [lyrics, setLyrics] = useState(song.lyrics || '');
    return (
        <div className="bg-neutral-900 border border-white/10 rounded-xl p-6 space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2"><Mic2 className="w-5 h-5 text-purple-400" /> Lyrics</h3>
            <Textarea 
                value={lyrics}
                onChange={e => setLyrics(e.target.value)}
                placeholder="Start writing your lyrics here..."
                className="bg-neutral-800 border-white/20 h-96 font-mono"
            />
            <div className="flex justify-end">
                <Button onClick={() => onUpdate({ lyrics })} className="bg-purple-600 hover:bg-purple-700"><Save className="w-4 h-4 mr-2" />Save Lyrics</Button>
            </div>
        </div>
    );
};

const FilesTab = ({ songId }) => {
    const [files, setFiles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const fileInputRef = React.useRef(null);

    const fetchFiles = React.useCallback(async () => {
        setIsLoading(true);
        try {
            const fileData = await SongFile.filter({ song_id: songId });
            setFiles(fileData);
        } catch (error) {
            console.error("Failed to fetch files:", error);
            toast.error("Could not load project files.");
        } finally {
            setIsLoading(false);
        }
    }, [songId]);

    useEffect(() => {
        fetchFiles();
    }, [fetchFiles]);

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        toast.info(`Uploading ${file.name}...`);
        try {
            const { file_url } = await UploadFile({ file });
            await SongFile.create({
                song_id: songId,
                file_name: file.name,
                file_url: file_url,
                file_type: 'audio', // simple default for now
                file_size: file.size,
            });
            toast.success(`${file.name} uploaded successfully!`);
            fetchFiles();
        } catch (error) {
            toast.error(`Failed to upload ${file.name}.`);
            console.error(error);
        }
    };
    
    return (
        <div className="bg-neutral-900 border border-white/10 rounded-xl">
             <div className="p-6 border-b border-white/10 flex justify-between items-center">
                <h3 className="text-lg font-semibold flex items-center gap-2"><FileText className="w-5 h-5 text-purple-400" /> Project Files</h3>
                <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
                <Button onClick={() => fileInputRef.current.click()}><Upload className="w-4 h-4 mr-2" /> Upload File</Button>
            </div>
            <div className="p-6">
                {isLoading ? <p>Loading files...</p> : (
                    files.length > 0 ? (
                        <ul className="space-y-3">
                            {files.map(file => (
                                <li key={file.id} className="flex items-center justify-between bg-neutral-800/50 p-3 rounded-lg">
                                    <a href={file.file_url} target="_blank" rel="noopener noreferrer" className="font-medium hover:text-purple-400">{file.file_name}</a>
                                    <p className="text-sm text-neutral-500">{(file.file_size / 1024 / 1024).toFixed(2)} MB</p>
                                </li>
                            ))}
                        </ul>
                    ) : <p className="text-neutral-500 text-center">No files uploaded yet.</p>
                )}
            </div>
        </div>
    );
};

const CollaboratorsTab = ({ songId }) => {
    const [collaborators, setCollaborators] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        const fetchCollabs = async () => {
            setIsLoading(true);
            const collabData = await Collaboration.filter({ song_id: songId });
            setCollaborators(collabData);
            setIsLoading(false);
        };
        fetchCollabs();
    }, [songId]);

    return (
        <div className="bg-neutral-900 border border-white/10 rounded-xl p-6 space-y-4">
             <h3 className="text-lg font-semibold flex items-center gap-2"><Users className="w-5 h-5 text-purple-400" /> Collaborators & Splits</h3>
             <p className="text-neutral-500 text-center py-8">Splits management coming soon.</p>
        </div>
    )
}
