export default {
  criticalFiles: {
    'site-index.js': {
      lockLevel: 'strict',
      requireBackup: true,
      validateContent: true,
      allowedOperations: ['read', 'controlled-write'],
      preChangeHooks: ['validate-structure', 'backup'],
      postChangeHooks: ['verify-integrity', 'sync-check']
    },
    'header-menu.js': {
      lockLevel: 'strict',
      backupInterval: 300000,
      validateBeforeUnlock: true
    }
  },
  safetyChecks: {
    preModification: [
      'validateFileStructure',
      'checkDependencies',
      'verifyLockStatus',
      'createBackupPoint'
    ],
    duringModification: [
      'monitorChanges',
      'validateSyntax',
      'checkIntegrity'
    ],
    postModification: [
      'verifyStructure',
      'testFunctionality',
      'updateLockStatus',
      'syncBackups'
    ]
  },
  recovery: {
    backupLocation: './bolt-backups',
    keepVersions: 5,
    autoRestore: true,
    notifyOnRestore: true
  },
  monitoring: {
    enabled: true,
    checkInterval: 300000,
    alertChannels: ['console', 'notification'],
    metrics: [
      'fileAccess',
      'modifications',
      'lockStatus',
      'syncStatus'
    ]
  }
}
