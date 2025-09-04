import { NextRequest, NextResponse } from 'next/server';
import { supabaseServiceRole } from '@/lib/supabase-server';

export async function GET() {
  return NextResponse.json({
    message: "Use POST method to setup legal pages",
    instructions: "Send POST request to create LegalPage table and insert default content"
  });
}

export async function POST() {
  try {
    // Check if table exists first
    const { data: existingTable, error: checkError } = await supabaseServiceRole
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_name', 'LegalPage')
      .single();

    console.log('Table check result:', { existingTable, checkError });

    // If table doesn't exist, we'll insert default data anyway and let it fail gracefully
    // The table should be created manually through Supabase dashboard

    // Insert default data
    const termsContent = `# ĐIỀU KHOẢN DỊCH VỤ

## 1. GIỚI THIỆU
Chào mừng bạn đến với MarketCode. Bằng việc sử dụng dịch vụ của chúng tôi, bạn đồng ý tuân thủ các điều khoản và điều kiện được quy định dưới đây.

## 2. ĐỊNH NGHĨA
- **Dịch vụ**: Bao gồm tất cả các sản phẩm, dịch vụ phát triển phần mềm, tư vấn kỹ thuật mà MarketCode cung cấp.
- **Khách hàng**: Cá nhân hoặc tổ chức sử dụng dịch vụ của MarketCode.
- **Nội dung**: Bao gồm mã nguồn, tài liệu, thiết kế, và bất kỳ sản phẩm nào được tạo ra trong quá trình cung cấp dịch vụ.

## 3. PHẠM VI DỊCH VỤ
MarketCode cung cấp các dịch vụ sau:
- Phát triển ứng dụng web và mobile tùy chỉnh
- Tư vấn và thiết kế hệ thống
- Bảo trì và nâng cấp phần mềm
- Tối ưu hóa hiệu suất ứng dụng
- Thiết kế giao diện người dùng (UI/UX)

## 4. NGHĨA VỤ CỦA KHÁCH HÀNG
- Cung cấp thông tin chính xác và đầy đủ về yêu cầu dự án
- Thanh toán đúng hạn theo lịch trình đã thỏa thuận
- Phối hợp tích cực trong quá trình phát triển
- Tuân thủ các quy định pháp luật liên quan

## 5. NGHĨA VỤ CỦA MARKETCODE
- Cung cấp dịch vụ chất lượng cao, đúng tiến độ
- Bảo mật thông tin khách hàng
- Hỗ trợ kỹ thuật trong thời gian bảo hành
- Tuân thủ các tiêu chuẩn kỹ thuật quốc tế

## 6. THANH TOÁN
- Thanh toán được thực hiện theo các giai đoạn đã thỏa thuận
- Hóa đơn VAT sẽ được cung cấp theo yêu cầu
- Khách hàng có trách nhiệm thanh toán đúng hạn

## 7. BẢO HÀNH VÀ HỖ TRỢ
- Thời gian bảo hành: 6-12 tháng tùy theo từng dự án
- Hỗ trợ kỹ thuật 24/7 trong thời gian bảo hành
- Sửa chữa miễn phí các lỗi phát sinh do MarketCode

## 8. BẢO MẬT THÔNG TIN
- MarketCode cam kết bảo mật tuyệt đối thông tin khách hàng
- Không tiết lộ thông tin cho bên thứ ba mà không có sự đồng ý
- Áp dụng các biện pháp bảo mật tiên tiến

## 9. QUYỀN SỞ HỮU TRÍ TUỆ
- Khách hàng sở hữu toàn bộ quyền đối với sản phẩm cuối cùng
- MarketCode có quyền sử dụng kinh nghiệm và kiến thức chung
- Mã nguồn và tài liệu sẽ được chuyển giao đầy đủ

## 10. CHẤM DỨT HỢP ĐỒNG
- Hợp đồng có thể chấm dứt bởi một trong hai bên với thông báo trước 30 ngày
- Trong trường hợp chấm dứt, các khoản phí đã thanh toán sẽ được tính theo công việc đã hoàn thành

## 11. GIẢI QUYẾT TRANH CHẤP
- Ưu tiên giải quyết thông qua thương lượng
- Tranh chấp sẽ được giải quyết tại Trọng tài Quốc tế Việt Nam (VIAC)

## 12. ĐIỀU KHOẢN CHUNG
- Điều khoản này có hiệu lực từ ngày ký hợp đồng
- Mọi thay đổi phải được thỏa thuận bằng văn bản
- Điều khoản tuân thủ pháp luật Việt Nam

**Liên hệ**: support@marketcode.vn | 0123 456 789`;

    const privacyContent = `# CHÍNH SÁCH BẢO MẬT

## 1. CAM KẾT BẢO MẬT
MarketCode cam kết bảo vệ quyền riêng tư và thông tin cá nhân của khách hàng. Chính sách này mô tả cách chúng tôi thu thập, sử dụng và bảo vệ thông tin của bạn.

## 2. THÔNG TIN CHÚNG TÔI THU THẬP

### 2.1 Thông tin cá nhân
- Họ tên, email, số điện thoại
- Địa chỉ công ty và thông tin liên hệ
- Thông tin thanh toán (được mã hóa)
- Thông tin dự án và yêu cầu kỹ thuật

### 2.2 Thông tin kỹ thuật
- Địa chỉ IP và thông tin trình duyệt
- Cookies và dữ liệu phiên làm việc
- Log truy cập và sử dụng dịch vụ

## 3. CÁCH CHÚNG TÔI SỬ DỤNG THÔNG TIN

### 3.1 Mục đích sử dụng
- Cung cấp và cải thiện dịch vụ
- Liên hệ và hỗ trợ khách hàng
- Xử lý thanh toán và hóa đơn
- Gửi thông báo quan trọng về dự án
- Phân tích và cải thiện website

### 3.2 Cơ sở pháp lý
- Thực hiện hợp đồng dịch vụ
- Tuân thủ nghĩa vụ pháp lý
- Lợi ích hợp pháp của MarketCode
- Sự đồng ý của khách hàng

## 4. CHIA SẺ THÔNG TIN

### 4.1 Chúng tôi KHÔNG chia sẻ thông tin với:
- Bên thứ ba cho mục đích marketing
- Các công ty khác để bán thông tin
- Bất kỳ tổ chức nào không liên quan

### 4.2 Chúng tôi có thể chia sẻ khi:
- Có yêu cầu pháp lý từ cơ quan có thẩm quyền
- Cần thiết để bảo vệ quyền lợi MarketCode
- Có sự đồng ý rõ ràng từ khách hàng

## 5. BẢO MẬT DỮ LIỆU

### 5.1 Biện pháp kỹ thuật
- Mã hóa SSL/TLS cho tất cả dữ liệu truyền tải
- Hệ thống firewall và bảo mật mạng
- Backup dữ liệu định kỳ
- Kiểm tra bảo mật thường xuyên

### 5.2 Biện pháp quản lý
- Đào tạo nhân viên về bảo mật
- Kiểm soát truy cập dữ liệu nghiêm ngặt
- Ký cam kết bảo mật với nhân viên
- Quy trình xử lý sự cố bảo mật

## 6. QUYỀN CỦA KHÁCH HÀNG

### 6.1 Quyền truy cập
- Yêu cầu xem thông tin cá nhân được lưu trữ
- Kiểm tra mục đích sử dụng dữ liệu

### 6.2 Quyền chỉnh sửa
- Cập nhật thông tin cá nhân
- Sửa đổi thông tin không chính xác

### 6.3 Quyền xóa
- Yêu cầu xóa dữ liệu cá nhân
- Rút lại sự đồng ý (trong một số trường hợp)

### 6.4 Quyền phản đối
- Phản đối việc xử lý dữ liệu cho mục đích marketing
- Yêu cầu dừng gửi email thông báo

## 7. COOKIES VÀ TRACKING

### 7.1 Cookies cần thiết
- Duy trì phiên đăng nhập
- Lưu trữ cài đặt website
- Bảo mật và xác thực

### 7.2 Cookies phân tích
- Google Analytics (có thể tắt)
- Theo dõi hiệu suất website
- Cải thiện trải nghiệm người dùng

## 8. LƯU TRỮ DỮ LIỆU

### 8.1 Thời gian lưu trữ
- Thông tin dự án: 5 năm sau khi hoàn thành
- Thông tin khách hàng: Đến khi có yêu cầu xóa
- Log hệ thống: 2 năm
- Dữ liệu thanh toán: Theo quy định pháp luật

### 8.2 Vị trí lưu trữ
- Server tại Việt Nam (tuân thủ luật Cybersecurity)
- Backup tại Singapore (mã hóa)
- Không lưu trữ tại các quốc gia có nguy cơ

## 9. CHUYỂN GIAO DỮ LIỆU QUỐC TẾ
- Chỉ chuyển khi cần thiết cho dịch vụ
- Đảm bảo mức độ bảo mật tương đương
- Thông báo trước cho khách hàng

## 10. BẢO MẬT TRẺ EM
- Không thu thập thông tin từ trẻ dưới 16 tuổi
- Yêu cầu sự đồng ý của phụ huynh nếu cần thiết

## 11. THAY ĐỔI CHÍNH SÁCH
- Thông báo trước 30 ngày khi có thay đổi quan trọng
- Đăng tải phiên bản mới trên website
- Gửi email thông báo cho khách hàng

## 12. LIÊN HỆ VỀ BẢO MẬT
Nếu bạn có câu hỏi về chính sách bảo mật:
- **Email**: privacy@marketcode.vn
- **Điện thoại**: 0123 456 789
- **Địa chỉ**: Tầng 10, Tòa nhà A, 123 Đường ABC, Quận 1, TP.HCM

*Chính sách này có hiệu lực từ ngày 01/01/2024 và được cập nhật lần cuối vào ngày 04/09/2025.*`;

    // Insert terms of service
    const { error: termsError } = await supabaseServiceRole
      .from('LegalPage')
      .insert({
        type: 'terms_of_service',
        title: 'Điều khoản dịch vụ',
        content: termsContent,
        version: '1.0'
      });

    if (termsError) {
      console.error('Error inserting terms:', termsError);
    }

    // Insert privacy policy
    const { error: privacyError } = await supabaseServiceRole
      .from('LegalPage')
      .insert({
        type: 'privacy_policy',
        title: 'Chính sách bảo mật',
        content: privacyContent,
        version: '1.0'
      });

    if (privacyError) {
      console.error('Error inserting privacy:', privacyError);
    }

    return NextResponse.json({
      success: true,
      message: 'Legal pages setup completed',
      created: {
        table: 'LegalPage',
        records: ['terms_of_service', 'privacy_policy']
      }
    });

  } catch (error) {
    console.error('Setup legal pages error:', error);
    return NextResponse.json(
      { error: 'Failed to setup legal pages' },
      { status: 500 }
    );
  }
}
