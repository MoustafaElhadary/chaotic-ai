'use client'

import React from 'react'
import {
  PlusCircle,
  MinusCircle,
  Clock,
  GitBranch,
  Webhook,
  Pencil,
  AlertCircle,
  Trash2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList
} from '@/components/ui/command'
import { useFlowContext } from './FlowContext'

export default function SettingsComponent() {
  const {
    envVars,
    addEnvVar,
    removeEnvVar,
    updateEnvVar,
    clearEnvVars,
    schedule,
    setSchedule,
    createJiraCard,
    setCreateJiraCard,
    createGithubPR,
    setCreateGithubPR,
    webhookUrl,
    setWebhookUrl
  } = useFlowContext()

  const scheduleOptions = [
    'Every hour',
    'Every day at midnight',
    'Every Monday at 9am'
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log({
      envVars,
      schedule,
      createJiraCard,
      createGithubPR,
      webhookUrl
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6">
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Environment Variables</h2>
        <div className="grid grid-cols-[1fr,1fr,auto,auto] gap-2">
          <Label>Key</Label>
          <Label>Value</Label>
          <span></span>
          <span></span>
          {envVars.map((envVar, index) => (
            <React.Fragment key={index}>
              <Input
                placeholder="e.g. CLIENT_KEY"
                value={envVar.key}
                onChange={e => updateEnvVar(index, 'key', e.target.value)}
              />
              <Input
                placeholder="Value"
                value={envVar.value}
                onChange={e => updateEnvVar(index, 'value', e.target.value)}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeEnvVar(index)}
                className="w-9 h-9"
              >
                <MinusCircle className="h-4 w-4" />
              </Button>
            </React.Fragment>
          ))}
        </div>
        <div className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => addEnvVar()}
            className="w-1/2"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Another
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={clearEnvVars}
            className="w-1/2 ml-2"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Clear All
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="schedule" className="flex items-center">
          <Clock className="mr-2 h-4 w-4" />
          Schedule
        </Label>
        <Popover>
          <PopoverTrigger asChild>
            <Input
              id="schedule"
              value={schedule}
              onChange={e => setSchedule(e.target.value)}
              placeholder="Select or enter schedule"
            />
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-0">
            <Command>
              <CommandGroup>
                <CommandList>
                  {scheduleOptions.map(option => (
                    <CommandItem
                      key={option}
                      onSelect={() => setSchedule(option)}
                    >
                      {option}
                    </CommandItem>
                  ))}
                </CommandList>
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="jira-card"
          checked={createJiraCard}
          onCheckedChange={setCreateJiraCard}
        />
        <Label htmlFor="jira-card" className="flex items-center">
          <AlertCircle className="mr-2 h-4 w-4" />
          Create JIRA card with video recording
        </Label>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="github-pr"
          checked={createGithubPR}
          onCheckedChange={setCreateGithubPR}
        />
        <Label htmlFor="github-pr" className="flex items-center">
          <GitBranch className="mr-2 h-4 w-4" />
          Create GitHub PR
        </Label>
      </div>

      <div className="space-y-2">
        <Label htmlFor="webhook-url" className="flex items-center">
          <Webhook className="mr-2 h-4 w-4" />
          Notify Webhook URL
        </Label>
        <Input
          id="webhook-url"
          type="url"
          placeholder="https://example.com/webhook"
          value={webhookUrl}
          onChange={e => setWebhookUrl(e.target.value)}
        />
      </div>

      <Button type="submit" className="w-full">
        Save
      </Button>
    </form>
  )
}
