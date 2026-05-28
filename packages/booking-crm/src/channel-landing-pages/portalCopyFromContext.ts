import briefsFile from '../../data/channel-context-briefs.json'
import {
  getChannelPortalCopy,
  channelPortalCopyToPlatformShape,
  type ChannelPortalCopy,
} from './channelPortalCopy'
import { getContextModelPath } from './contextModelRegistry'
import type { PlatformPortalCopy } from './platformThemes'

type PlatformContextBrief = {
  channelId: string
  contextBriefId?: string
  audience?: string
  cognition?: string
  conversionTolerance?: string
  voiceNotes?: string
  portalCopyOverrides?: Partial<ChannelPortalCopy>
}

const briefs = briefsFile as Record<string, PlatformContextBrief | { description?: string }>

/**
 * Portal copy pipeline: context brief (optional overrides) → channel pack → platform shape.
 */
export function getPortalCopyForChannel(channelId: string): PlatformPortalCopy | null {
  const base = getChannelPortalCopy(channelId)
  if (!base) return null

  const brief = briefs[channelId]
  if (!brief || !('channelId' in brief)) {
    return channelPortalCopyToPlatformShape(base)
  }

  const merged: ChannelPortalCopy = {
    ...base,
    ...(brief.portalCopyOverrides ?? {}),
  }
  return channelPortalCopyToPlatformShape(merged)
}

export function getContextBriefForChannel(channelId: string): PlatformContextBrief | null {
  const brief = briefs[channelId]
  if (!brief || !('channelId' in brief)) return null
  return {
    ...brief,
    contextModelPath: getContextModelPath(channelId),
  } as PlatformContextBrief & { contextModelPath?: string }
}
