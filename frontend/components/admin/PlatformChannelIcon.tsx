'use client'

import {
  AtSign,
  BookOpen,
  Bot,
  Cloud,
  CloudRain,
  Code,
  Facebook,
  FileText,
  Ghost,
  Globe,
  Hash,
  Headphones,
  HelpCircle,
  Image,
  Instagram,
  Layers,
  Linkedin,
  List,
  Mail,
  MessageCircle,
  MessageSquare,
  Music,
  Podcast,
  Radio,
  Rss,
  Search,
  Send,
  Share2,
  Twitter,
  Video,
  Youtube,
  type LucideIcon,
} from 'lucide-react'

const ICON_BY_NAME: Record<string, LucideIcon> = {
  Globe,
  BookOpen,
  Mail,
  Send,
  FileText,
  Hash,
  Linkedin,
  Twitter,
  Instagram,
  Facebook,
  MessageCircle,
  AtSign,
  HelpCircle,
  Cloud,
  Image,
  Youtube,
  Video,
  Ghost,
  Music,
  Podcast,
  Headphones,
  Radio,
  CloudRain,
  MessageSquare,
  Search,
  List,
  Bot,
  Rss,
  Layers,
  Code,
  Share2,
}

type PlatformChannelIconProps = {
  name?: string
  size?: number
  className?: string
}

export default function PlatformChannelIcon({ name, size = 18, className = '' }: PlatformChannelIconProps) {
  const Icon = (name && ICON_BY_NAME[name]) || Share2
  return <Icon size={size} className={className} aria-hidden />
}
