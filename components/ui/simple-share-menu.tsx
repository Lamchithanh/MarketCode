"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { 
  Share2, 
  Facebook, 
  Twitter, 
  MessageCircle, 
  Mail, 
  Copy,
  Check
} from "lucide-react";

interface SimpleShareMenuProps {
  productId: string;
  productTitle: string;
  className?: string;
  children?: React.ReactNode;
}

export function SimpleShareMenu({ 
  productId, 
  productTitle, 
  className = "",
  children 
}: SimpleShareMenuProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleShare = async (platform: string) => {
    try {
      // Generate share URL
      const productUrl = `${window.location.origin}/products/${productId}`;
      const shareText = `Xem sản phẩm tuyệt vời này: ${productTitle}`;
      
      let shareUrl = '';
      
      switch (platform) {
        case 'facebook':
          shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`;
          break;
        case 'twitter':
          shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(productUrl)}`;
          break;
        case 'whatsapp':
          shareUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${productUrl}`)}`;
          break;
        case 'email':
          shareUrl = `mailto:?subject=${encodeURIComponent(`Sản phẩm hay: ${productTitle}`)}&body=${encodeURIComponent(`${shareText}\n\n${productUrl}`)}`;
          break;
        case 'copy_link':
          await navigator.clipboard.writeText(productUrl);
          setIsCopied(true);
          toast.success('Đã sao chép liên kết!');
          setTimeout(() => setIsCopied(false), 2000);
          
          // Record share action
          recordShare('copy_link');
          return;
      }

      if (shareUrl) {
        // Open share URL in new window
        const width = 600;
        const height = 400;
        const left = window.screen.width / 2 - width / 2;
        const top = window.screen.height / 2 - height / 2;
        
        window.open(
          shareUrl,
          'share',
          `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
        );
        
        const platformName = {
          facebook: 'Facebook',
          twitter: 'Twitter', 
          whatsapp: 'WhatsApp',
          email: 'Email'
        }[platform] || platform;
        
        toast.success(`Đã chia sẻ qua ${platformName}!`);
        
        // Record share action
        recordShare(platform);
      }

    } catch (error) {
      console.error('Share error:', error);
      toast.error('Không thể chia sẻ. Vui lòng thử lại!');
    }
  };

  const recordShare = async (platform: string) => {
    try {
      await fetch(`/api/products/${productId}/share`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform }),
      });
    } catch (error) {
      console.error('Failed to record share:', error);
      // Don't show error to user for recording failure
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {children || (
          <Button variant="ghost" size="icon" className={className}>
            <Share2 className="h-4 w-4" />
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Chia sẻ sản phẩm</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={() => handleShare('facebook')}>
          <Facebook className="mr-2 h-4 w-4 text-blue-600" />
          Facebook
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => handleShare('twitter')}>
          <Twitter className="mr-2 h-4 w-4 text-sky-500" />
          Twitter
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => handleShare('whatsapp')}>
          <MessageCircle className="mr-2 h-4 w-4 text-green-600" />
          WhatsApp
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => handleShare('email')}>
          <Mail className="mr-2 h-4 w-4 text-gray-600" />
          Email
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={() => handleShare('copy_link')}>
          {isCopied ? (
            <Check className="mr-2 h-4 w-4 text-green-600" />
          ) : (
            <Copy className="mr-2 h-4 w-4 text-purple-600" />
          )}
          {isCopied ? 'Đã sao chép!' : 'Sao chép liên kết'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
