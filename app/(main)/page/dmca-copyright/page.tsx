import React from 'react'
import Dmca from './dmca';
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "DMCA Copyright Policy | Sound Effect Pro",
    description: "Sound Effect Pro's DMCA policy and copyright infringement procedures. Learn how to report copyright violations and our process for handling takedown requests.",
};

function page() {
  return (
    <Dmca />
  )
}

export default page
