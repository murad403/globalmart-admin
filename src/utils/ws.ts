import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { getCurrentUser } from './auth'

export type ChatMessage = {
    id: string
    sender: 'me' | 'other'
    text?: string
    time: string
    dateLabel?: string
    timestamp?: number
}

type UseChatWebSocketOptions = {
    resolvedActiveId: string
    activeContact?: { id?: string | number; name: string }
    currentUser: { id?: string; full_name?: string }
    refetchInboxes?: () => void
    setActiveId?: (id: string) => void
}

export const useChatWebSocket = ({
    resolvedActiveId,
    activeContact,
    currentUser,
    refetchInboxes,
    setActiveId
}: UseChatWebSocketOptions) => {
    const [realtimeMessages, setRealtimeMessages] = useState<ChatMessage[]>([])
    const socketRef = useRef<WebSocket | null>(null)

    const resolvedActiveIdRef = useRef(resolvedActiveId)
    const activeContactRef = useRef(activeContact)
    const refetchInboxesRef = useRef(refetchInboxes)
    const currentUserRef = useRef(currentUser)

    useEffect(() => {
        resolvedActiveIdRef.current = resolvedActiveId
        activeContactRef.current = activeContact
    }, [resolvedActiveId, activeContact])

    // Only clear realtimeMessages when switching to a different thread ID
    useEffect(() => {
        setRealtimeMessages([])
    }, [resolvedActiveId])

    useEffect(() => {
        refetchInboxesRef.current = refetchInboxes
    }, [refetchInboxes])

    useEffect(() => {
        currentUserRef.current = currentUser
    }, [currentUser])

    useEffect(() => {
        
        let destroyed = false
        let ws: WebSocket | null = null

        const setupSocket = async () => {
            try {
                const userRes = await getCurrentUser()
                const token = userRes?.access
                if (!token) {
                    console.warn("Access token not found — WebSocket skipped.")
                    return
                }

                if (destroyed) return

                const connect = () => {
                    if (destroyed) return

                    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://10.10.12.15:8001/api/v1"
                    const wsHost = baseUrl.replace(/^http/, "ws").replace(/\/api\/v1\/?$/, "")
                    const wsUrl = `${wsHost}/ws/asc/chats/?access_token=${token}`
                    ws = new WebSocket(wsUrl)
                    socketRef.current = ws

                    ws.onopen = () => {
                        if (destroyed) {
                            ws?.close(1000, 'cleanup')
                            return
                        }
                        console.log("WebSocket connected successfully.")
                    }

                    ws.onmessage = (event) => {
                        if (destroyed) return
                        try {
                            const data = JSON.parse(event.data)

                            const msgPayload = (data.message && typeof data.message === 'object') ? data.message : data
                            const incomingChatId = String(data.chat_id || msgPayload.chat_id || msgPayload.chat || data.inbox_id || '')

                            let msgText = ''
                            const rawText = msgPayload.text || msgPayload.message || msgPayload.content || data.text || data.content
                            if (typeof rawText === 'string') {
                                msgText = rawText
                            } else if (rawText && typeof rawText === 'object') {
                                msgText = rawText.text || rawText.message || rawText.content || ''
                            }

                            const senderObj = msgPayload.sender || data.sender || {}
                            const senderName = senderObj.full_name || msgPayload.sender_name || data.sender_name || 'Partner'
                            const senderId = senderObj.id || msgPayload.sender_id || data.sender_id

                            if (!incomingChatId || !msgText) return

                            const currentActiveId = resolvedActiveIdRef.current
                            const currentContact = activeContactRef.current
                            const currentLoggedUser = currentUserRef.current

                            let isSentByMe = false
                            if (currentLoggedUser?.id && senderId) {
                                isSentByMe = String(senderId) === String(currentLoggedUser.id)
                            } else if (currentContact?.id && senderId) {
                                isSentByMe = String(senderId) !== String(currentContact.id)
                            } else if (currentLoggedUser?.full_name && senderName !== 'Partner') {
                                isSentByMe = senderName.trim().toLowerCase() === currentLoggedUser.full_name.trim().toLowerCase()
                            } else {
                                isSentByMe = senderName.trim().toLowerCase() !== (currentContact?.name || '').trim().toLowerCase()
                            }

                            refetchInboxesRef.current?.()

                            if (incomingChatId === currentActiveId) {
                                setRealtimeMessages((prev) => [
                                    ...prev,
                                    {
                                        id: String(msgPayload.id || data.id || Date.now() + Math.random()),
                                        sender: isSentByMe ? 'me' : 'other',
                                        text: msgText,
                                        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                                        timestamp: Date.now()
                                    }
                                ])
                            } else {
                                toast.info(`New message from ${senderName}`, {
                                    description: msgText,
                                    action: setActiveId ? {
                                        label: 'Open',
                                        onClick: () => setActiveId(incomingChatId)
                                    } : undefined
                                })
                            }
                        } catch (err) {
                            console.error("Failed to parse WebSocket message:", err)
                        }
                    }

                    ws.onerror = () => {
                        if (!destroyed) {
                            console.error("WebSocket connection error.")
                        }
                    }

                    ws.onclose = (event) => {
                        if (socketRef.current === ws) {
                            socketRef.current = null
                        }
                        if (destroyed) return

                        if (event.code !== 1000) {
                            console.warn(`WebSocket closed (code ${event.code}), reconnecting in 3s...`)
                            setTimeout(connect, 3000)
                        }
                    }
                }

                connect()
            } catch (err) {
                console.error("Failed to resolve session token:", err)
            }
        }

        setupSocket()

        return () => {
            destroyed = true
            if (socketRef.current) {
                const currentWs = socketRef.current
                socketRef.current = null
                if (currentWs.readyState === WebSocket.OPEN || currentWs.readyState === WebSocket.CONNECTING) {
                    currentWs.close(1000, 'cleanup')
                }
            }
        }
    }, [])

    const sendMessage = async (content: string) => {
        if (!content || !resolvedActiveId) return false

        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify({
                message: content,
                chat_id: Number(resolvedActiveId)
            }))
        } else {
            console.warn("WebSocket stream unavailable. Executing secure REST fallback transport.")
            try {
                const userRes = await getCurrentUser()
                const token = userRes?.access
                const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://10.10.12.15:8001/api/v1"
                if (token) {
                    await fetch(`${baseUrl.replace(/\/$/, "")}/chats/messages`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            message: content,
                            text: content,
                            chat_id: Number(resolvedActiveId),
                            inbox_id: Number(resolvedActiveId)
                        })
                    })
                }
            } catch (err) {
                console.error("REST fallback transport failed:", err)
            }
        }

        refetchInboxes?.()

        setRealtimeMessages((prev) => [
            ...prev,
            {
                id: String(Date.now() + Math.random()),
                sender: 'me',
                text: content,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                timestamp: Date.now()
            }
        ])

        return true
    }

    return {
        realtimeMessages,
        sendMessage
    }
}
