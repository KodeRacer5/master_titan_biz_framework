export default {
  sources: {
    vscode: {
      enabled: true,
      watchPaths: ['src/**/*', 'public/**/*'],
      ignorePatterns: ['node_modules/**', 'dist/**', '.git/**']
    },
    github: {
      enabled: true,
      repo: 'KodeRacer5/master_titan_biz_framework',
      branch: 'main',
      autoSync: true,
      pushInterval: 300000 // 5 minutes
    },
    bolt: {
      enabled: true,
      projectId: 'master_titan_biz_framework',
      autoImport: true,
      preserveState: true,
      syncOnSave: true
    },
    stackblitz: {
      enabled: true,
      projectId: 'master_titan_biz_framework',
      autoBackup: true,
      backupInterval: 600000, // 10 minutes
      preserveHistory: true
    }
  },
  protection: {
    lockTimeout: 300000,
    maxUnlockedTime: 600000,
    autoLock: true
  },
  conflict: {
    strategy: 'bolt-first',
    resolution: {
      onConflict: 'prompt',
      defaultChoice: 'bolt'
    }
  },
  backup: {
    enabled: true,
    location: './bolt-backups',
    keepVersions: 5,
    compressionEnabled: true
  }
}
