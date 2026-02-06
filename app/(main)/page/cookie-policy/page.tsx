import React from 'react'
import Cookie from './cookie';
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Cookie Policy | Sound Effect Pro",
    description: "Learn how Sound Effect Pro uses cookies and similar technologies to enhance your experience. Understand what data we collect and how to manage your cookie preferences.",
};

function page() {
    return (
        <Cookie />
    )
}

export default page
