'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Gift, ExternalLink, AlertCircle } from 'lucide-react';
import { useGitCodeRedeemer } from '@/hooks/use-gitcode';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export function GitCodeManager() {
  const [code, setCode] = useState('');
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [redeemResult, setRedeemResult] = useState<{
    code: string;
    repo_url: string;
    description: string;
  } | null>(null);

  const { redeemGitCode, loading } = useGitCodeRedeemer();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!code.trim()) {
      toast.error('Vui lòng nhập mã GitCode');
      return;
    }

    const result = await redeemGitCode(code.trim());
    
    if (result.success && result.data) {
      setRedeemResult(result.data);
      setShowSuccessDialog(true);
      setCode(''); // Clear input
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Gift className="h-6 w-6 text-purple-600" />
        <h2 className="text-2xl font-bold">GitCode - Mã Quà Tặng</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5" />
            Nhập Mã GitCode
          </CardTitle>
          <CardDescription>
            Nhập mã GitCode để nhận link GitHub repository miễn phí
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                placeholder="Nhập mã GitCode của bạn (ví dụ: FREE2025)"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className="text-center text-lg font-mono tracking-wider"
                disabled={loading}
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading || !code.trim()}
            >
              {loading ? 'Đang xử lý...' : 'Sử dụng mã'}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Lưu ý quan trọng:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Mã GitCode chỉ được sử dụng với số lần giới hạn</li>
                  <li>• Một số mã có thể có thời hạn sử dụng</li>
                  <li>• Sau khi sử dụng thành công, bạn sẽ nhận được link GitHub</li>
                  <li>• Lưu lại link GitHub vì bạn có thể không tìm lại được</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-600">
              <Gift className="h-5 w-5" />
              Sử dụng mã thành công!
            </DialogTitle>
            <DialogDescription asChild>
              <div className="space-y-4">
                <p>Bạn đã sử dụng mã <strong>{redeemResult?.code}</strong> thành công!</p>
                
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <p className="font-medium">{redeemResult?.description}</p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(redeemResult?.repo_url, '_blank')}
                      className="w-full"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Mở GitHub Repository
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Link: {redeemResult?.repo_url}
                  </p>
                </div>

                <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                  <p className="text-sm text-yellow-800">
                    <strong>Lưu ý:</strong> Vui lòng lưu lại link GitHub này. 
                    Bạn có thể không tìm lại được sau khi đóng hộp thoại này.
                  </p>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                navigator.clipboard.writeText(redeemResult?.repo_url || '');
                toast.success('Đã sao chép link vào clipboard');
              }}
            >
              Sao chép link
            </Button>
            <Button onClick={() => setShowSuccessDialog(false)}>
              Đóng
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
