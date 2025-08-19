import { supabaseServiceRole } from '@/lib/supabase-server';

async function getContactEmail(): Promise<string> {
  try {
    const { data, error } = await supabaseServiceRole
      .from('SystemSetting')
      .select('value')
      .eq('key', 'contact_email')
      .single();

    if (error) {
      console.error('Error fetching contact email:', error);
      return 'thanhlc.dev@gmail.com'; // fallback
    }

    return data?.value || 'thanhlc.dev@gmail.com';
  } catch (error) {
    console.error('Error:', error);
    return 'thanhlc.dev@gmail.com';
  }
}

export async function ServerEmailSupport() {
  const contactEmail = await getContactEmail();
  return <span>{contactEmail}</span>;
}
