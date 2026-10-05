import "stream-chat";

declare module "stream-chat" {
  interface CustomChannelData {
    name?: string;
    image?: string;
    description?: string;
  }
  interface CustomMessageData {
    custom?: Record<string, unknown>;
  }
}
