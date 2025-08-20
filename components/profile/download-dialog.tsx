'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Download, 
  Copy, 
  AlertTriangle, 
  CheckCircle, 
  ExternalLink,
  Info
} from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

interface DownloadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: string;
    title: string;
    githubUrl: string;
    thumbnailUrl?: string;
    technologies?: string[];
  };
  onDownloadConfirm: () => void;
}

export function DownloadDialog({ 
  isOpen, 
  onClose, 
  product, 
  onDownloadConfirm 
}: DownloadDialogProps) {
  const [step, setStep] = useState<'warning' | 'instructions' | 'completed'>('warning');
  const [copied, setCopied] = useState(false);

  const handleCopyGithubUrl = async () => {
    try {
      await navigator.clipboard.writeText(product.githubUrl);
      setCopied(true);
      toast.success('Đã copy GitHub URL!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Không thể copy URL');
    }
  };

  const handleConfirmDownload = () => {
    onDownloadConfirm();
    setStep('instructions');
  };

  const handleClose = () => {
    setStep('warning');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader className="pb-3">
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Download className="h-4 w-4" />
            Tải xuống: {product.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Product Info */}
          <Card className="border-0 bg-gray-50">
            <CardContent className="p-3">
              <div className="flex items-center gap-3">
                {product.thumbnailUrl && (
                  <Image 
                    src={product.thumbnailUrl} 
                    alt={product.title}
                    width={48}
                    height={48}
                    className="rounded-md object-cover"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm truncate">{product.title}</h3>
                  {product.technologies && product.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {product.technologies.slice(0, 3).map((tech) => (
                        <Badge key={tech} variant="secondary" className="text-xs px-1.5 py-0.5">
                          {tech}
                        </Badge>
                      ))}
                      {product.technologies.length > 3 && (
                        <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                          +{product.technologies.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Warning Step */}
          {step === 'warning' && (
            <div className="space-y-3">
              <Card className="border-yellow-200 bg-yellow-50">
                <CardContent className="p-3">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div className="space-y-2">
                      <h4 className="font-medium text-yellow-800 text-sm">Lưu ý quan trọng</h4>
                      <ul className="text-xs text-yellow-700 space-y-0.5">
                        <li>• Source code được lưu trữ trên GitHub repository</li>
                        <li>• Đảm bảo bạn đã cài đặt Git trên máy tính</li>
                        <li>• Chỉ dành cho mục đích học tập và phát triển cá nhân</li>
                        <li>• Không được phân phối lại hoặc bán source code</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={handleClose} size="sm">
                  Hủy bỏ
                </Button>
                <Button onClick={handleConfirmDownload} size="sm">
                  Tôi hiểu, tiếp tục
                </Button>
              </div>
            </div>
          )}

          {/* Instructions Step */}
          {step === 'instructions' && (
            <div className="space-y-3">
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="p-3">
                  <div className="flex items-start gap-2">
                    <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="space-y-3 w-full">
                      <h4 className="font-medium text-blue-800 text-sm">Hướng dẫn tải xuống</h4>
                      
                      <div className="space-y-2 text-xs text-blue-700">
                        <div>
                          <p className="font-medium mb-1">Bước 1: Copy GitHub URL</p>
                          <div className="flex items-center gap-1 p-2 bg-white rounded border">
                            <code className="flex-1 text-xs break-all">{product.githubUrl}</code>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={handleCopyGithubUrl}
                              className="shrink-0 h-6 w-6 p-0"
                            >
                              {copied ? (
                                <CheckCircle className="h-3 w-3 text-green-600" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </Button>
                          </div>
                        </div>

                        <div>
                          <p className="font-medium mb-1">Bước 2: Clone repository</p>
                          <div className="p-2 bg-gray-100 rounded font-mono text-xs">
                            git clone {product.githubUrl}
                          </div>
                        </div>

                        <div>
                          <p className="font-medium mb-1">Bước 3: Cài đặt dependencies</p>
                          <div className="p-2 bg-gray-100 rounded font-mono text-xs space-y-0.5">
                            <div>cd react-admin-dashboard</div>
                            <div>npm install</div>
                            <div>npm run dev</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={handleClose} size="sm">
                  Đóng
                </Button>
                <Button 
                  onClick={() => window.open(product.githubUrl, '_blank')}
                  className="gap-1"
                  size="sm"
                >
                  <ExternalLink className="h-3 w-3" />
                  Mở GitHub
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
