import React from 'react'
import { cn } from '../services/cn';

export default function SoundButton({className = '', ...props}) {
    return (
        <button className={cn('sound-btn brightness-110 hover:brightness-115 dark:brightness-105', className)} {...props}>
        </button>
    )
}
