import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Home, Music, FolderGit2, Search, Settings, Bell, LogOut, Menu, X, Sparkles } from "lucide-react";
import { User } from "@/entities/User";
import { Button } from "@/components/ui/button";

const NavItem = ({ icon: Icon, text, to, currentPath, isMobile, onClick }) => (
    <Link 
        to={to} 
        onClick={onClick}
        className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${
            currentPath === to 
                ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-900/50" 
                : "text-neutral-400 hover:bg-white/5 hover:text-white"
        }`}
    >
        <Icon className="w-5 h-5 flex-shrink-0" />
        <span className={`font-medium ${isMobile ? 'block' : 'hidden'} lg:block`}>{text}</span>
    </Link>
);

export default function Layout({ children, currentPageName }) {
    const location = useLocation();
    const [user, setUser] = React.useState(null);
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

    React.useEffect(() => {
        User.me().then(setUser).catch(() => setUser(null));
    }, []);

    const navLinks = [
        { icon: Home, text: "Dashboard", to: createPageUrl("Dashboard") },
        { icon: Music, text: "My Projects", to: createPageUrl("Projects") },
        { icon: Search, text: "Discover", to: createPageUrl("Discover") },
        { icon: Settings, text: "Settings", to: createPageUrl("Settings") },
    ];
    
    const SidebarContent = ({ isMobile = false }) => (
        <div className="flex flex-col h-full bg-gradient-to-b from-neutral-900 via-neutral-900 to-neutral-950 border-r border-white/5 backdrop-blur-xl">
            <div className={`flex items-center gap-3 p-6 ${isMobile ? 'justify-between' : 'lg:justify-start justify-center'}`}>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-900/50 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                        <FolderGit2 className="w-5 h-5 text-white relative z-10" />
                    </div>
                    <div className={`${isMobile ? 'block' : 'hidden'} lg:block`}>
                        <h1 className="text-xl font-bold bg-gradient-to-r from-white to-neutral-300 bg-clip-text text-transparent">Sonix</h1>
                        <p className="text-xs text-neutral-500">Music Studio</p>
                    </div>
                </div>
                {isMobile && (
                    <button onClick={() => setMobileMenuOpen(false)} className="text-neutral-400 hover:text-white">
                        <X className="w-6 h-6" />
                    </button>
                )}
            </div>

            <nav className="flex-grow px-3 py-2 space-y-2">
                {navLinks.map(link => 
                    <NavItem key={link.text} {...link} currentPath={location.pathname} isMobile={isMobile} onClick={() => setMobileMenuOpen(false)} />
                )}
                
                <div className={`mt-6 mx-1 p-4 rounded-xl bg-gradient-to-br from-purple-900/30 via-blue-900/30 to-purple-900/30 border border-purple-500/20 backdrop-blur-sm ${isMobile ? 'block' : 'hidden'} lg:block`}>
                    <Sparkles className="w-5 h-5 text-purple-400 mb-2" />
                    <p className="text-sm font-semibold text-white mb-1">AI Assistant</p>
                    <p className="text-xs text-neutral-400 mb-3">Get help with your music</p>
                    <Button size="sm" className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg">
                        Try Now
                    </Button>
                </div>
            </nav>

            <div className="p-4 border-t border-white/5 backdrop-blur-xl">
                {user ? (
                    <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors">
                         <div className="relative">
                            <img 
                                src={user.avatar_url || `https://ui-avatars.com/api/?name=${user.full_name}&background=8b5cf6&color=fff`} 
                                alt={user.full_name} 
                                className="w-10 h-10 rounded-full ring-2 ring-purple-500/50" 
                            />
                            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-neutral-900"></div>
                        </div>
                         <div className={`${isMobile ? 'block' : 'hidden'} lg:block flex-1 min-w-0`}>
                            <p className="text-sm font-semibold text-white truncate">{user.full_name}</p>
                            <p className="text-xs text-neutral-400 truncate">{user.email}</p>
                        </div>
                        <button onClick={() => User.logout()} className="text-neutral-400 hover:text-white transition-colors">
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                ) : (
                     <div className="w-full h-10 bg-neutral-800/50 animate-pulse rounded-xl" />
                )}
            </div>
        </div>
    );

    return (
        <div className="bg-black text-white min-h-screen flex relative overflow-hidden">
            {/* Animated background gradients */}
            <div className="fixed inset-0 z-0 opacity-30">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
            </div>
            
            {/* Desktop Sidebar */}
            <aside className="hidden md:block w-20 lg:w-72 flex-shrink-0 transition-all duration-300 relative z-10">
                <SidebarContent />
            </aside>
            
            {/* Mobile Sidebar */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-50 md:hidden">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}></div>
                    <aside className="absolute top-0 left-0 h-full w-72 shadow-2xl">
                        <SidebarContent isMobile={true} />
                    </aside>
                </div>
            )}

            <main className="flex-1 flex flex-col overflow-hidden relative z-10">
                <header className="flex md:hidden items-center justify-between p-4 bg-neutral-900/80 backdrop-blur-xl border-b border-white/5">
                    <button onClick={() => setMobileMenuOpen(true)} className="text-neutral-300 hover:text-white">
                        <Menu className="w-6 h-6" />
                    </button>
                    <h1 className="text-lg font-bold">{currentPageName}</h1>
                    <Bell className="w-5 h-5 text-neutral-400" />
                </header>
                <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950">
                    {children}
                </div>
            </main>
        </div>
    );
}