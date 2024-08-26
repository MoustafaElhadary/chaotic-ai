'use client'
import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function Component() {
  const [id, setId] = useState('')
  const [debugConnectionURL, setDebugConnectionURL] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    if (id) {
      setDebugConnectionURL(`${id}`)
    } else {
      setDebugConnectionURL('')
    }
    e.preventDefault()
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Debug Connection</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex space-x-2">
            <Input
              type="text"
              value={id}
              onChange={e => setId(e.target.value)}
              placeholder="Paste ID here"
              className="flex-grow"
            />
            <Button type="submit">Load</Button>
          </form>
        </CardContent>
      </Card>
      <iframe
        src="https://example.com"
        width="100%"
        height="500px"
        allowFullScreen
      />
      {debugConnectionURL && (
        <div className="relative aspect-video w-full">
          <iframe
            src={debugConnectionURL}
            // sandbox="allow-same-origin allow-scripts"

            allow="clipboard-read; clipboard-write"
            className="absolute inset-0 w-full h-full border rounded-lg"
            style={{ pointerEvents: 'none' }}
          />
          <iframe
            src="https://example.com"
            width="100%"
            height="500px"
            allowFullScreen
          />
        </div>
      )}
    </div>
  )
}
