/**
 * @make-the-change/core
 * Feature-Sliced Design Architecture
 */

// Domain Modules
export * as commerce from './entities/commerce'
export * as investment from './entities/investment'
export * as admin from './features/admin'
export * as auth from './features/auth'
// Shared Modules
export * from './shared'
export * from './shared/ui'
export * as i18n from './shared/i18n'
export * as ui from './shared/ui'

// Shared types
export * from './shared/db/json-schemas'

// Package metadata
export const PACKAGE_VERSION = '0.1.0'
export const PACKAGE_NAME = '@make-the-change/core'
