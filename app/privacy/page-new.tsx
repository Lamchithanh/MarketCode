import { Metadata } from 'next';
import LegalPageDisplay from '@/components/legal/legal-page-display';

export const metadata: Metadata = {
  title: 'Chính sách bảo mật | MarketCode',
  description: 'Chính sách bảo mật thông tin của MarketCode',
  keywords: 'chính sách, bảo mật, quyền riêng tư, MarketCode'
};

export default function PrivacyPolicyPage() {
  return <LegalPageDisplay type="privacy" />;
}
