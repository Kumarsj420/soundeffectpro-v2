import React from 'react'
import Privacy from './privacy'
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Privacy Policy | Sound Effect Pro",
    description: "Learn how Sound Effect Pro collects, uses, and protects your personal information. Read our privacy policy for details on data handling and your privacy rights.",
};
function page() {
  return (
    <Privacy />
  )
}

export default page
