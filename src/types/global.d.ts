export {};

declare global {
  interface Window {
    __COMPONENT_ERROR__?: (error: Error, errorInfo: React.ErrorInfo) => void;
  }
}
