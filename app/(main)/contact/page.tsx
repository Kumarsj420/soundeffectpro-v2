import React from 'react'
import ContactPage from './contact';
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Contact Us | Sound Effect Pro",
    description: "Get in touch with Sound Effect Pro. Contact our support team for questions, feedback, technical assistance, or business inquiries.",
};

function page() {
    return (
        <ContactPage />
    )
}

export default page
