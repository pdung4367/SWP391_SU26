import { useState, useEffect, useCallback, useRef } from 'react';
import { landlordService } from '../services/landlordService';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000', {
  withCredentials: true,
  autoConnect: false
});

export const useConversations = (params = {}) => {
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });

  const paramsString = JSON.stringify(params);

  const fetchConversations = useCallback(async () => {
    try {
      setLoading(true);
      const data = await landlordService.getConversations(JSON.parse(paramsString));
      setConversations(data.conversations || data.data || data);
      if (data.pagination) {
        setPagination(data.pagination);
      }
      setError(null);
    } catch (err) {
      setError(err.message);
      setConversations([]);
    } finally {
      setLoading(false);
    }
  }, [paramsString]);

  const fetchConversationById = useCallback(async (id) => {
    try {
      setLoading(true);
      const data = await landlordService.getConversationById(id);
      setCurrentConversation(data);
      setError(null);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Socket connection & listeners
  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    const handleReceiveMessage = (message) => {
      // If we're currently viewing this conversation, add it to the messages
      setCurrentConversation(prev => {
        if (prev && prev.id === message.conversationId) {
          // Avoid duplicate messages
          if (prev.messages?.find(m => m.messageId === message.messageId)) return prev;
          
          return {
            ...prev,
            messages: [...(prev.messages || []), message],
          };
        }
        return prev;
      });

      // Update conversations list latest message
      setConversations(prev => prev.map(conv => {
        if (conv.conversation_id === message.conversationId) {
          return {
            ...conv,
            lastMessage: message.content,
            lastMessageAt: message.createdAt
          };
        }
        return conv;
      }));
    };

    socket.on('receive_message', handleReceiveMessage);

    return () => {
      socket.off('receive_message', handleReceiveMessage);
    };
  }, []);

  // Join socket room when current conversation changes
  useEffect(() => {
    if (currentConversation && currentConversation.id) {
      socket.emit('join_conversation', currentConversation.id);
      return () => {
        socket.emit('leave_conversation', currentConversation.id);
      };
    }
  }, [currentConversation?.id]);

  const sendMessage = async (conversationId, content) => {
    try {
      const message = await landlordService.sendMessage(conversationId, content);
      if (currentConversation && currentConversation.id === conversationId) {
        setCurrentConversation({
          ...currentConversation,
          messages: [...(currentConversation.messages || []), message],
        });
      }
      return message;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    conversations,
    currentConversation,
    loading,
    error,
    pagination,
    fetchConversations,
    fetchConversationById,
    sendMessage,
  };
};

export default useConversations;
