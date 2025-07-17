import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function AboutTeam() {
  return (
    <section className="py-20">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Đội ngũ của chúng tôi</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Những người tài năng đằng sau sự thành công của CodeMarket
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <Avatar className="w-24 h-24 mx-auto mb-4">
                <AvatarImage src="/team/ceo.jpg" alt="CEO" />
                <AvatarFallback className="text-lg font-bold bg-primary text-primary-foreground">
                  NV
                </AvatarFallback>
              </Avatar>
              <h3 className="font-bold text-lg mb-2">Nguyễn Văn A</h3>
              <p className="text-primary font-medium mb-2">CEO & Founder</p>
              <p className="text-muted-foreground text-sm">
                7+ năm kinh nghiệm trong phát triển web và quản lý sản phẩm
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <Avatar className="w-24 h-24 mx-auto mb-4">
                <AvatarImage src="/team/cto.jpg" alt="CTO" />
                <AvatarFallback className="text-lg font-bold bg-primary text-primary-foreground">
                  TT
                </AvatarFallback>
              </Avatar>
              <h3 className="font-bold text-lg mb-2">Trần Thị B</h3>
              <p className="text-primary font-medium mb-2">CTO & Co-Founder</p>
              <p className="text-muted-foreground text-sm">
                Senior React Developer với 6+ năm kinh nghiệm về React/NextJS
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <Avatar className="w-24 h-24 mx-auto mb-4">
                <AvatarImage src="/team/lead.jpg" alt="Lead Developer" />
                <AvatarFallback className="text-lg font-bold bg-primary text-primary-foreground">
                  LV
                </AvatarFallback>
              </Avatar>
              <h3 className="font-bold text-lg mb-2">Lê Văn C</h3>
              <p className="text-primary font-medium mb-2">Lead Developer</p>
              <p className="text-muted-foreground text-sm">
                Chuyên gia về Full-stack development và system architecture
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
} 