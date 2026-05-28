export interface Notification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
}
