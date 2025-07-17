import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ContactFAQ() {
  return (
    <section className="py-20 bg-muted/50">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Câu hỏi thường gặp</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Những câu hỏi thường gặp về dịch vụ và sản phẩm của chúng tôi
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">Làm thế nào để đặt hàng?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Bạn có thể đặt hàng trực tiếp trên website hoặc liên hệ với chúng tôi qua email/điện thoại để được tư vấn chi tiết.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">Thời gian giao hàng?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Source code sẽ được giao ngay sau khi thanh toán. Dịch vụ custom sẽ có thời gian từ 1-4 tuần tùy độ phức tạp.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">Có hỗ trợ sau bán hàng?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Chúng tôi cung cấp hỗ trợ kỹ thuật 24/7 và bảo hành 6 tháng cho tất cả sản phẩm.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">Có thể tùy chỉnh sản phẩm?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Có, chúng tôi cung cấp dịch vụ tùy chỉnh theo yêu cầu. Liên hệ để được báo giá chi tiết.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
} 