"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Logo from "./Logo";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import Button from "./form/Button";
import { UserIcon, ArrowUpOnSquareStackIcon, HeartIcon, CloudArrowUpIcon, CogIcon, CursorArrowRippleIcon, DocumentTextIcon, XMarkIcon, SpeakerWaveIcon } from "@heroicons/react/24/solid";
import Loading from "../(main)/loading";
import getInitials from "../hooks/getInitials";
import CustomImg from "./CustomImg";
import { useT } from "../hooks/useT";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { RiSearch2Line } from "react-icons/ri";
import { ImUpload2 } from "react-icons/im";
import { useDropdown } from "../hooks/useDropdown";
import { IoNavigate } from "react-icons/io5";
import NavLink from "./NavLink";
import Label from "./form/Label";
import Toggle from "./form/Toggle";
import { TbMenu2 } from "react-icons/tb";
import { useTheme } from "../context/preferences-context";
import { liveSearch, LiveSearchData } from "../services/liveSearch";
import { Head3, Para } from "./Ui";
import { getR2Url } from "../lib/r2/r2Url";
import TagScroller from "./TagScroller";


const userLinks = [
    { id: 'your-profile', name: 'Your Profile', href: '/user', icon: UserIcon },
    { id: 'your-uploads', name: 'Your Uploads', href: '/user/uploads', icon: ArrowUpOnSquareStackIcon },
    { id: 'your-likes', name: 'Your Likes', href: '/user/likes', icon: HeartIcon },
    { id: 'your-soundboards', name: 'Your Soundboards', href: '/user/soundboards', icon: CloudArrowUpIcon },
];

const navLinks = [
    { id: 'recent-sound', title: 'Recent Sound Button', href: '/recent-buttons' },
    { id: 'most-downloaded', title: 'Most Downloaded Button', href: '/popular' },
    { id: 'most-viewed', title: 'Most Viewed Button', href: '/most-viewed' },
    { id: 'most-liked', title: 'Most Liked Button', href: '/most-liked' },
    { id: 'top-soundboards', title: 'Top Soundboards', href: '/soundboard' }
]

const policyLinks = [
    { id: 'privacy-plicy', title: 'Privacy Policy', href: '/page/privacy-policy' },
    { id: 'terms-conditions', title: 'Terms & Conditions', href: '/page/terms-conditions' },
    { id: 'dmca-copyright', title: 'DMCA Copyright', href: '/page/dmca-copyright' },
    { id: 'cookies-policy', title: 'Cookies Policy', href: '/page/cookie-policy' },
    { id: 'community-guidelines', title: 'Community Guidelines', href: '/page/community-guidelines' },
    { id: 'Contact-us', title: 'Contact Us', href: '/contact' }

]

