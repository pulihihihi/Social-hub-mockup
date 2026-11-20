import { AppShellProvider } from './providers/AppShellContext';
import { ChannelGroupProvider } from './providers/ChannelGroupContext';
import { TopicSessionProvider } from './providers/TopicSessionContext';
import { AiAssetStoreProvider } from '../features/ai-assets/aiAssetStoreContext';

export const AppProviders = ({ children }) => (
  <AppShellProvider>
    <AiAssetStoreProvider>
      <ChannelGroupProvider>
        <TopicSessionProvider>
          {children}
        </TopicSessionProvider>
      </ChannelGroupProvider>
    </AiAssetStoreProvider>
  </AppShellProvider>
);
