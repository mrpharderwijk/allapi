#!/usr/bin/env node

import { Command } from 'commander'

import { version } from '../../package.json'
import { checkVersion } from './commands/check-version'

const program = new Command()

program
  .name('check-semver')
  .description(
    'CLI to check if local semver version is newer than remote version',
  )
  .version(version)

program
  .command('check')
  .description('Check if local version is newer than remote version')
  .option(
    '-r, --remote-url <url>',
    'Remote URL to check version against (optional)',
  )
  .option('--registry <url>', 'npm registry URL (defaults to value in .npmrc)')
  .requiredOption(
    '-p, --package-path <path>',
    'Path to local package.json',
    './package.json',
  )
  .action(checkVersion)

program.parse()
