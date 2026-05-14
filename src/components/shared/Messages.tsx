"use client"
import Image from 'next/image'
import { useEffect, useMemo, useRef, useState } from 'react'
import { CheckCheck, Mic, Paperclip, Search, Send, Smile, Loader2, MessageSquareText } from 'lucide-react'
import { useInboxListQuery, useInboxMessageListQuery } from '@/redux/features/message/message.api'
import { useGetProfileQuery } from '@/redux/features/auth/auth.api'
import { useChatWebSocket, type ChatMessage } from '@/utils/ws'
import getFullImageUrl from '@/utils/getFullImageUrl'

function getUserFromCookie(): any | null {
    if (typeof document === 'undefined') return null;
    const match = document.cookie.match(/(?:^|;\s*)userData=([^;]*)/);
    if (!match) return null;
    try { return JSON.parse(decodeURIComponent(match[1])); } catch { return null; }
}

type Contact = {
    id: string
    name: string
    subtitle: string
    time: string
    online: boolean
    unread?: number
    image: string
}

type MessagesProps = {
    preselectedReseller?: string
}

const Messages = ({ preselectedReseller }: MessagesProps) => {
    const [query, setQuery] = useState('')

    // Fetch realtime inboxes list
    const { data: inboxResponse, isLoading: isInboxLoading, refetch: refetchInboxes } = useInboxListQuery(undefined, {
        refetchOnMountOrArgChange: true
    });

    // Resolve logged in admin user profile details securely
    const { data: profileResponse } = useGetProfileQuery(undefined);
    const currentUser = useMemo(() => {
        const cookieUser = getUserFromCookie();
        return {
            id: profileResponse?.data?.id || cookieUser?.id,
            full_name: profileResponse?.data?.full_name || cookieUser?.full_name || 'Admin User',
            image: profileResponse?.data?.image || cookieUser?.image || ''
        };
    }, [profileResponse]);

    // Format dynamic contacts matching active API structure
    const dynamicContacts: Contact[] = useMemo(() => {
        if (!inboxResponse?.data || !Array.isArray(inboxResponse.data)) return [];

        return inboxResponse.data.map((inbox: any) => {
            // Intelligent check: avoid designating the current admin user as the conversation title partner
            let participant = inbox.participants?.[0] || {};
            if (currentUser.id && String(participant.id) === String(currentUser.id) && inbox.participants?.[1]) {
                participant = inbox.participants[1];
            } else if (currentUser.full_name && participant.full_name?.trim().toLowerCase() === currentUser.full_name.trim().toLowerCase() && inbox.participants?.[1]) {
                participant = inbox.participants[1];
            }

            const activityTime = participant.last_activity ? new Date(participant.last_activity) : new Date();
            let subtitleText = inbox.last_message?.text || 'Start conversation';
            if (typeof subtitleText === 'object') {
                subtitleText = subtitleText?.text || subtitleText?.message || subtitleText?.content || 'Attached payload';
            }

            return {
                id: String(inbox.id),
                name: participant.full_name || 'Partner Account',
                subtitle: subtitleText,
                time: participant.last_activity ? activityTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
                online: true,
                image: participant.image || ''
            };
        });
    }, [inboxResponse, currentUser]);

    const [activeId, setActiveId] = useState<string>('');

    // Synchronize active connection parameter if predefined context link triggers view
    useEffect(() => {
        if (dynamicContacts.length > 0) {
            if (preselectedReseller) {
                const matchedThread = dynamicContacts.find(c => c.id === preselectedReseller || c.name.toLowerCase().includes(preselectedReseller.toLowerCase()));
                if (matchedThread) {
                    setActiveId(matchedThread.id);
                    return;
                }
            }
            if (!activeId || !dynamicContacts.some(c => c.id === activeId)) {
                setActiveId(dynamicContacts[0].id);
            }
        }
    }, [dynamicContacts, preselectedReseller, activeId]);

    const [draft, setDraft] = useState('');
    const messagesContainerRef = useRef<HTMLDivElement | null>(null);

    const filteredContacts = useMemo(
        () => dynamicContacts.filter((contact) => contact.name.toLowerCase().includes(query.toLowerCase())),
        [query, dynamicContacts]
    );

    const resolvedActiveId = useMemo(() => {
        if (filteredContacts.length === 0) return '';
        const selectedStillVisible = filteredContacts.some((contact) => contact.id === activeId);
        return selectedStillVisible ? activeId : filteredContacts[0].id;
    }, [activeId, filteredContacts]);

    const activeContact = dynamicContacts.find((contact) => contact.id === resolvedActiveId);

    // Dynamic historical dialogue stream payload query
    const { data: liveMessagesRes, isLoading: isLiveMessagesLoading } = useInboxMessageListQuery(resolvedActiveId, {
        skip: !resolvedActiveId,
        refetchOnMountOrArgChange: true
    });

    const activeMessages: ChatMessage[] = useMemo(() => {
        if (!liveMessagesRes?.data || !Array.isArray(liveMessagesRes.data)) return [];

        const sortedList = [...liveMessagesRes.data].sort((a, b) => {
            return new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime();
        });

        return sortedList.map((msg: any) => {
            const senderObj = msg.sender || {};
            let isSentByMe = false;
            if (currentUser.id && senderObj.id) {
                isSentByMe = String(senderObj.id) === String(currentUser.id);
            } else if (currentUser.full_name && senderObj.full_name) {
                isSentByMe = senderObj.full_name.trim().toLowerCase() === currentUser.full_name.trim().toLowerCase();
            } else {
                isSentByMe = senderObj.full_name !== activeContact?.name;
            }

            let extractedText = '';
            const rawText = msg.text || msg.message || msg.content;
            if (typeof rawText === 'string') {
                extractedText = rawText;
            } else if (rawText && typeof rawText === 'object') {
                extractedText = rawText.text || rawText.message || rawText.content || '';
            }

            return {
                id: String(msg.id),
                sender: isSentByMe ? 'me' : 'other',
                text: extractedText,
                time: new Date(msg.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                timestamp: new Date(msg.created_at || Date.now()).getTime()
            };
        });
    }, [liveMessagesRes, activeContact, currentUser]);

    // Centralized custom Real-time messaging websocket subscription pipeline
    const { realtimeMessages, sendMessage: sendWsMessage } = useChatWebSocket({
        resolvedActiveId,
        activeContact,
        currentUser,
        refetchInboxes,
        setActiveId
    });

    // Seamless historical and realtime streams deduplication buffer
    const combinedMessages = useMemo(() => {
        const list = [...activeMessages];

        realtimeMessages.forEach((rtMsg) => {
            const isDuplicate = list.some(
                (m) => m.id === rtMsg.id || (String(m.text || '').trim() === String(rtMsg.text || '').trim() && m.sender === rtMsg.sender && Math.abs((m.timestamp || 0) - (rtMsg.timestamp || 0)) < 15000)
            );
            if (!isDuplicate) list.push(rtMsg);
        });

        return list;
    }, [activeMessages, realtimeMessages]);

    // Keep active viewing window focused downwards synchronously
    useEffect(() => {
        const container = messagesContainerRef.current;
        if (!container) return;
        container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
    }, [resolvedActiveId, combinedMessages]);

    const isSending = false;

    const executeSendMessage = async () => {
        const content = draft.trim();
        if (!content || !resolvedActiveId) return;

        const success = await sendWsMessage(content);
        if (success) {
            setDraft('');
        }
    };

    return (
        <section className="overflow-hidden rounded-4xl border border-slate-200 bg-[#f2f4f7] shadow-xs">
            <div className="grid h-180 lg:grid-cols-[280px_minmax(0,1fr)_280px]">
                {/* Left Column: Thread perspective navigations */}
                <aside className="flex min-h-0 flex-col border-b border-slate-200 bg-[#E9EAEC] p-4 lg:border-r lg:border-b-0">
                    <div className="flex items-center justify-between">
                        <h2 className="text-3xl font-bold text-title">Messages</h2>
                        {isInboxLoading && <Loader2 className="size-4 animate-spin text-slate-500 shrink-0" />}
                    </div>

                    <div className="relative mt-4">
                        <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-description" />
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search thread..."
                            className="h-11 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm text-title outline-none transition focus:border-blue-600"
                        />
                    </div>

                    <div className="mt-4 min-h-0 flex-1 space-y-1 overflow-y-auto pr-1">
                        {isInboxLoading ? (
                            <div className="flex h-32 items-center justify-center">
                                <Loader2 className="size-5 animate-spin text-slate-400" />
                            </div>
                        ) : filteredContacts.length === 0 ? (
                            <div className="rounded-xl bg-white p-6 text-center text-slate-400 border border-slate-200/60 mt-2">
                                <MessageSquareText className="mx-auto size-6 stroke-1 mb-1.5" />
                                <p className="text-xs font-medium text-slate-500">No communication threads found</p>
                            </div>
                        ) : (
                            filteredContacts.map((contact) => (
                                <button
                                    key={contact.id}
                                    type="button"
                                    onClick={() => setActiveId(contact.id)}
                                    className={`w-full rounded-xl p-2.5 text-left transition cursor-pointer ${contact.id === resolvedActiveId ? 'bg-white shadow-xs border border-slate-200/80' : 'hover:bg-white/60'}`}
                                >
                                    <div className="flex items-start gap-2.5">
                                        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-slate-200 bg-slate-100">
                                            {contact.image ? (
                                                <Image src={getFullImageUrl(contact.image) || ''} alt={contact.name} fill unoptimized className="object-cover" />
                                            ) : (
                                                <div className="grid h-full w-full place-items-center font-bold text-slate-700 text-sm bg-slate-200/50">
                                                    {contact.name.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                            {contact.online && <span className="absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full border border-white bg-emerald-500 z-10" />}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center justify-between gap-1">
                                                <p className="truncate text-sm font-semibold text-slate-900">{contact.name}</p>
                                                {contact.time && <p className="text-[11px] text-slate-400">{contact.time}</p>}
                                            </div>
                                            <div className="mt-0.5 flex items-center justify-between gap-2">
                                                <p className="truncate text-xs text-slate-500">{contact.subtitle}</p>
                                                {contact.unread ? (
                                                    <span className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-semibold text-white">
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

                {/* Middle Column: Interactive messaging log workspace */}
                <main className="flex min-h-0 flex-col border-b border-slate-200 bg-[#f7f9fc] lg:border-r lg:border-b-0">
                    {activeContact ? (
                        <>
                            <header className="flex items-center justify-between border-b border-slate-200 px-4 py-3 bg-white">
                                <div className="flex items-center gap-3">
                                    <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border border-slate-200 bg-slate-100">
                                        {activeContact.image ? (
                                            <Image src={getFullImageUrl(activeContact.image) || ''} alt={activeContact.name} fill unoptimized loading="eager" className="object-cover" />
                                        ) : (
                                            <div className="grid h-full w-full place-items-center font-bold text-slate-700 bg-slate-200/50 text-base">
                                                {activeContact.name.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-lg font-semibold text-slate-900">{activeContact.name}</p>
                                        <p className="text-xs text-emerald-600 font-medium">{activeContact.online ? 'Online active partner' : 'Offline stream'}</p>
                                    </div>
                                </div>
                                {isLiveMessagesLoading && <Loader2 className="size-4 animate-spin text-slate-400" />}
                            </header>

                            <div ref={messagesContainerRef} className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4">
                                {isLiveMessagesLoading ? (
                                    <div className="flex h-full items-center justify-center">
                                        <Loader2 className="size-6 animate-spin text-slate-300" />
                                    </div>
                                ) : combinedMessages.length === 0 ? (
                                    <div className="flex h-full flex-col items-center justify-center text-slate-300 text-center">
                                        <MessageSquareText className="size-12 stroke-1 mb-2 text-slate-300" />
                                        <p className="text-xs text-slate-400 font-medium">No conversation markup retrieved. Type below to push instantly.</p>
                                    </div>
                                ) : (
                                    combinedMessages.map((message) => (
                                        <div key={message.id}>
                                            {message.dateLabel && (
                                                <div className="my-3 flex items-center gap-3 text-[11px] text-slate-400">
                                                    <span className="h-px flex-1 bg-slate-200" />
                                                    <span className="font-medium">{message.dateLabel}</span>
                                                    <span className="h-px flex-1 bg-slate-200" />
                                                </div>
                                            )}
                                            <div className={`flex items-end gap-2 ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                                                {message.sender !== 'me' && (
                                                    <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full border border-slate-200 bg-white">
                                                        {activeContact.image ? (
                                                            <Image src={getFullImageUrl(activeContact.image) || ''} alt={activeContact.name} fill unoptimized className="object-cover" />
                                                        ) : (
                                                            <div className="grid h-full w-full place-items-center font-bold text-xs text-slate-700 bg-slate-100">
                                                                {activeContact.name.charAt(0).toUpperCase()}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                <div className={`max-w-[74%] flex flex-col ${message.sender === 'me' ? 'items-end' : 'items-start'}`}>
                                                    {message.text && (
                                                        <div className={`rounded-xl px-4 py-2.5 text-sm break-words shadow-2xs ${message.sender === 'me' ? 'bg-blue-600 text-white font-medium' : 'bg-white text-slate-800 border border-slate-200/80 font-normal'}`}>
                                                            {typeof message.text === 'string' ? message.text : String(message.text)}
                                                        </div>
                                                    )}
                                                    <p className="mt-1 text-[10px] text-slate-400 font-medium px-1">{message.time}</p>
                                                </div>

                                                {message.sender === 'me' && (
                                                    <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full border border-slate-200 bg-white">
                                                        {currentUser.image ? (
                                                            <Image src={getFullImageUrl(currentUser.image) || ''} alt={currentUser.full_name || 'Me'} fill unoptimized className="object-cover" />
                                                        ) : (
                                                            <div className="grid h-full w-full place-items-center font-bold text-xs bg-slate-900 text-white">
                                                                {(currentUser.full_name || 'M').charAt(0).toUpperCase()}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            <footer className="border-t border-slate-200 bg-[#0f172a] p-3">
                                <div className="flex items-center gap-2 rounded-full bg-[#111c34] px-3.5 py-2">
                                    <button type="button" className="text-slate-400 hover:text-white cursor-pointer transition-colors" aria-label="Voice message">
                                        <Mic className="size-4" />
                                    </button>
                                    <input
                                        value={draft}
                                        disabled={isSending}
                                        onChange={(e) => setDraft(e.target.value)}
                                        onKeyDown={(e) => { if (e.key === 'Enter') executeSendMessage(); }}
                                        placeholder="Type interactive live message markup..."
                                        className="h-8 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-400 disabled:opacity-50"
                                    />
                                    <button type="button" className="text-slate-400 hover:text-white cursor-pointer transition-colors" aria-label="Attachment">
                                        <Paperclip className="size-4" />
                                    </button>
                                    <button type="button" className="text-slate-400 hover:text-white cursor-pointer transition-colors" aria-label="Emoji">
                                        <Smile className="size-4" />
                                    </button>
                                    <button
                                        type="button"
                                        disabled={isSending || !draft.trim()}
                                        onClick={executeSendMessage}
                                        className="grid size-8 place-items-center rounded-full bg-blue-600 hover:bg-blue-700 text-white cursor-pointer disabled:opacity-50 shrink-0 shadow-xs transition-all"
                                        aria-label="Send"
                                    >
                                        {isSending ? <Loader2 className="size-3.5 animate-spin" /> : <Send className="size-3.5" />}
                                    </button>
                                </div>
                            </footer>
                        </>
                    ) : (
                        <div className="grid flex-1 place-items-center px-4 text-center text-slate-400">
                            <p className="text-sm">Select an inbox conversation target thread to commence dynamic duplex data streaming.</p>
                        </div>
                    )}
                </main>

                {/* Right Column: Premium Profile metadata viewport */}
                <aside className="min-h-0 overflow-y-auto bg-[#E9EAEC] p-4">
                    {activeContact ? (
                        <div className="mb-6 text-center">
                            <div className="relative mx-auto h-20 w-20 overflow-hidden rounded-full border-2 border-white shadow-xs bg-slate-100">
                                {activeContact.image ? (
                                    <Image src={getFullImageUrl(activeContact.image) || ''} alt={activeContact.name} fill unoptimized className="object-cover" />
                                ) : (
                                    <div className="grid h-full w-full place-items-center font-bold text-slate-700 text-2xl bg-slate-200/50">
                                        {activeContact.name.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>
                            <p className="mt-3 text-xl font-bold text-slate-900">{activeContact.name}</p>
                            <p className="text-xs text-slate-500 font-medium">@{activeContact.name.toLowerCase().replace(/\s+/g, '_')}</p>
                        </div>
                    ) : (
                        <p className="text-xs text-slate-400 text-center mt-8 font-medium">No partner highlighted.</p>
                    )}
                </aside>
            </div>
        </section>
    )
}

export default Messages