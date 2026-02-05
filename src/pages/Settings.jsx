import React, { useState, useEffect } from 'react';
import { User } from '@/entities/User';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Save, UserCircle, Bell, Shield } from 'lucide-react';

export default function Settings() {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        full_name: '',
        bio: '',
        location: '',
        website: ''
    });

    useEffect(() => {
        const fetchUser = async () => {
            setIsLoading(true);
            try {
                const userData = await User.me();
                setUser(userData);
                setFormData({
                    full_name: userData.full_name || '',
                    bio: userData.bio || '',
                    location: userData.location || '',
                    website: userData.website || ''
                });
            } catch (error) {
                console.error("Failed to load user:", error);
            }
            setIsLoading(false);
        };
        fetchUser();
    }, []);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await User.updateMyUserData(formData);
            toast.success("Settings saved successfully!");
        } catch (error) {
            console.error("Failed to save settings:", error);
            toast.error("Failed to save settings.");
        }
        setIsSaving(false);
    };

    if (isLoading) {
        return (
            <div className="space-y-6 max-w-2xl">
                <Skeleton className="h-10 w-48" />
                <Skeleton className="h-64 w-full" />
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-2xl">
            <div>
                <h1 className="text-3xl font-bold text-white">Settings</h1>
                <p className="text-neutral-400 mt-1">Manage your account and preferences.</p>
            </div>

            <div className="bg-neutral-900 border border-white/10 rounded-xl p-6 space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                    <UserCircle className="w-6 h-6 text-purple-400" />
                    <h2 className="text-xl font-semibold text-white">Profile Information</h2>
                </div>

                <div className="space-y-4">
                    <div>
                        <Label className="text-neutral-300">Full Name</Label>
                        <Input
                            value={formData.full_name}
                            onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                            className="bg-neutral-800 border-white/20 mt-2"
                        />
                    </div>

                    <div>
                        <Label className="text-neutral-300">Email</Label>
                        <Input
                            value={user?.email}
                            disabled
                            className="bg-neutral-800/50 border-white/10 mt-2 text-neutral-500"
                        />
                        <p className="text-xs text-neutral-500 mt-1">Email cannot be changed</p>
                    </div>

                    <div>
                        <Label className="text-neutral-300">Bio</Label>
                        <Textarea
                            value={formData.bio}
                            onChange={(e) => setFormData({...formData, bio: e.target.value})}
                            placeholder="Tell us about yourself and your music..."
                            className="bg-neutral-800 border-white/20 mt-2 h-24"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label className="text-neutral-300">Location</Label>
                            <Input
                                value={formData.location}
                                onChange={(e) => setFormData({...formData, location: e.target.value})}
                                placeholder="City, Country"
                                className="bg-neutral-800 border-white/20 mt-2"
                            />
                        </div>
                        <div>
                            <Label className="text-neutral-300">Website</Label>
                            <Input
                                value={formData.website}
                                onChange={(e) => setFormData({...formData, website: e.target.value})}
                                placeholder="https://..."
                                className="bg-neutral-800 border-white/20 mt-2"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-white/10">
                    <Button 
                        onClick={handleSave} 
                        disabled={isSaving}
                        className="bg-purple-600 hover:bg-purple-700"
                    >
                        <Save className="w-4 h-4 mr-2" />
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            </div>

            <div className="bg-neutral-900 border border-white/10 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                    <Bell className="w-6 h-6 text-blue-400" />
                    <h2 className="text-xl font-semibold text-white">Notifications</h2>
                </div>
                <p className="text-neutral-500 text-center py-8">Notification preferences coming soon.</p>
            </div>

            <div className="bg-neutral-900 border border-white/10 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                    <Shield className="w-6 h-6 text-green-400" />
                    <h2 className="text-xl font-semibold text-white">Privacy & Security</h2>
                </div>
                <p className="text-neutral-500 text-center py-8">Privacy settings coming soon.</p>
            </div>
        </div>
    );
}