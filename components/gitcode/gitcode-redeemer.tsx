'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Gift, ExternalLink, Copy } from 'lucide-react';
import { useGitCodeRedeemer } from '@/hooks/use-gitcode';
import type { GitCodeUsageResult } from '@/hooks/use-gitcode';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { toast } from 'sonner';

export function GitCodeRedeemer() {
  const [code, setCode] = useState('');
  const [result, setResult] = useState<GitCodeUsageResult | null>(null);
  const [showResult, setShowResult] = useState(false);
  
  const { redeemGitCode, loading, error } = useGitCodeRedeemer();

  const handleRedeem = async () => {
    if (!code.trim()) {
      toast.error('Vui lòng nhập mã GitCode');
      return;
    }

    const redeemResult = await redeemGitCode(code.trim());
    if (redeemResult) {
      setResult(redeemResult);
      setShowResult(true);
      setCode(''); // Clear input after successful redemption
    }
  };

  const handleCopyUrl = async () => {
    if (result?.repo_url) {
      await navigator.clipboard.writeText(result.repo_url);
      toast.success('Đã copy link vào clipboard!');
    }
  };

  const handleOpenUrl = () => {
    if (result?.repo_url) {
      window.open(result.repo_url, '_blank');
    }
  };

  return (
    <>
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Gift className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">Nhập mã GitCode</CardTitle>
          <CardDescription>
            Nhập mã để nhận quà tặng source code miễn phí
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Input
              placeholder="Nhập mã GitCode (VD: FREE2025)"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleRedeem();
                }
              }}
              className="text-center text-lg font-mono tracking-wider"
              maxLength={20}
            />
            {error && (
              <p className="text-sm text-destructive text-center">{error}</p>
            )}
          </div>
          <Button 
            onClick={handleRedeem}
            disabled={loading || !code.trim()}
            className="w-full"
            size="lg"
          >
            {loading ? 'Đang kiểm tra...' : 'Sử dụng mã'}
          </Button>
          
          <div className="text-center text-sm text-muted-foreground">
            <p>Mã GitCode là quà tặng từ MarketCode</p>
            <p>Mỗi mã chỉ có thể sử dụng số lần giới hạn</p>
          </div>
        </CardContent>
      </Card>

      {/* Result Dialog */}
      <Dialog open={showResult} onOpenChange={setShowResult}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-green-100 rounded-full">
                <Gift className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <DialogTitle className="text-center text-xl">
              🎉 Chúc mừng! Mã hợp lệ
            </DialogTitle>
            <DialogDescription className="text-center">
              Bạn đã nhận được quà tặng source code
            </DialogDescription>
          </DialogHeader>
          
          {result && (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">Mô tả:</h4>
                <p className="text-sm text-muted-foreground">
                  {result.description || 'Không có mô tả'}
                </p>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Link tải về:</h4>
                <div className="flex items-center gap-2 p-2 bg-muted rounded text-sm font-mono break-all">
                  <span className="flex-1">{result.repo_url}</span>
                </div>
                <div className="flex gap-2 mt-3">
                  <Button 
                    onClick={handleCopyUrl}
                    variant="outline" 
                    size="sm"
                    className="flex-1"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                  <Button 
                    onClick={handleOpenUrl}
                    size="sm"
                    className="flex-1"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Mở link
                  </Button>
                </div>
              </div>

              <div className="text-center text-sm text-muted-foreground">
                <p>{result.usage_info}</p>
                <p className="mt-1">Hãy clone hoặc tải về source code ngay!</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
