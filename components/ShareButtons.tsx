'use client';

import React, { useState } from 'react';
import { Share2, Twitter, MessageCircle, Link2, Check } from 'lucide-react';
import { cn } from '@/components/ui/utils';

interface ShareButtonsProps {
  url: string;
  title: string;
  description?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'horizontal' | 'vertical' | 'dropdown';
}

export const ShareButtons: React.FC<ShareButtonsProps> = ({
  url,
  title,
  description,
  className,
  size = 'md',
  variant = 'horizontal',
}) => {
  const [copied, setCopied] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const sizeClasses = {
    sm: 'h-8 w-8 p-2',
    md: 'h-10 w-10 p-2.5',
    lg: 'h-12 w-12 p-3',
  };

  const iconSizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  const handleWebShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      setShowDropdown(!showDropdown);
    }
  };

  const shareToTwitter = () => {
    const text = description ? `${title} - ${description}` : title;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, '_blank', 'noopener,noreferrer');
  };

  const shareToWhatsApp = () => {
    const text = `${title} ${url}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  const shareButtons = [
    {
      icon: Twitter,
      label: 'Compartir en Twitter',
      onClick: shareToTwitter,
      className: 'hover:bg-sky-50 hover:text-sky-600',
    },
    {
      icon: MessageCircle,
      label: 'Compartir en WhatsApp',
      onClick: shareToWhatsApp,
      className: 'hover:bg-green-50 hover:text-green-600',
    },
    {
      icon: copied ? Check : Link2,
      label: copied ? 'Enlace copiado' : 'Copiar enlace',
      onClick: copyToClipboard,
      className: copied 
        ? 'bg-green-50 text-green-600' 
        : 'hover:bg-gray-50 hover:text-gray-700',
    },
  ];

  if (variant === 'dropdown') {
    return (
      <div className={cn("relative", className)}>
        <button
          onClick={handleWebShare}
          className={cn(
            "flex items-center justify-center rounded-full border border-gray-300 bg-white text-gray-600 transition-colors hover:bg-gray-50",
            sizeClasses[size]
          )}
          aria-label="Compartir"
        >
          <Share2 className={iconSizeClasses[size]} />
        </button>
        
        {showDropdown && !navigator.share && (
          <div className="absolute right-0 top-full z-10 mt-2 w-48 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
            {shareButtons.map((button, index) => (
              <button
                key={index}
                onClick={() => {
                  button.onClick();
                  setShowDropdown(false);
                }}
                className={cn(
                  "flex w-full items-center gap-3 px-4 py-2 text-left text-sm transition-colors",
                  button.className
                )}
              >
                <button.icon className="h-4 w-4" />
                {button.label}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  const containerClasses = variant === 'vertical' 
    ? 'flex flex-col gap-2' 
    : 'flex items-center gap-2';

  return (
    <div className={cn(containerClasses, className)}>
      {shareButtons.map((button, index) => (
        <button
          key={index}
          onClick={button.onClick}
          className={cn(
            "flex items-center justify-center rounded-full border border-gray-300 bg-white text-gray-600 transition-colors",
            sizeClasses[size],
            button.className
          )}
          aria-label={button.label}
          title={button.label}
        >
          <button.icon className={iconSizeClasses[size]} />
        </button>
      ))}
    </div>
  );
};

export default ShareButtons;