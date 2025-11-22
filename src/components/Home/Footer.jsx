import React from "react";
import { Facebook, Instagram, Linkedin, X } from "lucide-react";
import { Link } from "react-router-dom"; // ✅ Import Link here

const Footer = () => {
  return (
    <footer className="bg-blue-50 text-gray-700 pt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 pb-12 border-b border-blue-100">
          {/* Medilab Info */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">MediTrack</h2>
            <p>Karpagam College of Engineering</p>
            <p>Coimbatore, Tamil Nadu, India, 606001</p>
            <p className="mt-4 font-semibold">
              Phone: <span className="font-normal">‪+91 9999888852‬</span>
            </p>
            <p className="font-semibold">
              Email: <span className="font-normal">meditrackhealthinfo@gmail.com</span>
            </p>

            <div className="flex space-x-4 mt-4">
              <div className="bg-blue-600 p-2 rounded-full hover:bg-blue-700 transition-colors">
                <X className="h-4 w-4 text-white" />
              </div>
              <div className="bg-blue-600 p-2 rounded-full hover:bg-blue-700 transition-colors">
                <Facebook className="h-4 w-4 text-white" />
              </div>
              <div className="bg-blue-600 p-2 rounded-full hover:bg-blue-700 transition-colors">
                <Instagram className="h-4 w-4 text-white" />
              </div>
              <div className="bg-blue-600 p-2 rounded-full hover:bg-blue-700 transition-colors">
                <Linkedin className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>

          {/* Useful Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Useful Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#hero" className="hover:text-blue-600">Home</a>
              </li>
              <li>
                <a href="#about" className="hover:text-blue-600">About us</a>
              </li>
              <li>
                <a href="#services" className="hover:text-blue-600">Services</a>
              </li>
              <li>
                <Link to="/terms" className="hover:text-blue-600">Terms of Service</Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-blue-600">Privacy Policy</Link>
              </li>
            </ul>
          </div>

          {/* Our Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Our Services</h3>
            <ul className="space-y-2">
              <li><a href="/cardiology" className="hover:text-blue-600">Cardiology</a></li>
              <li><a href="/pharmacy" className="hover:text-blue-600">Pharmacy Services</a></li>
              <li><a href="/patient-care" className="hover:text-blue-600">Patient Care</a></li>
              <li><a href="/genetic-testing" className="hover:text-blue-600">Genetic Testing</a></li>
              <li><a href="/rehabilitation" className="hover:text-blue-600">Rehabilitation</a></li>
            </ul>
          </div>

          {/* Major Departments */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Major Departments</h3>
            <ul className="space-y-2">
               <li><a href="#departments" className="hover:text-blue-600">Departments</a></li>
              <li><Link to="/cancer-center" className="hover:text-blue-600">Cancer Center</Link></li>
              <li><Link to="/health-check" className="hover:text-blue-600">Health Check Program</Link></li>
              <li><Link to="/fertility" className="hover:text-blue-600">Fertility and Reproductive Medicine</Link></li>
              <li><Link to="/pediatracks" className="hover:text-blue-600">PediaTracks</Link></li>
            </ul>
          </div>

        {/* Nobis illum */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
             <li>
  <Link to="/Career" className="hover:text-blue-600">
    Career
  </Link>
</li>
              <li>
                <Link to="/feedback" className="hover:text-blue-600">
                  Feedback
                </Link>
              </li>
              <li>
                <a href="/Insurance" className="hover:text-blue-600">
                  Insurance
                </a>
              </li>
              <li>
                <a href="/environmental-forms" className="hover:text-blue-600">
                  Environmental forms
                </a>
              </li>
              <li>
                <a href="/newsletter" className="hover:text-blue-600">
                  NewsLetter
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="py-6 flex flex-col lg:flex-row justify-between items-center text-sm text-gray-500">
          <p>
            © Copyright <span className="font-bold text-gray-700">MediTrack and Team</span>. All Rights Reserved
          </p>
          <p>
            Designed by{" "}
            <a href="https://bootstrapmade.com/" className="text-blue-600 hover:underline">Medi Track </a> &nbsp;| Distributed by{" "}
            <a href="https://themewagon.com/" className="text-blue-600 hover:underline">Kceian</a>
          </p>
        </div>
      </div>

      {/* Scroll to top */}
      <div className="fixed bottom-6 right-6">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="bg-blue-600 text-white p-3 rounded-md shadow hover:bg-blue-700 transition"
        >
          ↑
        </button>
      </div>
    </footer>
  );
};

export default Footer;