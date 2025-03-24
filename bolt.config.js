export default {
  project: {
    name: 'master_titan_biz_framework',
    type: 'react-ts',
    source: {
      type: 'github',
      repo: 'KodeRacer5/master_titan_biz_framework',
      branch: 'main'
    },
    sync: {
      enabled: true,
      mode: 'bidirectional',
      interval: 300000 // 5 minutes
    }
  },
  deployment: {
    provider: 'netlify',
    environments: {
      production: {
        branch: 'main',
        buildCommand: 'bolt build --prod',
        autoDeployEnabled: false
      },
      staging: {
        branch: 'staging',
        buildCommand: 'bolt build --staging',
        autoDeployEnabled: true
      }
    }
  },
  protection: {
    enabled: true,
    files: {
      'site-index.js': { protected: true },
      'header-menu.js': { protected: true }
    }
  }
}
