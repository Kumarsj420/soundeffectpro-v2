import React from 'react'
import Terms from './terms';
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Terms & Conditions | Sound Effect Pro",
    description: "Read Sound Effect Pro's terms and conditions. Understand your rights, responsibilities, and our guidelines for using our sound effects platform and services.",
};

function page() {
    return (
        <Terms />
    )
}

export default page
