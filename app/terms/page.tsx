import { Metadata } from 'next';
import LegalPageDisplay from '@/components/legal/legal-page-display';

export const metadata: Metadata = {
  title: 'Điều khoản dịch vụ | MarketCode',
  description: 'Điều khoản và điều kiện sử dụng dịch vụ của MarketCode',
  keywords: 'điều khoản, dịch vụ, MarketCode, quy định, chính sách'
};

export default function TermsOfServicePage() {
  return <LegalPageDisplay type="terms" />;
}
