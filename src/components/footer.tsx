import React from "react";
import { Facebook, Twitter, Instagram } from "lucide-react";
import { Link } from "react-router-dom";
import { MainRoutes } from "@/lib/helpers";

interface FooterLinkProps {
  to: string;
  children: React.ReactNode;
}

const FooterLink: React.FC<FooterLinkProps> = ({ to, children }) => (
  <li>
    <Link
      to={to}
      className="hover:underline text-gray-300 hover:text-gray-100 transition"
    >
      {children}
    </Link>
  </li>
);

interface SocialLinkProps {
  href: string;
  icon: React.ReactNode;
  hoverColor: string;
}

const SocialLink: React.FC<SocialLinkProps> = ({ href, icon, hoverColor }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={`text-gray-300 hover:${hoverColor} transition`}
  >
    {icon}
  </a>
);

export const Footer = () => {
  return (
    <footer className="w-full bg-black p-6 text-gray-300">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Quick Links */}
        <div>
          <h3 className="font-bold mb-4 text-lg">Quick Links</h3>
          <ul className="space-y-2">
            {MainRoutes.map((route) => (
              <FooterLink key={route.to} to={route.to}>
                {route.label}
              </FooterLink>
            ))}
          </ul>
        </div>

        {/* About Us */}
        <div>
          <h3 className="font-bold mb-4 text-lg">About Us</h3>
          <p className="text-sm leading-relaxed">
            We help you unlock your full potential with AI-powered tools to
            improve your interview skills and boost your career.
          </p>
        </div>

        {/* Services */}
        <div>
          <h3 className="font-bold mb-4 text-lg">Services</h3>
          <ul className="space-y-2 text-sm">
            <FooterLink to="/services/interview-prep">
              Interview Preparation
            </FooterLink>
            <FooterLink to="/services/career-coaching">
              Career Coaching
            </FooterLink>
            <FooterLink to="/services/resume-building">Resume Building</FooterLink>
          </ul>
        </div>

        {/* Contact + Social */}
        <div>
          <h3 className="font-bold mb-4 text-lg">Contact Us</h3>
          <address className="not-italic mb-4 text-sm">
            123 AI Street, Tech City, 12345
          </address>
          <div className="flex gap-4">
            <SocialLink
              href="https://facebook.com"
              icon={<Facebook size={24} />}
              hoverColor="text-blue-600"
            />
            <SocialLink
              href="https://twitter.com"
              icon={<Twitter size={24} />}
              hoverColor="text-blue-400"
            />
            <SocialLink
              href="https://instagram.com"
              icon={<Instagram size={24} />}
              hoverColor="text-pink-500"
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
