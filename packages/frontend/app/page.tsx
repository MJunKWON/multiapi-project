'use client'

import React from 'react'
import { Box, Container, Heading } from '@chakra-ui/react'

export default function Home() {
  return (
    <Container maxW="container.xl" py={8}>
      <Box textAlign="center">
        <Heading as="h1" size="2xl" mb={8}>
          MultiAPI AI Chatbot
        </Heading>
      </Box>
    </Container>
  )
}