declare module 'remark-gfm' {
  const content: any;
  export default content;
}

declare module 'emoji-dictionary' {
  export function getUnicode(name: string): string;
  export function getName(emoji: string): string;
  export function getEmoji(name: string): string;
}

declare module 'react-markdown' {
  import React from 'react';
  
  interface ReactMarkdownProps {
    children: string;
    remarkPlugins?: any[];
    components?: {
      [key: string]: React.ComponentType<any>;
    };
    transformImageUri?: (uri: string) => string;
  }
  
  const ReactMarkdown: React.FC<ReactMarkdownProps>;
  export default ReactMarkdown;
}