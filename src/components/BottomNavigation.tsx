'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavigationItem {
  normalIcon: string
  activeIcon: string
  alt: string
  label: string
  href: string
}

interface BottomNavigationProps {
  className?: string
}

export default function BottomNavigation({ className = '' }: BottomNavigationProps) {
  const pathname = usePathname()

  const navigationItems: NavigationItem[] = [
    { 
      normalIcon: "/icons/home.png",
      activeIcon: "/icons/home1.png", 
      alt: "Home", 
      label: "Home", 
      href: "/" 
    },
    { 
      normalIcon: "/icons/pool.png",
      activeIcon: "/icons/pool1.png", 
      alt: "Mining", 
      label: "Mining", 
      href: "/mining" 
    },
    { 
      normalIcon: "/icons/serve.png",
      activeIcon: "/icons/serve1.png", 
      alt: "Service", 
      label: "Service", 
      href: "/service" 
    },
    { 
      normalIcon: "/icons/invite.png",
      activeIcon: "/icons/invite1.png", 
      alt: "Invite", 
      label: "Invite", 
      href: "/invite" 
    },
    { 
      normalIcon: "/icons/user.png",
      activeIcon: "/icons/user1.png", 
      alt: "User", 
      label: "User", 
      href: "/user" 
    },
  ]

  const isActive = (href: string) => {
    if (!pathname) return false
    
    if (href === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(href)
  }

  return (
    <nav className={`fixed bottom-0 left-0 right-0 frosted-glass border-t border-border z-20 ${className}`}>
      <div className="flex justify-around items-center py-2">
        {navigationItems.map((item) => {
          const active = isActive(item.href)
          
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center py-2 px-4 transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                active ? 'scale-110' : ''
              }`}
              style={{ textDecoration: 'none' }}
            >
              <img
                src={active ? item.activeIcon : item.normalIcon}
                alt={item.alt}
                className="w-6 h-6 mb-1 transition-all duration-300"
                onError={(e) => {
                  // 图片加载失败时的处理
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                }}
              />
              <span className={`text-xs transition-all duration-300 ${
                active ? 'text-primary font-semibold' : 'text-white'
              }`}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

// 用于添加底部间距的组件
export function BottomSpacer() {
  return <div className="h-20" />
} 