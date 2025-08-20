import { GitCodeRedeemer } from '@/components/gitcode/gitcode-redeemer';

export default function GitCodePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <GitCodeRedeemer />
      </div>
    </div>
  );
}
