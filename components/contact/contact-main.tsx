import { ContactForm } from "./contact-form";
import { ContactInfo } from "./contact-info";

export function ContactMain() {
  return (
    <section className="py-20">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <ContactForm />
          </div>

          {/* Contact Info */}
          <div>
            <ContactInfo />
          </div>
        </div>
      </div>
    </section>
  );
} 