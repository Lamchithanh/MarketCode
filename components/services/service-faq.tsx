"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    id: "1",
    question: "Thời gian hoàn thành một dự án thường là bao lâu?",
    answer: "Thời gian hoàn thành phụ thuộc vào quy mô và độ phức tạp của dự án. Dự án đơn giản có thể hoàn thành trong 1-2 tuần, trong khi dự án phức tạp có thể mất 6-12 tuần. Chúng tôi sẽ cung cấp timeline chi tiết trong giai đoạn tư vấn."
  },
  {
    id: "2",
    question: "Tôi có thể theo dõi tiến độ dự án như thế nào?",
    answer: "Chúng tôi sử dụng các công cụ quản lý dự án như Trello, Asana hoặc Jira để cập nhật tiến độ hàng tuần. Bạn sẽ nhận được báo cáo tiến độ định kỳ và có thể truy cập trực tiếp vào hệ thống để theo dõi."
  },
  {
    id: "3",
    question: "Chính sách bảo hành và hỗ trợ sau khi hoàn thành dự án?",
    answer: "Chúng tôi cung cấp bảo hành miễn phí 3-6 tháng cho tất cả dự án, bao gồm sửa lỗi, hỗ trợ kỹ thuật cơ bản. Sau thời gian bảo hành, bạn có thể đăng ký gói bảo trì để tiếp tục nhận hỗ trợ."
  },
  {
    id: "4",
    question: "Tôi cần chuẩn bị những gì trước khi bắt đầu dự án?",
    answer: "Bạn cần chuẩn bị: mô tả chi tiết về yêu cầu, tài liệu tham khảo (nếu có), domain và hosting, tài khoản các dịch vụ cần tích hợp. Chúng tôi sẽ hỗ trợ bạn trong quá trình chuẩn bị nếu cần."
  },
  {
    id: "5",
    question: "Giá dịch vụ được tính như thế nào?",
    answer: "Giá được tính dựa trên độ phức tạp, thời gian phát triển, công nghệ sử dụng và các yêu cầu đặc biệt. Chúng tôi cung cấp báo giá chi tiết và minh bạch sau khi phân tích yêu cầu."
  },
  {
    id: "6",
    question: "Có thể thay đổi yêu cầu trong quá trình phát triển không?",
    answer: "Có, chúng tôi hiểu rằng yêu cầu có thể thay đổi. Tuy nhiên, việc thay đổi lớn có thể ảnh hưởng đến timeline và chi phí. Chúng tôi sẽ thảo luận và cập nhật kế hoạch phù hợp."
  },
  {
    id: "7",
    question: "Tôi có sở hữu hoàn toàn source code không?",
    answer: "Có, sau khi hoàn thành thanh toán, bạn sẽ sở hữu hoàn toàn source code và tất cả tài liệu kỹ thuật. Chúng tôi cũng cung cấp hướng dẫn chi tiết để bạn có thể tự duy trì."
  },
  {
    id: "8",
    question: "Có làm việc với khách hàng ở nước ngoài không?",
    answer: "Có, chúng tôi có kinh nghiệm làm việc với khách hàng quốc tế. Chúng tôi có thể giao tiếp bằng tiếng Anh và điều chỉnh giờ làm việc phù hợp với múi giờ của bạn."
  }
];

export function ServiceFAQ() {
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-accent/5">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Câu hỏi thường gặp
          </h2>
          <p className="text-xl text-muted-foreground">
            Tìm hiểu thêm về dịch vụ và quy trình làm việc của chúng tôi
          </p>
        </div>

                 <div className="space-y-4">
           {faqs.map((faq) => (
             <div key={faq.id} className="bg-card rounded-lg shadow-sm border">
               <button
                 onClick={() => toggleItem(faq.id)}
                 className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-accent/5 transition-colors"
               >
                 <span className="font-semibold text-card-foreground">{faq.question}</span>
                 {openItems.includes(faq.id) ? (
                   <ChevronUp className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                 ) : (
                   <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                 )}
               </button>
               
               {openItems.includes(faq.id) && (
                 <div className="px-6 pb-4">
                   <div className="border-t pt-4">
                     <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                   </div>
                 </div>
               )}
             </div>
           ))}
         </div>

                 <div className="mt-16 text-center">
           <div className="bg-card rounded-lg p-8 shadow-lg border">
             <h3 className="text-2xl font-bold text-card-foreground mb-4">
               Vẫn còn thắc mắc?
             </h3>
             <p className="text-muted-foreground mb-6">
               Đừng ngần ngại liên hệ với chúng tôi để được tư vấn chi tiết và miễn phí
             </p>
             <div className="flex flex-col sm:flex-row gap-4 justify-center">
               <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-lg font-medium transition-colors">
                 Liên hệ ngay
               </button>
               <button className="border border-primary text-primary hover:bg-primary/10 px-8 py-3 rounded-lg font-medium transition-colors">
                 Đặt lịch tư vấn
               </button>
             </div>
           </div>
         </div>
      </div>
    </section>
  );
} 