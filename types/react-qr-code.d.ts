declare module 'react-qr-code' {
  import { CSSProperties } from 'react';

  interface QRCodeProps {
    value: string;
    size?: number;
    bgColor?: string;
    fgColor?: string;
    level?: 'L' | 'M' | 'Q' | 'H';
    includeMargin?: boolean;
    imageSettings?: {
      src: string;
      x?: number;
      y?: number;
      height: number;
      width: number;
      excavate?: boolean;
    };
    style?: CSSProperties;
  }

  const QRCode: React.FC<QRCodeProps>;
  export default QRCode;
}
