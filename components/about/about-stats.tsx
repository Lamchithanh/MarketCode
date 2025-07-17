export function AboutStats() {
  return (
    <section className="py-20 bg-primary text-primary-foreground">
      <div className="container">
        <div className="grid md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold mb-2">500+</div>
            <p className="text-primary-foreground/80">Dự án hoàn thành</p>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">1,000+</div>
            <p className="text-primary-foreground/80">Khách hàng hài lòng</p>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">24/7</div>
            <p className="text-primary-foreground/80">Hỗ trợ khách hàng</p>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">4.9/5</div>
            <p className="text-primary-foreground/80">Đánh giá trung bình</p>
          </div>
        </div>
      </div>
    </section>
  );
} 