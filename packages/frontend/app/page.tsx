'use client'

import { Box, Container, Heading, Text, VStack } from '@chakra-ui/react'
import { useChat } from 'ai/react'

export default function Home() {
  const { messages, input, handleInputChange, handleSubmit } = useChat()

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8}>
        <Box textAlign="center">
          <Heading as="h1" size="2xl" mb={4}>
            MultiAPI AI Chatbot
          </Heading>
          <Text color="gray.600">
            Ask me anything about GitHub, logos, or web search!
          </Text>
        </Box>

        <Box w="full" bg="white" p={6} rounded="lg" shadow="md">
          <form onSubmit={handleSubmit}>
            <input
              value={input}
              onChange={handleInputChange}
              placeholder="Type your message..."
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #E2E8F0',
                borderRadius: '8px',
                marginBottom: '16px'
              }}
            />
          </form>

          <VStack spacing={4} align="stretch">
            {messages.map(message => (
              <Box
                key={message.id}
                bg={message.role === 'assistant' ? 'blue.50' : 'gray.50'}
                p={4}
                rounded="md"
              >
                <Text>{message.content}</Text>
              </Box>
            ))}
          </VStack>
        </Box>
      </VStack>
    </Container>
  )
}