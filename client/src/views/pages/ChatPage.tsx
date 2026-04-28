import { useEffect, useMemo, useRef, useState } from 'react'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import { ChatPresenter } from '../../presenters/ChatPresenter'
import { tokenStorage } from '../../api/http'
import type { ChatDto, ChatMessageDto } from '../../types/api'
import { ErrorBanner } from '../components/ErrorBanner'
import { useAuth } from '../context/AuthContext'
import { getErrorMessage } from '../../utils/app'

export function ChatPage() {
  const { user } = useAuth()
  const [chats, setChats] = useState<ChatDto[]>([])
  const [selectedChat, setSelectedChat] = useState<ChatDto | null>(null)
  const [messages, setMessages] = useState<ChatMessageDto[]>([])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const stompRef = useRef<Client | null>(null)

  const userEmail = user?.email ?? ''

  const selectedChatTitle = useMemo(() => {
    if (!selectedChat) return 'Select chat'
    return selectedChat.otherPartyEmail ?? selectedChat.recruiterEmail ?? selectedChat.applicantEmail
  }, [selectedChat])

  const loadChats = async () => {
    if (!user) return
    setLoading(true)
    setError(null)
    try {
      const data =
        user.role === 'ROLE_RECRUITER'
          ? await ChatPresenter.getRecruiterChats(user.email)
          : await ChatPresenter.getApplicantChats(user.email)
      setChats(data)
      if (data.length > 0) {
        setSelectedChat((prev) => prev ?? data[0])
      }
    } catch (loadError) {
      setError(getErrorMessage(loadError, 'Failed to load chats'))
    } finally {
      setLoading(false)
    }
  }

  const loadMessages = async (chatId: number) => {
    if (!userEmail) return
    setError(null)
    try {
      const data = await ChatPresenter.getMessages(chatId, userEmail)
      setMessages(data)
    } catch (loadError) {
      setError(getErrorMessage(loadError, 'Failed to load messages'))
    }
  }

  useEffect(() => {
    loadChats()
  }, [user?.email, user?.role])

  useEffect(() => {
    if (!selectedChat) {
      setMessages([])
      return
    }
    loadMessages(selectedChat.id)
  }, [selectedChat?.id, userEmail])

  useEffect(() => {
    if (!selectedChat || !userEmail) return
    const token = tokenStorage.get()
    if (!token) return

    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8081/ws'),
      connectHeaders: { Authorization: `Bearer ${token}` },
      reconnectDelay: 5000,
      debug: () => undefined,
    })

    client.onConnect = () => {
      client.subscribe(`/topic/chat/${selectedChat.id}`, (frame) => {
        const incoming = JSON.parse(frame.body) as ChatMessageDto
        setMessages((prev) => [...prev, incoming])
      })
    }

    client.activate()
    stompRef.current = client

    return () => {
      client.deactivate()
      stompRef.current = null
    }
  }, [selectedChat?.id, userEmail])

  const onSend = () => {
    if (!selectedChat || !text.trim() || !stompRef.current?.connected) return
    stompRef.current.publish({
      destination: `/app/chat/${selectedChat.id}/send`,
      body: JSON.stringify({ content: text.trim() }),
    })
    setText('')
  }

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Chats</h1>
      {error && <ErrorBanner message={error} />}
      <div className="grid gap-4 md:grid-cols-[320px_1fr]">
        <aside className="rounded border bg-white">
          <div className="border-b p-3 text-sm font-medium">My chats</div>
          <div className="max-h-[520px] overflow-y-auto">
            {loading && <p className="p-3 text-sm text-slate-600">Loading...</p>}
            {!loading && chats.length === 0 && <p className="p-3 text-sm text-slate-600">No chats yet.</p>}
            {chats.map((chat) => (
              <button
                key={chat.id}
                type="button"
                onClick={() => setSelectedChat(chat)}
                className={`w-full border-b p-3 text-left hover:bg-slate-50 ${selectedChat?.id === chat.id ? 'bg-slate-100' : ''}`}
              >
                <p className="text-sm font-medium">{chat.otherPartyEmail ?? chat.recruiterEmail ?? chat.applicantEmail}</p>
                <p className="text-xs text-slate-600">Response #{chat.responseId}</p>
              </button>
            ))}
          </div>
        </aside>

        <div className="rounded border bg-white">
          <div className="border-b p-3 text-sm font-medium">{selectedChatTitle}</div>
          <div className="h-[440px] space-y-2 overflow-y-auto p-3">
            {messages.map((message) => {
              const mine = message.senderEmail === userEmail
              return (
                <div key={message.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded px-3 py-2 text-sm ${mine ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-900'}`}>
                    <p>{message.content}</p>
                    <p className={`mt-1 text-[11px] ${mine ? 'text-indigo-100' : 'text-slate-500'}`}>
                      {new Date(message.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="flex gap-2 border-t p-3">
            <input
              className="flex-1 rounded border p-2"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type a message..."
              disabled={!selectedChat}
            />
            <button
              type="button"
              onClick={onSend}
              disabled={!selectedChat || !text.trim()}
              className="rounded bg-slate-900 px-3 py-2 text-white disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
