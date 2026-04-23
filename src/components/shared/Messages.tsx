"use client"
import Image, { type StaticImageData } from 'next/image'
import { useEffect, useMemo, useRef, useState } from 'react'
import { CheckCheck, Mic, MoreVertical, Paperclip, Search, Send, Smile } from 'lucide-react'
import user01 from '@/assets/images/9ce1b58aecd4ef61664409fcdd66adf48254ccb2.png'
import user02 from '@/assets/images/64d98869c74d361618fe50c4acd83255cee94bde.png'
import user03 from '@/assets/images/7ad7fbdfc39c0636354382cc5d9fdbdcd76403de.png'
import user04 from '@/assets/images/7ad7fbdfc39c0636354382cc5d9fdbdcd76403de.png'
import user05 from '@/assets/images/9ce1b58aecd4ef61664409fcdd66adf48254ccb2.png'
import user06 from '@/assets/images/7ad7fbdfc39c0636354382cc5d9fdbdcd76403de.png'
import user07 from '@/assets/images/9ce1b58aecd4ef61664409fcdd66adf48254ccb2.png'
import file1 from "@/assets/images/file2.png"
import file2 from "@/assets/images/file1.png"
import user08 from '@/assets/images/64d98869c74d361618fe50c4acd83255cee94bde.png'
import fileThumb01 from '@/assets/images/38e5c1135629ba941595a51e668a48da7e88efd9.jpg'
import fileThumb02 from '@/assets/images/file2.png'
import fileThumb04 from '@/assets/images/file1.png'

type Contact = {
    id: string
    name: string
    subtitle: string
    time: string
    online: boolean
    unread?: number
    image: StaticImageData
}

type ChatMessage = {
    id: string
    sender: 'me' | 'other'
    text?: string
    time: string
    dateLabel?: string
    gallery?: boolean
}

type AttachmentItem = {
    id: string
    name: string
    meta: string
    thumbnail: StaticImageData
}

const contacts: Contact[] = [
    { id: 'killan', name: 'Killan James', subtitle: 'Typing...', time: '4:30 PM', online: true, unread: 2, image: user01 },
    { id: 'design-team', name: 'Design Team', subtitle: 'Hello! Everyone', time: '9:36 AM', online: true, image: user02 },
    { id: 'ahmed', name: 'Ahmed Medi', subtitle: 'Wow really Cool', time: '1:15 AM', online: false, image: user03 },
    { id: 'claudia', name: 'Claudia Maudi', subtitle: 'Typing...', time: '4:30 PM', online: true, image: user04 },
    { id: 'novita', name: 'Novita', subtitle: 'yah, nice design', time: '4:30 PM', online: true, unread: 2, image: user05 },
    { id: 'milie', name: 'Milie Nose', subtitle: 'Awesome', time: '8:20 PM', online: true, unread: 1, image: user06 },
    { id: 'ikhsan', name: 'Ikhsan SD', subtitle: 'Voice message', time: 'yesterday', online: false, image: user07 },
    { id: 'aditya', name: 'Aditya', subtitle: 'publish now', time: 'yesterday', online: true, image: user08 }
]

