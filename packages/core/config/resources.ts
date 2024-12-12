import { IResources } from '@swarm/types/config/resources'

const resources: IResources = {
  apps: {
    general: 'https://www.swarm.com',
    swarm: 'https://app.swarm.com',
    staking: 'https://smt.swarm.com',
    vote: 'https://vote.swarm.com',
  },
  docs: {
    coreConcepts: {
      passport: 'https://docs.swarm.com/core-concepts/passport',
      passportLinkingYourWallet:
        'https://docs.swarm.com/core-concepts/passport#linking-your-wallet',
      swaps: 'https://docs.swarm.com/core-concepts/swaps',
      poolsAddLiquidity:
        'https://docs.swarm.com/core-concepts/pools#adding-liquidity-to-an-existing-pool',
      vouchers: 'https://docs.swarm.com/core-concepts/vouchers',
      businesses: 'https://docs.swarm.com/core-concepts/businesses',
    },
    general: 'https://docs.swarm.com/',
    gettingStarted: {
      faq: 'https://docs.swarm.com/getting-started/faq',
      limitations: 'https://docs.swarm.com/getting-started/faq#limitations',
      getCrypto: 'https://docs.swarm.com/getting-started/faq#get-crypto',
      proxy:
        'https://docs.swarm.com/getting-started/faq#what-are-proxy-contracts-and-atomic-transactions',
      proxyTokensExplanation:
        'https://docs.swarm.com/getting-started/faq#why-is-there-a-balance-in-my-proxy-address',
    },
    terms: {
      tos: 'https://ds-docs.swarm.com/about-us/terms-of-service',
      privacy: 'https://docs.swarm.com/about/terms/privacy',
      imprint: 'https://docs.swarm.com/about/terms/imprint',
      disclaimer: 'https://disclaimer.dotc.eth/',
    },
    token: {
      smt: {
        general: 'https://docs.swarm.com/token/smt',
        smtReleaseSchedule:
          'https://docs.swarm.com/token/smt#smt-release-schedule',
      },
    },
  },
  socials: {
    discord: 'https://discord.swarm.markets',
    twitter: 'https://twitter.com/swarmmarkets',
    github: 'https://github.com/SwarmMarkets',
  },
  mattereum: {
    terms: {
      tos: 'https://mattereum.de/token-sale-terms',
      privacy: 'https://mattereum.de/swarm-privacy-notice',
    },
  },
  metamask: 'https://metamask.io/download.html',
  iconsCdn: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons',
  cdnUrl: 'https://d153cgr8o6wwrb.cloudfront.net/',
}

export default resources
