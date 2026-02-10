'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'
import { IconType } from 'react-icons';
import { GiFireDash } from "react-icons/gi";
import { HiRectangleGroup } from "react-icons/hi2";
import { GiSmallFire } from "react-icons/gi";

export type Tag = {
    label: string
    link: string
}

export type PrTag = {
    label: string,
    link: string,
    icon: IconType,
    btnVariant: 'indigoSky' | 'redAmber' | 'greenTeal' | 'purplePink' | 'violetFuchsia' | 'orangeYellow',
}

type TagContextType = {
    tags: Tag[]
    setTags: React.Dispatch<React.SetStateAction<Tag[]>>
    prTags: PrTag[]
    setPrTags: React.Dispatch<React.SetStateAction<PrTag[]>>
}


const TagContext = createContext<TagContextType | undefined>(undefined)


const defaultTags: Tag[] = [
    { label: 'Meme', link: '/search/meme' },
    { label: 'Anime', link: '/search/anime' },
    { label: 'Gaming', link: '/search/gaming' },
    { label: 'Earrape', link: '/search/earrape' },
    { label: 'Fart', link: '/search/fart' },
    { label: 'Fortnite', link: '/search/fortnite' },
    { label: 'Fnaf', link: '/search/fnaf' },
    { label: 'Scream', link: '/search/scream' },
    { label: 'Roblox', link: '/search/roblox' },
    { label: 'Minecraft', link: '/search/minecraft' },
    { label: 'Among us', link: '/search/among us' },
    { label: 'Valorant', link: '/search/valorant' },
    { label: 'Music', link: '/search/music' },
    { label: 'Sports', link: '/search/sports' },
    { label: 'Series', link: '/search/series' },
    { label: 'Movies', link: '/search/movies' },
    { label: 'Politics', link: '/search/politics' },
    { label: 'Comedy', link: '/search/comedy' },
    { label: 'Celebrities', link: '/search/celebrities' },
]

const defaultPrTags: PrTag[] = [
        {
        label: 'Popular Buttons',
        link: '/popular',
        icon: GiSmallFire,
        btnVariant: 'violetFuchsia',
    },
    {
        label: 'Monthly Buttons',
        link: '/filter-buttons?period=month&field=views',
        icon: GiFireDash,
        btnVariant: 'indigoSky',
    },
     {
        label: 'Weekly Soundboard',
        link: '/soundboard/filter-board?period=week&field=views',
        icon: HiRectangleGroup,
        btnVariant: 'redAmber',
    }
]


export function TagContextProvider({ children }: { children: ReactNode }) {
    const [tags, setTags] = useState<Tag[]>(defaultTags)
    const [prTags, setPrTags] = useState<PrTag[]>(defaultPrTags)

    return (
        <TagContext.Provider value={{ tags, setTags, prTags, setPrTags }}>
            {children}
        </TagContext.Provider>
    )
}


export function useTags() {
    const context = useContext(TagContext)

    if (!context) {
        throw new Error('useTags must be used inside TagContextProvider')
    }

    return context
}
