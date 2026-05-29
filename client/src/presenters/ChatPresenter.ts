import { chatApi } from '../api/chatApi'
import type { CreateChatRequest } from '../types/api'

export const ChatPresenter = {
  createChat(payload: CreateChatRequest) {
    return chatApi.createChat(payload)
  },
  getChatByResponse(responseId: number) {
    return chatApi.getChatByResponse(responseId)
  },
  getApplicantChats(email: string) {
    return chatApi.getApplicantChats(email)
  },
  getRecruiterChats(email: string) {
    return chatApi.getRecruiterChats(email)
  },
  getMessages(chatId: number, email: string) {
    return chatApi.getMessages(chatId, email)
  },
}
