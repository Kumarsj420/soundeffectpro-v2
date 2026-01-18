'use client'
import { Label, Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import { ChevronDown } from 'lucide-react'
import { CheckIcon } from '@heroicons/react/20/solid'

type OptionType = {
    id: number,
    val: string
}

type SelectType = {
    select: OptionType[],
    label: string,
    value: OptionType
    onChange: (value: OptionType) => void
}

export default function Dropdown({ select, label, value, onChange }: SelectType) {


    return (
        <Listbox value={value} onChange={onChange}>
            <Label className="block text-sm/6 font-medium text-zinc-600/90 dark:text-white">{label} <span className="text-gray-500 dark:text-zinc-500">*</span></Label>
            <div className="relative mt-2">
                <ListboxButton className="grid w-full cursor-default grid-cols-1 rounded-xl bg-gray-50 py-2.5 pr-3 pl-4 text-left text-zinc-900 outline-1 -outline-offset-1 outline-zinc-400/80 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-blue-400 sm:text-sm/6 dark:bg-zinc-800 dark:text-white dark:outline-zinc-600 dark:focus-visible:outline-blue-400">
                    <span className="col-start-1 row-start-1 truncate pr-6">{value.val}</span>
                    <ChevronDown
                        aria-hidden="true"
                        className="col-start-1 row-start-1 size-5 self-center justify-self-end text-zinc-500 sm:size-4 dark:text-zinc-400"
                    />
                </ListboxButton>

                <ListboxOptions
                    transition
                    className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white py-1 text-base shadow-lg outline-1 outline-black/5 data-leave:transition data-leave:duration-100 data-leave:ease-in data-closed:data-leave:opacity-0 sm:text-sm dark:bg-zinc-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10"
                >
                    {select.map((option) => (
                        <ListboxOption
                            key={option.id}
                            value={option}
                            className="group relative cursor-default py-2 pr-4 pl-8 text-zinc-900 select-none data-focus:bg-blue-500 data-focus:text-white data-focus:outline-hidden dark:text-white dark:data-focus:bg-blue-400"
                        >
                            <span className="block truncate font-normal group-data-selected:font-semibold">{option.val}</span>

                            <span className="absolute inset-y-0 left-0 flex items-center pl-1.5 text-blue-500 group-not-data-selected:hidden group-data-focus:text-white dark:text-blue-400">
                                <CheckIcon aria-hidden="true" className="size-5" />
                            </span>
                        </ListboxOption>
                    ))}
                </ListboxOptions>
            </div>
        </Listbox>
    )
}