const initialMessages: Record<string, ChatMessage[]> = {
    killan: [
        { id: 'm1', sender: 'other', text: 'Hi, Are you still Web Designer..', time: '10:12 AM' },
        { id: 'm2', sender: 'other', text: 'would love to see some Design', time: '10:13 AM', dateLabel: 'Today, March 24' },
        { id: 'm3', sender: 'other', text: 'Hey, happy to hear from you. Yes, I will be back in a couple of days.', time: '10:23 AM' },
        { id: 'm4', sender: 'other', text: 'Here are some Design i took earlier today', time: '10:24 AM' },
        { id: 'm5', sender: 'other', gallery: true, time: '10:25 AM' },
        { id: 'm6', sender: 'me', text: "Great. That's a nice design idea.", time: '10:30 AM' }
    ],
    'design-team': [
        { id: 'd1', sender: 'other', text: 'Please share today banner assets.', time: '9:36 AM' },
        { id: 'd2', sender: 'me', text: 'Sure, uploading now.', time: '9:38 AM' }
    ],
    ahmed: [{ id: 'a1', sender: 'other', text: 'Wow really Cool', time: '1:15 AM' }],
    claudia: [{ id: 'c1', sender: 'other', text: 'Need one more variation for homepage hero.', time: '4:30 PM' }],
    novita: [{ id: 'n1', sender: 'other', text: 'yah, nice design', time: '4:30 PM' }],
    milie: [{ id: 'mi1', sender: 'other', text: 'Awesome', time: '8:20 PM' }],
    ikhsan: [{ id: 'i1', sender: 'other', text: 'Voice message', time: 'yesterday' }],
    aditya: [{ id: 'ad1', sender: 'other', text: 'publish now', time: 'yesterday' }]
}

const defaultAttachments: AttachmentItem[] = [
    { id: 'f1', name: 'Very important file.figma', meta: '7.5 MB 3.22.22, 11:15 AM', thumbnail: file1 },
    { id: 'f2', name: 'Some file, scratch', meta: '7.5 MB 3.22.22, 11:15 AM', thumbnail: file2 },
    { id: 'f3', name: 'List of someting.xd', meta: '7.5 MB 3.22.22, 11:15 AM', thumbnail: fileThumb04 },
    { id: 'f4', name: 'Very important fil.svg', meta: '7.5 MB 3.22.22, 11:15 AM', thumbnail: user07 }
]

const currentUser = {
    name: 'You',
    image: user06
}

const resellerToContactId: Record<string, string> = {
    'fashion-hub-bd': 'killan',
    'tech-gadgets-store': 'design-team',
    'elite-electronics': 'ahmed',
    'modern-home-decor': 'claudia',
    'style-zone': 'novita',
}

type MessagesProps = {
    preselectedReseller?: string
}

