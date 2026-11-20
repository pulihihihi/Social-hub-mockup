import React from 'react';
import { Result, Button, Typography } from 'antd';
import { AppRouter } from './app/AppRouter';
import { AppProviders } from './app/AppProviders';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <Result
          status="error"
          title="Page Error"
          subTitle="Something went wrong while rendering this page."
          extra={(
            <Button type="primary" onClick={() => this.setState({ error: null })}>
              Try Again
            </Button>
          )}
        >
          <Typography.Paragraph>
            <Typography.Text strong style={{ fontSize: 14 }}>
              Error Details:
            </Typography.Text>
          </Typography.Paragraph>
          <Typography.Paragraph>
            <pre style={{ whiteSpace: 'pre-wrap', background: '#fff0f0', padding: 16, borderRadius: 8, fontSize: 12 }}>
              {this.state.error.message}
              {'\n'}
              {this.state.error.stack}
            </pre>
          </Typography.Paragraph>
        </Result>
      );
    }

    return this.props.children;
  }
}

const App = () => (
  <AppProviders>
    <ErrorBoundary>
      <AppRouter />
    </ErrorBoundary>
  </AppProviders>
);

export default App;
