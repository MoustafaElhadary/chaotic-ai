import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { UserButton } from '@clerk/nextjs'
import {
  AlertCircle,
  BarChart,
  LayoutDashboard,
  List,
  Settings
} from 'lucide-react'
import { Nav } from './nav'
import Image from 'next/image'

interface SidebarProps {
  isCollapsed: boolean
}

export function Sidebar({ isCollapsed }: SidebarProps) {
  return (
    <>
      <div
        className={cn(
          'flex h-[52px] items-center justify-center',
          isCollapsed ? 'h-[52px]' : 'px-2'
        )}
      >
        <div className="flex items-center gap-3">
          <Image
            src={`/logo.png`}
            alt="Chaotic Logo"
            width={42}
            height={42}
            className="shrink-0"
          />
          {!isCollapsed && (
            <span className="text-lg font-semibold text-primary">Chaotic</span>
          )}
        </div>
      </div>
      <Separator />
      <Nav
        isCollapsed={isCollapsed}
        links={[
          {
            title: 'Dashboard',
            label: '',
            icon: LayoutDashboard,
            variant: 'default',
            url: '/'
          },
          {
            title: 'Flows',
            label: '',
            icon: List,
            variant: 'ghost',
            url: '/testing'
          },
          {
            title: 'Updates',
            label: '342',
            icon: AlertCircle,
            variant: 'ghost',
            url: '/flow'
          },
          {
            title: 'Analytics',
            label: '',
            icon: BarChart,
            variant: 'ghost',
            url: '/'
          },
          {
            title: 'Settings',
            label: '',
            icon: Settings,
            variant: 'ghost',
            url: '/settings'
          }
        ]}
      />

      <div className={cn('mt-auto p-4', isCollapsed && 'flex justify-center')}>
        <UserButton />
      </div>
    </>
  )
}