const Messages = ({ preselectedReseller }: MessagesProps) => {
    const [query, setQuery] = useState('')
    const [activeId, setActiveId] = useState<string>(() => {
        if (preselectedReseller) {
            const mappedId = resellerToContactId[preselectedReseller]
            if (mappedId) {
                return mappedId
            }
        }
        return contacts[0]?.id ?? ''
    })
    const [draft, setDraft] = useState('')
    const [messagesByContact, setMessagesByContact] = useState<Record<string, ChatMessage[]>>(initialMessages)
    const messagesContainerRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        if (!preselectedReseller) {
            return
        }

        const mappedId = resellerToContactId[preselectedReseller]
        if (mappedId) {
            setActiveId(mappedId)
        }
    }, [preselectedReseller])

    const filteredContacts = useMemo(
        () => contacts.filter((contact) => contact.name.toLowerCase().includes(query.toLowerCase())),
        [query]
    )

    const resolvedActiveId = useMemo(() => {
        if (filteredContacts.length === 0) return ''
        const selectedStillVisible = filteredContacts.some((contact) => contact.id === activeId)
        return selectedStillVisible ? activeId : filteredContacts[0].id
    }, [activeId, filteredContacts])

    const activeContact = contacts.find((contact) => contact.id === resolvedActiveId)
    const activeMessages = resolvedActiveId ? messagesByContact[resolvedActiveId] ?? [] : []

    useEffect(() => {
        const container = messagesContainerRef.current
        if (!container) return

        container.scrollTo({
            top: container.scrollHeight,
            behavior: 'smooth'
        })
    }, [resolvedActiveId, activeMessages.length])

    const sendMessage = () => {
        const content = draft.trim()
        if (!content || !resolvedActiveId) return

        const newMessage: ChatMessage = {
            id: `new-${Date.now()}`,
            sender: 'me',
            text: content,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }

        setMessagesByContact((prev) => ({
            ...prev,
            [resolvedActiveId]: [...(prev[resolvedActiveId] ?? []), newMessage]
        }))
        setDraft('')
    }

    return (
        <section className="overflow-hidden rounded-4xl border border-slate-200 bg-[#f2f4f7]">
            <div className="grid h-180 lg:grid-cols-[280px_minmax(0,1fr)_280px]">
                <aside className="flex min-h-0 flex-col border-b border-slate-200 bg-[#E9EAEC] p-4 lg:border-r lg:border-b-0">
                    <h2 className="text-3xl font-bold text-title">Messages</h2>

                    <div className="relative mt-4">
                        <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-description" />
                        <input
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            placeholder="Search..."
                            className="h-11 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm text-title outline-none transition focus:border-main"
                        />
                    </div>

                    <div className="mt-4 min-h-0 flex-1 space-y-1 overflow-y-auto pr-1">
                        {filteredContacts.length === 0 ? (
                            <p className="rounded-lg bg-white p-3 text-sm text-description">No users found.</p>
                        ) : (
                            filteredContacts.map((contact, index) => (
                                <button
                                    key={contact.id}
                                    type="button"
                                    onClick={() => setActiveId(contact.id)}
                                    className={`w-full rounded-xl p-2 text-left transition ${contact.id === resolvedActiveId ? 'bg-white shadow-sm' : 'hover:bg-white/70'}`}
                                >
                                    {index === 3 && <p className="mb-2 text-xs font-semibold text-description">All Message</p>}
                                    <div className="flex items-start gap-2.5">
                                        <div className="relative">
                                            <Image src={contact.image} alt={contact.name} width={40} height={40} className="h-10 w-10 rounded-full object-cover" />
                                            {contact.online && <span className="absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full border border-white bg-emerald-500" />}
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center justify-between gap-1">
                                                <p className="truncate text-sm font-semibold text-title">{contact.name}</p>
                                                <p className="text-[11px] text-description">{contact.time}</p>
                                            </div>
                                            <div className="mt-0.5 flex items-center justify-between gap-2">
                                                <p className={`truncate text-xs ${contact.subtitle.toLowerCase().includes('typing') ? 'text-emerald-600' : 'text-description'}`}>{contact.subtitle}</p>
                                                {contact.unread ? (
                                                    <span className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
                                                        {contact.unread}
                                                    </span>
                                                ) : (
                                                    <CheckCheck className="h-3.5 w-3.5 text-emerald-500" />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </aside>

                <main className="flex min-h-0 flex-col border-b border-slate-200 bg-[#f7f9fc] lg:border-r lg:border-b-0">
                    {activeContact ? (
                        <>
                            <header className="flex items-center gap-3 border-b border-slate-200 px-4 py-3">
                                <Image src={activeContact.image} alt={activeContact.name} width={44} height={44} className="h-11 w-11 rounded-full object-cover" />
                                <div>
                                    <p className="text-3xl font-semibold text-title">{activeContact.name}</p>
                                    <p className="text-xs text-description">{activeContact.online ? 'online' : 'offline'}</p>
                                </div>
                            </header>

                            <div ref={messagesContainerRef} className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4">
                                {activeMessages.map((message) => (
                                    <div key={message.id}>
                                        {message.dateLabel && (
                                            <div className="my-3 flex items-center gap-3 text-[11px] text-description">
                                                <span className="h-px flex-1 bg-slate-300" />
                                                <span>{message.dateLabel}</span>
                                                <span className="h-px flex-1 bg-slate-300" />
                                            </div>
                                        )}

                                        <div className={`flex items-end gap-2 ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                                            <Image
                                                src={message.sender === 'me' ? currentUser.image : activeContact.image}
                                                alt={message.sender === 'me' ? currentUser.name : activeContact.name}
                                                width={30}
                                                height={30}
                                                className="h-7.5 w-7.5 rounded-full object-cover"
                                            />
                                            <div className={`max-w-[74%] ${message.sender === 'me' ? 'items-end' : 'items-start'}`}>
                                                {message.text ? (
                                                    <div className={`rounded-lg px-4 py-2 text-sm ${message.sender === 'me' ? 'bg-[#1f6fff] text-white' : 'bg-[#2f7df5] text-white'}`}>
                                                        {message.text}
                                                    </div>
                                                ) : null}

                                                {message.gallery ? (
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <Image src={fileThumb01} alt="Shared file 1" width={128} height={144} className="h-36 w-32 rounded-lg object-cover" />
                                                        <Image src={fileThumb02} alt="Shared file 2" width={128} height={144} className="h-36 w-32 rounded-lg object-cover" />
                                                    </div>
                                                ) : null}

                                                <p className="mt-1 text-[11px] text-description">{message.time}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <footer className="border-t border-slate-200 bg-[#0f172a] p-3">
                                <div className="flex items-center gap-2 rounded-full bg-[#111c34] px-3 py-2">
                                    <button type="button" className="text-slate-400 hover:text-white" aria-label="Voice message">
                                        <Mic className="h-4 w-4" />
                                    </button>
                                    <input
                                        value={draft}
                                        onChange={(event) => setDraft(event.target.value)}
                                        onKeyDown={(event) => {
                                            if (event.key === 'Enter') sendMessage()
                                        }}
                                        placeholder="Add a comment..."
                                        className="h-8 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-400"
                                    />
                                    <button type="button" className="text-slate-400 hover:text-white" aria-label="Attachment">
                                        <Paperclip className="h-4 w-4" />
                                    </button>
                                    <button type="button" className="text-slate-400 hover:text-white" aria-label="Emoji">
                                        <Smile className="h-4 w-4" />
                                    </button>
                                    <button type="button" onClick={sendMessage} className="grid h-8 w-8 place-items-center rounded-full bg-main text-white" aria-label="Send">
                                        <Send className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            </footer>
                        </>
                    ) : (
                        <div className="grid flex-1 place-items-center px-4 text-center text-description">
                            <p>Select a user to start chatting.</p>
                        </div>
                    )}
                </main>

                <aside className="min-h-0 overflow-y-auto bg-[#E9EAEC] p-4">
                    {activeContact ? (
                        <>
                            <div className="mb-6 text-center">
                                <Image src={activeContact.image} alt={activeContact.name} width={80} height={80} className="mx-auto h-20 w-20 rounded-full object-cover" />
                                <p className="mt-3 text-2xl font-semibold text-title">{activeContact.name}</p>
                                <p className="text-sm text-description">@{activeContact.name.toLowerCase().replace(/\s+/g, '_')}</p>
                            </div>

                            <div>
                                <div className="mb-2 flex items-center justify-between">
                                    <h3 className="text-xl font-semibold text-title">Attachments</h3>
                                    <button type="button" className="text-description hover:text-title" aria-label="More options">
                                        <MoreVertical className="h-4 w-4" />
                                    </button>
                                </div>

                                <div className="space-y-2">
                                    {defaultAttachments.map((file) => (
                                        <article key={file.id} className="flex items-start gap-2 rounded-lg p-2">
                                            <Image src={file.thumbnail} alt={file.name} width={34} height={34} className="h-8 w-8 rounded-md object-cover" />
                                            <div>
                                                <p className="text-sm font-medium text-title">{file.name}</p>
                                                <p className="text-[11px] text-description">{file.meta}</p>
                                            </div>
                                        </article>
                                    ))}
                                </div>

                                <button type="button" className="mt-3 text-sm font-medium text-main hover:underline">
                                    View all
                                </button>
                            </div>
                        </>
                    ) : (
                        <p className="text-sm text-description">No user selected.</p>
                    )}
                </aside>
            </div>
        </section>
    )
}

export default Messages