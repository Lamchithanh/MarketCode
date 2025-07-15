import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Hash password
  const hashedPassword = await bcrypt.hash("@Bc123123", 12);

  // Create admin user
  const adminUser = await prisma.user.upsert({
    where: { email: "haodev1307@gmail.com" },
    update: {},
    create: {
      name: "Admin User",
      email: "haodev1307@gmail.com",
      password: hashedPassword,
      role: "ADMIN",
      isActive: true,
      emailVerified: new Date(),
    },
  });

  console.log("✅ Admin user created:", {
    id: adminUser.id,
    name: adminUser.name,
    email: adminUser.email,
    role: adminUser.role,
  });

  // Create some sample categories
  const categories = [
    {
      name: "Web Development",
      slug: "web-development",
      description: "Mã nguồn và template cho phát triển web",
      icon: "🌐",
    },
    {
      name: "Mobile Apps",
      slug: "mobile-apps",
      description: "Ứng dụng di động và template",
      icon: "📱",
    },
    {
      name: "Desktop Apps",
      slug: "desktop-apps",
      description: "Phần mềm desktop và công cụ",
      icon: "💻",
    },
    {
      name: "UI/UX Design",
      slug: "ui-ux-design",
      description: "Template thiết kế và UI kit",
      icon: "🎨",
    },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
  }

  console.log("✅ Categories created");

  // Create some sample tags
  const tags = [
    { name: "React", slug: "react", color: "#61DAFB" },
    { name: "Next.js", slug: "nextjs", color: "#000000" },
    { name: "TypeScript", slug: "typescript", color: "#3178C6" },
    { name: "JavaScript", slug: "javascript", color: "#F7DF1E" },
    { name: "Node.js", slug: "nodejs", color: "#339933" },
    { name: "PHP", slug: "php", color: "#777BB4" },
    { name: "Python", slug: "python", color: "#3776AB" },
    { name: "Vue.js", slug: "vuejs", color: "#4FC08D" },
    { name: "Angular", slug: "angular", color: "#DD0031" },
    { name: "Laravel", slug: "laravel", color: "#FF2D20" },
  ];

  for (const tag of tags) {
    await prisma.tag.upsert({
      where: { slug: tag.slug },
      update: {},
      create: tag,
    });
  }

  console.log("✅ Tags created");

  // Create some system settings
  const systemSettings = [
    {
      key: "site_name",
      value: "Market Code",
      type: "string",
    },
    {
      key: "site_description",
      value: "Nền tảng mua bán mã nguồn và template",
      type: "string",
    },
    {
      key: "contact_email",
      value: "haodev1307@gmail.com",
      type: "string",
    },
    {
      key: "max_file_size",
      value: "100",
      type: "number",
    },
    {
      key: "commission_rate",
      value: "10",
      type: "number",
    },
  ];

  for (const setting of systemSettings) {
    await prisma.systemSetting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    });
  }

  console.log("✅ System settings created");

  console.log("🎉 Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
