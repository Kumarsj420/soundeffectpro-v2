import React from 'react'
import Community from './community';
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Community Guidelines | Sound Effect Pro",
    description: "Read Sound Effect Pro's community guidelines. Learn about our standards for respectful behavior, content sharing, and creating a positive environment for all users.",
};

function page() {
    return (
        <Community />
    )
}

export default page
