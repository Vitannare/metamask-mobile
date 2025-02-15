///: BEGIN:ONLY_INCLUDE_IF(preinstalled-snaps,external-snaps)
import React, { Component, RefObject } from 'react';
import { View, ScrollView, NativeSyntheticEvent } from 'react-native';
import { WebViewMessageEvent, WebView } from '@metamask/react-native-webview';
import { createStyles } from './styles';
import { WebViewInterface } from '@metamask/snaps-controllers/react-native';
import { WebViewError } from '@metamask/react-native-webview/lib/WebViewTypes';
import { PostMessageEvent } from '@metamask/post-message-stream';
// @ts-expect-error Types are currently broken for this.
import WebViewHTML from '@metamask/snaps-execution-environments/dist/browserify/webview/index.html';

const styles = createStyles();

interface SnapsExecutionWebViewProps {
  injectJavaScript(js: string): void;
  registerMessageListener(listener: (event: PostMessageEvent) => void): void;
  unregisterMessageListener(listener: (event: PostMessageEvent) => void): void;
}
// This is a hack to allow us to asynchronously await the creation of the WebView.
let resolveGetWebView: (arg0: SnapsExecutionWebViewProps) => void;
let rejectGetWebView: (error: NativeSyntheticEvent<WebViewError>) => void;

export const getSnapsWebViewPromise = new Promise<WebViewInterface>(
  (resolve, reject) => {
    resolveGetWebView = resolve;
    rejectGetWebView = reject;
  },
);

// This is a class component because storing the references we are don't work in functional components.
export class SnapsExecutionWebView extends Component {
  // TODO: Replace "any" with type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  webViewRef: RefObject<WebView> | any = null;
  // TODO: Replace "any" with type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  listener: any = null;

  // TODO: Replace "any" with type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-useless-constructor
  constructor(props: any) {
    super(props);
  }

  // TODO: Replace "any" with type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setWebViewRef(ref: React.RefObject<WebView<{ any: any }>> | null) {
    this.webViewRef = ref;
  }

  onWebViewLoad() {
    const api = {
      injectJavaScript: (js: string) => {
        this.webViewRef?.injectJavaScript(js);
      },
      registerMessageListener: (
        listener: (event: PostMessageEvent) => void,
      ) => {
        this.listener = listener;
      },
      unregisterMessageListener: (
        _listener: (event: PostMessageEvent) => void,
      ) => {
        this.listener = null;
      },
    };

    resolveGetWebView(api);
  }

  onWebViewError(error: NativeSyntheticEvent<WebViewError>) {
    rejectGetWebView(error);
  }

  onWebViewMessage(data: WebViewMessageEvent) {
    if (this.listener) {
      this.listener(data.nativeEvent);
    }
  }

  render() {
    return (
      <ScrollView>
        <View style={styles.webview}>
          <WebView
            ref={
              this.setWebViewRef as unknown as React.RefObject<WebView> | null
            }
            source={{ html: WebViewHTML, baseUrl: 'https://localhost' }}
            onMessage={this.onWebViewMessage}
            onError={this.onWebViewError}
            onLoadEnd={this.onWebViewLoad}
            originWhitelist={['*']}
            javaScriptEnabled
          />
        </View>
      </ScrollView>
    );
  }
}

///: END:ONLY_INCLUDE_IF