export default function Navbar() {
    const t = useT();

    const [theme, setTheme] = useTheme();
    const router = useRouter();

    const [searchInp, setSearchInp] = useState("");
    const [searchRes, setSearchRes] = useState<LiveSearchData | null>(null);
    const [loading, setLoading] = useState(false);
    const [isSearchFocus, setIsSearchFocus] = useState(false);
    
    // Mobile states
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

    useEffect(() => {
        const delay = setTimeout(async () => {
            if (searchInp.trim().length < 2) {
                setSearchRes(null);
                return;
            }

            try {
                setLoading(true);
                const res = await liveSearch(searchInp);
                setSearchRes(res.data);
            } catch (err) {
                console.error("Search failed", err);
            } finally {
                setLoading(false);
            }
        }, 350);

        return () => clearTimeout(delay);
    }, [searchInp]);

    // Close mobile menu on escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setMobileMenuOpen(false);
                setMobileSearchOpen(false);
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, []);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (mobileMenuOpen || mobileSearchOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [mobileMenuOpen, mobileSearchOpen]);

    const hasFiles = searchRes?.files?.length ? searchRes?.files?.length > 0 : false;
    const hasUsers = searchRes?.users?.length ? searchRes?.users?.length > 0 : false;
    const hasCategories = searchRes?.categories?.length ? searchRes?.categories?.length > 0 : false;

    const { data: session, status } = useSession();
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    const profileDropdown = useDropdown(
        "profile",
        openDropdown,
        setOpenDropdown
    );

    const menuDropdown = useDropdown(
        "menu",
        openDropdown,
        setOpenDropdown
    );

    const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (searchInp === '') {
            toast.error('Please enter search value');
            return;
        }

        router.push(`/search/${searchInp}`);
        setSearchInp('');
        setMobileSearchOpen(false);
    }

    const handleMobileSearchClose = () => {
        setMobileSearchOpen(false);
        setSearchInp('');
        setSearchRes(null);
    };

    if (status === 'loading') {
        return <Loading />;
    }

    return (
        <>
            <header className="sticky top-0 z-50 bg-white border-gray-300 dark:bg-transparent dark:bg-linear-to-b dark:from-zinc-950/90 dark:via-zinc-900/90 dark:to-zinc-700/20 border-b dark:border-zinc-800 ">
                <div className="py-3 px-5 sm:px-7 max-w-7xl m-auto relative z-10 after:absolute after:inset-0 after:blur-2xl after:backdrop-blur-2xl after:-z-10">
                    <div className="flex items-center justify-between ">
                        {/* Logo */}
                        <Link href='/' className="text-xl font-bold">
                            <Logo />
                        </Link>

                        {/* Desktop Search */}
                        <div className="hidden md:flex flex-1 max-w-md mx-6 relative">
                            <form onSubmit={(e) => handleSearchSubmit(e)} className="w-full flex ">
                                <div className="w-full rounded-l-xl bg-gray-50 dark:bg-zinc-950 bg-linear-to-t from-white via-gray-50 to-gray-100 dark:from-zinc-700/90 dark:via-zinc-800/80 dark:to-zinc-900 focus-within:outline-none ring-[0.1em] ring-inset ring-gray-300 dark:ring-zinc-600/80 focus-within:ring-blue-400 focus-within:ring-[0.12em] overflow-x-hidden relative  z-10 ">
                                    <div className="absolute w-full top-0 left-0 -z-10 h-1/2">
                                        <div className="w-full h-full relative rounded-xl  z-10 after:absolute after:inset-y-[0.33em] after:inset-x-[0.4em] after:-z-10 after:bg-linear-to-b after:from-gray-300/50 after:via-gray-100/10 after:to-gray-100/5 dark:after:from-zinc-600/60 dark:after:via-zinc-800/10 dark:after:to-zinc-800/5 after:rounded-[inherit] after:h-full"></div>
                                    </div>

                                    <input
                                        id='search-inp'
                                        type="text"
                                        value={searchInp}
                                        onChange={(e) => setSearchInp(e.target.value)}
                                        onFocus={() => setIsSearchFocus(true)}
                                        onBlur={() => {
                                            setTimeout(() => {
                                                setIsSearchFocus(false)
                                            }, 150)
                                        }}
                                        placeholder="Search sounds, soundboards or users..."
                                        className="w-full px-4 py-2 text-sm  placeholder:text-gray-500/85 dark:placeholder:text-zinc-400/90 text-gray-900 dark:text-white outline-none ring-0 bg-transparent"
                                    />
                                </div>
                                <button type='submit' className="px-3 py-2 bg-white bg-linear-to-l from-blue-600/85 via-blue-600/75  dark:from-blue-600 dark:via-blue-600/80 to-blue-400 hover:from-blue-500 hover:via-blue-500 hover:to-blue-400/80  text-white rounded-r-xl cursor-pointer relative z-10 overflow-hidden after:absolute after:w-1/2 after:left-auto after:inset-[0.2em] after:-z-10 after:rounded-[inherit] after:bg-linear-to-l after:from-blue-300/50 after:via-blue-100/10 after:to-blue-300/5">
                                    <div className="relative scale-110">
                                        <RiSearch2Line className="size-4.5" />
                                        <div className="absolute w-[27%] h-[27%] rounded-full bg-white top-[32%] left-[37%] z-10"></div>
                                    </div>
                                </button>
                            </form>

                            {/* Desktop live search results */}
                            {
                                isSearchFocus && searchInp.length >= 2 && (
                                    <div className="absolute top-full mt-1 w-full bg-white dark:bg-zinc-800 border border-gray-300/80 dark:border-zinc-700 rounded-xl shadow-lg dark:shadow-none shadow-gray-300/80 overflow-hidden z-50  ">
                                        <div className="max-h-70 overflow-y-auto px-3.5 py-2.5 space-y-3 scrollbar-mini">
                                            <NavLink onClick={() => setSearchInp('')} href={`/search/${encodeURI(searchInp)}`} icon={RiSearch2Line} className="flex justify-between gap-2">
                                                <span className="flex-1 line-clamp-1">{searchInp}</span>
                                                {
                                                    searchRes?.total_files && searchRes?.total_files > 5 ? (
                                                        <span className="text-gray-400 dark:text-zinc-400">{searchRes?.total_files} sounds</span>
                                                    ) : searchRes?.total_categories ? (
                                                        <span className="text-gray-400 dark:text-zinc-400">{searchRes?.total_categories} sounds</span>
                                                    ) : (
                                                        <span className="text-gray-400 dark:text-zinc-400">Search</span>
                                                    )
                                                }
                                            </NavLink>

                                            {loading && (
                                                <p className="text-sm text-gray-400">Searching...</p>
                                            )}

                                            {!loading && searchRes && !hasFiles && !hasUsers && !hasCategories && (
                                                <p className="text-sm text-gray-400">No results found</p>
                                            )}

                                            {
                                                hasFiles && (
                                                    <div>
                                                        <Head3>Sound Results</Head3>
                                                        <div>
                                                            {searchRes!.files.map(file => (
                                                                <NavLink
                                                                    key={file.s_id}
                                                                    icon={SpeakerWaveIcon}
                                                                    href={`/${file.slug}-${file.s_id}`}
                                                                    onClick={() => setSearchInp('')}
                                                                    className="flex justify-between gap-2"
                                                                >
                                                                    <span className="flex-1 line-clamp-1">{file.title}</span>
                                                                    <span className="text-gray-400 dark:text-zinc-400">
                                                                        {file.duration}s
                                                                    </span>
                                                                </NavLink>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )
                                            }

                                            {
                                                hasUsers && (
                                                    <div>
                                                        <Head3>User Results</Head3>
                                                        <div>
                                                            {searchRes!.users.map(user => (
                                                                <NavLink
                                                                    icon={UserIcon}
                                                                    key={user.uid}
                                                                    href={`/user/${user.uid}?name=${user.name}`}
                                                                    onClick={() => setSearchInp('')}
                                                                    className="flex justify-between gap-2"
                                                                >
                                                                    <span className="flex-1 line-clamp-1">{user.name}</span>
                                                                    <span className="text-gray-400 dark:text-zinc-400">User</span>
                                                                </NavLink>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )
                                            }

                                            {
                                                hasCategories && (
                                                    <div>
                                                        <Head3>Soundboard Results</Head3>
                                                        <div className="grid grid-cols-3 gap-3 mt-2">
                                                            {
                                                                searchRes!.categories.map(cat => (
                                                                    <Link
                                                                        key={cat.sb_id}
                                                                        href={`/soundboard/${cat.slug}-${cat.sb_id}`}
                                                                        className="w-full space-y-1 group"
                                                                        onClick={() => setSearchInp('')}
                                                                    >
                                                                        <CustomImg
                                                                            src={getR2Url(`thumb/${cat.thumb}`) ?? ''}
                                                                            alt={cat.name}
                                                                            fill
                                                                            wrapperClassName="aspect-3/2 rounded-xl"
                                                                            className="group-hover:brightness-105"
                                                                        >
                                                                        </CustomImg>
                                                                        <Para className="text-sm truncate group-hover:text-blue-500 dark:group-hover:text-blue-400" paraHighlight>{cat.name}</Para>
                                                                    </Link>
                                                                ))
                                                            }
                                                        </div>
                                                    </div>
                                                )
                                            }
                                        </div>
                                    </div>
                                )
                            }
                        </div>

                        {/* Desktop Actions */}
                        <div className="md:flex items-stretch gap-4 hidden">
                            <Link href='/upload'>
                                <Button size="auto" className="p-2">
                                    <ImUpload2 className='size-4.5 scale-90' />
                                </Button>
                            </Link>

                            {
                                status === 'authenticated' ? (
                                    <>
                                        <button className="group" ref={profileDropdown.refs.setReference}
                                            onClick={profileDropdown.toggle}
                                            {...profileDropdown.getReferenceProps()}>
                                            {
                                                session?.user.image ? (
                                                    <CustomImg
                                                        src={session.user.image}
                                                        alt={session.user.name ?? 'user'}
                                                        width={28}
                                                        height={28}
                                                        wrapperClassName="size-7 rounded-full ring-1 ring-offset-2 dark:ring-offset-zinc-900 ring-gray-500/95"
                                                    ></CustomImg>
                                                ) : session?.user.name ? (
                                                    <div className="size-7 bg-linear-to-b from-blue-50 to-blue-300 ring-1 ring-offset-2 rounded-full ring-blue-300/75 group-hover:from-white group-hover:to-blue-200 flex items-center justify-center dark:ring-offset-zinc-900 group-hover:ring-blue-200 transition-colors duration-200">
                                                        <span className="text-blue-500">{getInitials(session.user.name)}</span>
                                                    </div>
                                                ) : (
                                                    <div className="size-7 bg-linear-to-b from-blue-50 to-blue-300 ring-1 ring-offset-2 rounded-full ring-blue-300/75 group-hover:from-white group-hover:to-blue-200 flex items-center justify-center dark:ring-offset-zinc-900 group-hover:ring-blue-200 transition-colors duration-200">
                                                        <UserIcon className="size-5 text-blue-500" />
                                                    </div>
                                                )
                                            }
                                        </button>

                                        {
                                            profileDropdown.open && (
                                                <div
                                                    ref={profileDropdown.refs.setFloating}
                                                    style={profileDropdown.floatingStyles}
                                                    {...profileDropdown.getFloatingProps()}
                                                    className={`w-screen max-w-61 origin-top-right rounded-2xl bg-white shadow-lg shadow-gray-200 outline-1 outline-gray-300/70  dark:divide-white/10 dark:bg-zinc-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10 overflow-hidden z-99`}
                                                >
                                                    <div className="py-2 px-3">
                                                        <div className="bg-white dark:bg-zinc-900 ring-[0.1em] ring-gray-200 dark:ring-0 dark:bg-linear-to-b dark:from-zinc-600/80 dark:to-zinc-800 rounded-xl relative z-10 dark:after:absolute dark:after:inset-0.5 dark:after:-z-10  dark:dark:after:bg-zinc-900 dark:after:rounded-[inherit] shadow-lg shadow-gray-300/70 dark:shadow-none px-4 py-3 flex gap-3 items-stretch">
                                                            <div>
                                                                {
                                                                    session?.user.image ? (
                                                                        <CustomImg
                                                                            src={session.user.image}
                                                                            alt={session.user.name ?? 'user'}
                                                                            width={28}
                                                                            height={28}
                                                                            wrapperClassName="size-7 rounded-full ring-1 ring-offset-2 dark:ring-offset-zinc-900 ring-gray-500/95"
                                                                        ></CustomImg>
                                                                    ) : session?.user.name ? (
                                                                        <div className="size-7 bg-linear-to-b from-blue-50 to-blue-300 ring-1 ring-offset-2 rounded-full ring-blue-300/75  flex items-center justify-center dark:ring-offset-zinc-900 transition-colors duration-200">
                                                                            <span className="text-blue-500">{getInitials(session.user.name)}</span>
                                                                        </div>
                                                                    ) : (
                                                                        <div className="size-7 bg-linear-to-b from-blue-50 to-blue-300 ring-1 ring-offset-2 rounded-full ring-blue-300/75  flex items-center justify-center dark:ring-offset-zinc-900 transition-colors duration-200">
                                                                            <UserIcon className="size-5 text-blue-500" />
                                                                        </div>
                                                                    )
                                                                }
                                                            </div>
                                                            <div className="flex-1 overflow-hidden">
                                                                <span className="truncate block text-sm font-bold">{session?.user.name ?? 'Anonymous'}
                                                                </span>
                                                                <span className="text-xs text-gray-500 dark:text-zinc-400 block -translate-y-px">Id: <span className="font-semibold">{session?.user.uid}</span></span>
                                                            </div>
                                                        </div>

                                                        <div className="mt-2 px-1 space-y-0.5">
                                                            {
                                                                userLinks.map((link) => (
                                                                    <NavLink key={link.id} href={link.href} icon={link.icon}>
                                                                        {link.name}
                                                                    </NavLink>
                                                                ))
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="mt-1 border-t outline-gray-300/70 dark:border-white/10 grid grid-cols-2 divide-x divide-white/10">
                                                        <Link href='/user/settings' className="px-3 py-2.5 flex justify-center items-center gap-2 dark:bg-zinc-900/75 hover:bg-zinc-900 text-sm font-semibold">
                                                            <CogIcon className="size-5 text-zinc-400/75" />
                                                            Settings
                                                        </Link>
                                                        <button onClick={() => signOut()} className="px-3 py-2.5 flex justify-center items-center gap-2 dark:bg-zinc-900/75 hover:bg-zinc-900 text-sm font-semibold">
                                                            <CursorArrowRippleIcon className="size-5 text-zinc-400/75 scale-90" />
                                                            {t('signout')}
                                                        </button>
                                                    </div>
                                                </div>
                                            )
                                        }
                                    </>
                                ) : (
                                    <Link href='/login' className="flex">
                                        <Button variant="outline" size="auto" className="px-2">
                                            <UserIcon className="size-5" />
                                        </Button>
                                    </Link>
                                )
                            }

                            <button className="text-gray-500 dark:text-zinc-400" ref={menuDropdown.refs.setReference}
                                onClick={menuDropdown.toggle}
                                {...menuDropdown.getReferenceProps()} >
                                {
                                    menuDropdown.open ? (
                                        <XMarkIcon className="size-6.5" />
                                    ) : (
                                        <TbMenu2 className="size-6.5" />
                                    )
                                }
                            </button>

                            {
                                menuDropdown.open && (
                                    <div
                                        ref={menuDropdown.refs.setFloating}
                                        style={menuDropdown.floatingStyles}
                                        {...menuDropdown.getFloatingProps()}
                                        className={`w-screen max-w-lg origin-top-right rounded-2xl bg-white shadow-lg shadow-gray-200 outline-1 outline-gray-300/70 dark:divide-white/10 dark:bg-zinc-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10 overflow-hidden px-5 py-4 z-99`}
                                    >
                                        <div className="grid grid-cols-[1.5fr_1fr] gap-5 divide-x divide-gray-200 dark:divide-white/10">
                                            {/* Nav Links Section */}
                                            <div className="pr-5 divide-y divide-gray-200 dark:divide-white/10 space-y-3">
                                                <div className="flex items-center gap-2 pb-3">
                                                    <IoNavigate className="size-5.5 text-gray-500 dark:text-zinc-300/80" />
                                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Nav & Theme</h3>
                                                </div>
                                                <nav className="space-y-1">
                                                    {
                                                        navLinks.map((link) => (
                                                            <NavLink key={link.id} href={link.href} onClick={menuDropdown.close}>
                                                                {link.title}
                                                            </NavLink>
                                                        ))
                                                    }
                                                    <div className="flex items-center justify-between px-4 py-2">
                                                        <Label htmlFor="setting-theme-nav">Dark Mode</Label>
                                                        <Toggle id='setting-theme-nav' checked={theme === 'dark' ? true : false} onChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')} />
                                                    </div>
                                                </nav>
                                            </div>

                                            {/* Policies Section */}
                                            <div className="divide-y divide-gray-200 dark:divide-white/10 space-y-3">
                                                <div className="flex items-center gap-2 pb-3">
                                                    <DocumentTextIcon className="size-5.5 text-gray-500 dark:text-zinc-300/80" />
                                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Policies</h3>
                                                </div>
                                                <nav className="space-y-1">
                                                    {
                                                        policyLinks.map((link) => (
                                                            <NavLink key={link.id} href={link.href} onClick={menuDropdown.close}>
                                                                {link.title}
                                                            </NavLink>
                                                        ))
                                                    }
                                                </nav>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                        </div>

                        {/* Mobile Actions */}
                        <div className="flex md:hidden items-center gap-3">
                            <button 
                                onClick={() => setMobileSearchOpen(true)}
                                className="text-gray-700 dark:text-zinc-300"
                            >
                                <RiSearch2Line className="size-5.5" />
                            </button>
                            
                            <button 
                                onClick={() => setMobileMenuOpen(true)}
                                className="text-gray-700 dark:text-zinc-300"
                            >
                                <TbMenu2 className="size-6" />
                            </button>
                        </div>
                    </div>
                    <div className="py-2 mt-3">
                        <TagScroller />
                    </div>
                </div>
            </header>

            {/* Mobile Search Modal */}
            {mobileSearchOpen && (
                <div className="fixed inset-0 z-[100] md:hidden">
                    {/* Backdrop */}
                    <div 
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={handleMobileSearchClose}
                    />
                    
                    {/* Modal Content */}
                    <div className="relative h-full bg-white dark:bg-zinc-900 animate-in slide-in-from-top duration-300">
                        <div className="px-4 py-3 border-b border-gray-200 dark:border-zinc-800">
                            <div className="flex items-center gap-3">
                                <button 
                                    onClick={handleMobileSearchClose}
                                    className="text-gray-600 dark:text-zinc-400"
                                >
                                    <XMarkIcon className="size-6" />
                                </button>
                                
                                <form onSubmit={handleSearchSubmit} className="flex-1 flex gap-2">
                                    <input
                                        type="text"
                                        value={searchInp}
                                        onChange={(e) => setSearchInp(e.target.value)}
                                        placeholder="Search sounds, soundboards or users..."
                                        autoFocus
                                        className="flex-1 px-4 py-2 text-sm bg-gray-100 dark:bg-zinc-800 rounded-lg placeholder:text-gray-500 dark:placeholder:text-zinc-400 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-400"
                                    />
                                    <Button 
                                        type="submit"
                                        size="sm"
                                    >
                                        Search
                                    </Button>
                                </form>
                            </div>
                        </div>

                        {/* Mobile Search Results */}
                        <div className="overflow-y-auto h-[calc(100%-4rem)] px-4 py-3 space-y-4">
                            {searchInp.length >= 2 && (
                                <NavLink 
                                    onClick={handleMobileSearchClose} 
                                    href={`/search/${encodeURI(searchInp)}`} 
                                    icon={RiSearch2Line} 
                                    className="flex justify-between gap-2"
                                >
                                    <span className="flex-1 line-clamp-1">{searchInp}</span>
                                    {
                                        searchRes?.total_files && searchRes?.total_files > 5 ? (
                                            <span className="text-gray-400 dark:text-zinc-400">{searchRes?.total_files} sounds</span>
                                        ) : searchRes?.total_categories ? (
                                            <span className="text-gray-400 dark:text-zinc-400">{searchRes?.total_categories} sounds</span>
                                        ) : (
                                            <span className="text-gray-400 dark:text-zinc-400">Search</span>
                                        )
                                    }
                                </NavLink>
                            )}

                            {loading && (
                                <p className="text-sm text-gray-400 px-4">Searching...</p>
                            )}

                            {!loading && searchRes && !hasFiles && !hasUsers && !hasCategories && searchInp.length >= 2 && (
                                <p className="text-sm text-gray-400 px-4">No results found</p>
                            )}

                            {hasFiles && (
                                <div>
                                    <Head3 className="mb-2">Sound Results</Head3>
                                    <div className="space-y-1">
                                        {searchRes!.files.map(file => (
                                            <NavLink
                                                key={file.s_id}
                                                icon={SpeakerWaveIcon}
                                                href={`/${file.slug}-${file.s_id}`}
                                                onClick={handleMobileSearchClose}
                                                className="flex justify-between gap-2"
                                            >
                                                <span className="flex-1 line-clamp-1">{file.title}</span>
                                                <span className="text-gray-400 dark:text-zinc-400">
                                                    {file.duration}s
                                                </span>
                                            </NavLink>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {hasUsers && (
                                <div>
                                    <Head3 className="mb-2">User Results</Head3>
                                    <div className="space-y-1">
                                        {searchRes!.users.map(user => (
                                            <NavLink
                                                icon={UserIcon}
                                                key={user.uid}
                                                href={`/user/${user.uid}?name=${user.name}`}
                                                onClick={handleMobileSearchClose}
                                                className="flex justify-between gap-2"
                                            >
                                                <span className="flex-1 line-clamp-1">{user.name}</span>
                                                <span className="text-gray-400 dark:text-zinc-400">User</span>
                                            </NavLink>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {hasCategories && (
                                <div>
                                    <Head3 className="mb-2">Soundboard Results</Head3>
                                    <div className="grid grid-cols-2 gap-3">
                                        {searchRes!.categories.map(cat => (
                                            <Link
                                                key={cat.sb_id}
                                                href={`/soundboard/${cat.slug}-${cat.sb_id}`}
                                                className="w-full space-y-1.5 group"
                                                onClick={handleMobileSearchClose}
                                            >
                                                <CustomImg
                                                    src={getR2Url(`thumb/${cat.thumb}`) ?? ''}
                                                    alt={cat.name}
                                                    fill
                                                    wrapperClassName="aspect-3/2 rounded-xl"
                                                    className="group-hover:brightness-105"
                                                />
                                                <Para className="text-sm truncate group-hover:text-blue-500 dark:group-hover:text-blue-400" paraHighlight>
                                                    {cat.name}
                                                </Para>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Mobile Menu Modal */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-100 md:hidden">
                    {/* Backdrop */}
                    <div 
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={() => setMobileMenuOpen(false)}
                    />
                    
                    {/* Menu Content */}
                    <div className="absolute right-0 top-0 h-full w-[85%] max-w-sm bg-white dark:bg-zinc-900 shadow-xl animate-in slide-in-from-right duration-300">
                        <div className="h-full flex flex-col">
                            {/* Header */}
                            <div className="px-5 py-4 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between">
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Menu</h2>
                                <button 
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="text-gray-600 dark:text-zinc-400"
                                >
                                    <XMarkIcon className="size-6" />
                                </button>
                            </div>

                            {/* Scrollable Content */}
                            <div className="flex-1 overflow-y-auto">
                                {/* User Profile Section */}
                                {status === 'authenticated' && session?.user && (
                                    <div className="px-5 py-4 border-b border-gray-200 dark:border-zinc-800">
                                        <div className="bg-gray-50 dark:bg-zinc-800 rounded-xl p-4 flex gap-3 items-center">
                                            <div>
                                                {session?.user.image ? (
                                                    <CustomImg
                                                        src={session.user.image}
                                                        alt={session.user.name ?? 'user'}
                                                        width={40}
                                                        height={40}
                                                        wrapperClassName="size-10 rounded-full ring-2 ring-offset-2 dark:ring-offset-zinc-900 ring-gray-300"
                                                    />
                                                ) : session?.user.name ? (
                                                    <div className="size-10 bg-linear-to-b from-blue-50 to-blue-300 ring-2 ring-offset-2 rounded-full ring-blue-300/75 flex items-center justify-center dark:ring-offset-zinc-900">
                                                        <span className="text-blue-500 font-semibold">{getInitials(session.user.name)}</span>
                                                    </div>
                                                ) : (
                                                    <div className="size-10 bg-linear-to-b from-blue-50 to-blue-300 ring-2 ring-offset-2 rounded-full ring-blue-300/75 flex items-center justify-center dark:ring-offset-zinc-900">
                                                        <UserIcon className="size-6 text-blue-500" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 overflow-hidden">
                                                <span className="truncate block text-sm font-bold text-gray-900 dark:text-white">
                                                    {session?.user.name ?? 'Anonymous'}
                                                </span>
                                                <span className="text-xs text-gray-500 dark:text-zinc-400">
                                                    Id: <span className="font-semibold">{session?.user.uid}</span>
                                                </span>
                                            </div>
                                        </div>

                                        {/* User Links */}
                                        <div className="mt-3 space-y-1">
                                            {userLinks.map((link) => (
                                                <NavLink 
                                                    key={link.id} 
                                                    href={link.href} 
                                                    icon={link.icon}
                                                    onClick={() => setMobileMenuOpen(false)}
                                                >
                                                    {link.name}
                                                </NavLink>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Upload Button */}
                                <div className="px-5 py-4 border-b border-gray-200 dark:border-zinc-800">
                                    <Link href='/upload' onClick={() => setMobileMenuOpen(false)}>
                                        <Button size="auto" className="w-full justify-center gap-2 py-2">
                                            <ImUpload2 className='size-4.5' />
                                            Upload Sound
                                        </Button>
                                    </Link>
                                </div>

                                {/* Navigation Links */}
                                <div className="px-5 py-4 border-b border-gray-200 dark:border-zinc-800">
                                    <h3 className="text-sm font-semibold text-gray-500 dark:text-zinc-400 mb-3 flex items-center gap-2">
                                        <IoNavigate className="size-4" />
                                        Navigation
                                    </h3>
                                    <nav className="space-y-1">
                                        {navLinks.map((link) => (
                                            <NavLink 
                                                key={link.id} 
                                                href={link.href} 
                                                onClick={() => setMobileMenuOpen(false)}
                                            >
                                                {link.title}
                                            </NavLink>
                                        ))}
                                    </nav>
                                </div>

                                {/* Theme Toggle */}
                                <div className="px-5 py-4 border-b border-gray-200 dark:border-zinc-800">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="mobile-theme-toggle" className="text-sm font-medium">
                                            Dark Mode
                                        </Label>
                                        <Toggle 
                                            id='mobile-theme-toggle' 
                                            checked={theme === 'dark'} 
                                            onChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')} 
                                        />
                                    </div>
                                </div>

                                {/* Policy Links */}
                                <div className="px-5 py-4">
                                    <h3 className="text-sm font-semibold text-gray-500 dark:text-zinc-400 mb-3 flex items-center gap-2">
                                        <DocumentTextIcon className="size-4" />
                                        Policies
                                    </h3>
                                    <nav className="space-y-1">
                                        {policyLinks.map((link) => (
                                            <NavLink 
                                                key={link.id} 
                                                href={link.href} 
                                                onClick={() => setMobileMenuOpen(false)}
                                            >
                                                {link.title}
                                            </NavLink>
                                        ))}
                                    </nav>
                                </div>
                            </div>

                            {/* Footer Actions */}
                            <div className="border-t border-gray-200 dark:border-zinc-800">
                                {status === 'authenticated' ? (
                                    <div className="grid grid-cols-2 divide-x divide-gray-200 dark:divide-zinc-800">
                                        <Link 
                                            href='/user/settings' 
                                            className="px-4 py-3.5 flex justify-center items-center gap-2 hover:bg-gray-50 dark:hover:bg-zinc-800 text-sm font-semibold"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            <CogIcon className="size-5 text-gray-500 dark:text-zinc-400" />
                                            Settings
                                        </Link>
                                        <button 
                                            onClick={() => {
                                                signOut();
                                                setMobileMenuOpen(false);
                                            }} 
                                            className="px-4 py-3.5 flex justify-center items-center gap-2 hover:bg-gray-50 dark:hover:bg-zinc-800 text-sm font-semibold"
                                        >
                                            <CursorArrowRippleIcon className="size-5 text-gray-500 dark:text-zinc-400" />
                                            {t('signout')}
                                        </button>
                                    </div>
                                ) : (
                                    <Link 
                                        href='/login' 
                                        className="block px-5 py-3.5 text-center hover:bg-gray-50 dark:hover:bg-zinc-800"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        <Button variant="outline" size="auto" className="w-full justify-center gap-2 py-2">
                                            <UserIcon className="size-5" />
                                            Sign In
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
