import { describe, expect, it } from 'vitest'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { IMPLEMENTATION_SCOPE_41 } from './platformBrandSources'
import { learnerAvatarPath } from './portalLearnerAvatars'
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(__dirname, '../../../..')
const MIN_AVATAR_BYTES = 500

describe('portalLearnerAvatars', () => {
  it('every scope-41 slug has avatar files above minimum size', () => {
    for (const channelId of IMPLEMENTATION_SCOPE_41) {
      for (const index of [1, 2] as const) {
        const rel = learnerAvatarPath(channelId, index)
        expect(rel).toBe(`/portal/learners/${channelId}-${index}.webp`)
        const abs = path.join(repoRoot, 'frontend/public', rel)
        expect(fs.existsSync(abs), abs).toBe(true)
        const size = fs.statSync(abs).size
        expect(size, `${channelId}-${index}.webp`).toBeGreaterThan(MIN_AVATAR_BYTES)
      }
    }
  })
})
