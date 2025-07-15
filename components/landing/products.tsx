import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Download, Eye, ShoppingCart } from "lucide-react";
import { Project } from "@/types";

const products: Project[] = [
  {
    id: "1",
    title: "E-commerce Website Complete",
    description:
      "Website bán hàng hoàn chỉnh với React, NextJS, Prisma, Stripe payment integration",
    image: "/products/ecommerce.jpg",
    technologies: ["React", "NextJS", "Prisma", "Stripe", "Tailwind"],
    category: "E-commerce",
    price: "499,000đ",
    rating: 4.8,
    reviews: 156,
  },
  {
    id: "2",
    title: "Social Media App",
    description:
      "Ứng dụng mạng xã hội với real-time chat, posts, comments, likes và user profiles",
    image: "/products/social.jpg",
    technologies: ["React", "NextJS", "Socket.io", "MongoDB", "Cloudinary"],
    category: "Social Media",
    price: "799,000đ",
    rating: 4.9,
    reviews: 89,
  },
  {
    id: "3",
    title: "Learning Management System",
    description:
      "Hệ thống quản lý học tập với video streaming, assignments, grading và certificates",
    image: "/products/lms.jpg",
    technologies: ["React", "NextJS", "Prisma", "AWS S3", "Stripe"],
    category: "Education",
    price: "1,299,000đ",
    rating: 4.7,
    reviews: 67,
  },
  {
    id: "4",
    title: "Task Management App",
    description:
      "Ứng dụng quản lý công việc kiểu Trello với drag & drop, team collaboration",
    image: "/products/task.jpg",
    technologies: ["React", "NextJS", "DnD Kit", "Prisma", "WebSocket"],
    category: "Productivity",
    price: "599,000đ",
    rating: 4.6,
    reviews: 124,
  },
  {
    id: "5",
    title: "Blog CMS Platform",
    description:
      "Hệ thống quản lý blog với rich text editor, SEO optimization, multi-author",
    image: "/products/blog.jpg",
    technologies: ["React", "NextJS", "MDX", "Prisma", "Vercel"],
    category: "CMS",
    price: "399,000đ",
    rating: 4.5,
    reviews: 203,
  },
  {
    id: "6",
    title: "Real Estate Platform",
    description:
      "Nền tảng bất động sản với tìm kiếm, bộ lọc, map integration, virtual tours",
    image: "/products/realestate.jpg",
    technologies: ["React", "NextJS", "Google Maps", "Prisma", "Cloudinary"],
    category: "Real Estate",
    price: "999,000đ",
    rating: 4.8,
    reviews: 45,
  },
];

const renderStars = (rating: number) => {
  return Array.from({ length: 5 }, (_, i) => (
    <Star
      key={i}
      className={`h-4 w-4 ${
        i < Math.floor(rating)
          ? "fill-yellow-400 text-yellow-400"
          : "text-gray-300"
      }`}
    />
  ));
};

export function Products() {
  return (
    <section className="py-24">
      <div className="container">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            Source Code chất lượng cao
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Danh sách sản phẩm
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Khám phá bộ sưu tập source code React/NextJS được xây dựng chuyên
            nghiệp, sẵn sàng sử dụng cho dự án của bạn
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <Card
              key={product.id}
              className="group hover:shadow-lg transition-all duration-300 overflow-hidden"
            >
              <div className="relative">
                <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                  <div className="text-4xl font-bold text-primary/20">
                    {product.title.split(" ")[0]}
                  </div>
                </div>
                <Badge
                  variant="secondary"
                  className="absolute top-3 left-3 bg-background/80 backdrop-blur-sm"
                >
                  {product.category}
                </Badge>
                <div className="absolute top-3 right-3 flex items-center space-x-1 bg-background/80 backdrop-blur-sm rounded-full px-2 py-1">
                  <Eye className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {product.reviews}
                  </span>
                </div>
              </div>

              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-lg leading-tight line-clamp-2">
                    {product.title}
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                  {product.description}
                </p>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="flex flex-wrap gap-1 mb-4">
                  {product.technologies.slice(0, 3).map((tech) => (
                    <Badge key={tech} variant="outline" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                  {product.technologies.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{product.technologies.length - 3}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex items-center space-x-1">
                    {renderStars(product.rating)}
                  </div>
                  <span className="text-sm font-medium">{product.rating}</span>
                  <span className="text-xs text-muted-foreground">
                    ({product.reviews} đánh giá)
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-primary">
                    {product.price}
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="sm">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Mua ngay
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View More Button */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            <Download className="mr-2 h-4 w-4" />
            Xem thêm sản phẩm
          </Button>
        </div>

        {/* Categories Filter */}
        <div className="mt-16 text-center">
          <h3 className="text-xl font-semibold mb-6">Danh mục sản phẩm</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              "Tất cả",
              "E-commerce",
              "Social Media",
              "Education",
              "Productivity",
              "CMS",
              "Real Estate",
            ].map((category) => (
              <Button
                key={category}
                variant={category === "Tất cả" ? "default" : "outline"}
                size="sm"
                className="rounded-full"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
