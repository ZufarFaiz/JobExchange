import axios from 'axios'
import { tokenStorage } from './http'
import type { ChatDto, ChatMessageDto, CreateChatRequest } from '../types/api'

const chatHttp = axios.create({
  baseURL: 'http://localhost:8081',
})

chatHttp.interceptors.request.use((config) => {
  const token = tokenStorage.get()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const chatApi = {
  async createChat(payload: CreateChatRequest) {
    const { data } = await chatHttp.post<ChatDto>('/api/chats', payload)
    return data
  },
  async getChatByResponse(responseId: number) {
    const { data } = await chatHttp.get<ChatDto>(`/api/chats/response/${responseId}`)
    return data
  },
  async getApplicantChats(email: string) {
    const { data } = await chatHttp.get<ChatDto[]>(`/api/chats/applicant/${encodeURIComponent(email)}`)
    return data
  },
  async getRecruiterChats(email: string) {
    const { data } = await chatHttp.get<ChatDto[]>(`/api/chats/recruiter/${encodeURIComponent(email)}`)
    return data
  },
  async getMessages(chatId: number, email: string) {
    const { data } = await chatHttp.get<ChatMessageDto[]>(`/api/chats/${chatId}/messages`, {
      params: { email },
    })
    return data
  },
}
