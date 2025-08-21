import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function TypographyShowcase() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-greyscale-900 text-ds-white p-6 flex items-center gap-3">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-greyscale-800 rounded-24 transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="heading-4 flex-1">Typography Showcase</h1>
      </div>

      {/* Content */}
      <div className="p-6 space-y-12">
        {/* Typography 1 - Urbanist */}
        <section>
          <div className="card-elevated p-6 mb-8">
            <h2 className="heading-3 mb-6">Typography 1 - Urbanist</h2>
            <p className="body-large text-greyscale-600 mb-6">
              Our primary sans-serif font. Modern, clean, and highly readable for UI elements and body text.
            </p>
            
            {/* Font Weights */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { weight: 'Bold', class: 'font-bold' },
                { weight: 'Semibold', class: 'font-semibold' },
                { weight: 'Medium', class: 'font-medium' },
                { weight: 'Regular', class: 'font-normal' },
              ].map((font) => (
                <div key={font.weight} className="bg-greyscale-50 p-4 rounded-16 text-center">
                  <div className={`text-4xl ${font.class} mb-2`}>Aa</div>
                  <div className="body-small text-greyscale-600">{font.weight}</div>
                </div>
              ))}
            </div>

            {/* Headings */}
            <div className="space-y-4 mb-8">
              <h1 className="heading-1">Heading 1 - Primary Headlines</h1>
              <h2 className="heading-2">Heading 2 - Section Titles</h2>
              <h3 className="heading-3">Heading 3 - Subsection Titles</h3>
              <h4 className="heading-4">Heading 4 - Component Titles</h4>
              <h5 className="heading-5">Heading 5 - Small Headers</h5>
              <h6 className="heading-6">Heading 6 - Micro Headers</h6>
            </div>

            {/* Body Text */}
            <div className="space-y-3">
              <p className="body-xlarge">Body XLarge (18px) - For important descriptions and introductory text.</p>
              <p className="body-large">Body Large (16px) - For standard body text and most content.</p>
              <p className="body-medium">Body Medium (14px) - For secondary information and captions.</p>
              <p className="body-small">Body Small (12px) - For labels and minor text elements.</p>
              <p className="body-xsmall">Body XSmall (10px) - For micro copy and fine print.</p>
            </div>
          </div>
        </section>

        {/* Typography 2 - Playfair Display */}
        <section>
          <div className="card-elevated p-6 mb-8">
            <h2 className="heading-3 mb-6">Typography 2 - Playfair Display</h2>
            <p className="body-large text-greyscale-600 mb-6">
              Our elegant serif font. Perfect for headlines, quotes, and special content that needs sophistication.
            </p>
            
            {/* Font Weights */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { weight: 'Bold', class: 'font-bold' },
                { weight: 'Semibold', class: 'font-semibold' },
                { weight: 'Medium', class: 'font-medium' },
                { weight: 'Regular', class: 'font-normal' },
              ].map((font) => (
                <div key={font.weight} className="bg-greyscale-50 p-4 rounded-16 text-center">
                  <div className={`text-4xl ${font.class} font-playfair mb-2`}>Aa</div>
                  <div className="body-small text-greyscale-600">{font.weight}</div>
                </div>
              ))}
            </div>

            {/* Headings */}
            <div className="space-y-4 mb-8">
              <h1 className="heading-1-playfair">Heading 1 - Elegant Headlines</h1>
              <h2 className="heading-2-playfair">Heading 2 - Sophisticated Titles</h2>
              <h3 className="heading-3-playfair">Heading 3 - Classic Subsections</h3>
              <h4 className="heading-4-playfair">Heading 4 - Refined Components</h4>
              <h5 className="heading-5-playfair">Heading 5 - Elegant Small Headers</h5>
              <h6 className="heading-6-playfair">Heading 6 - Graceful Micro Headers</h6>
            </div>

            {/* Body Text Examples */}
            <div className="space-y-3 font-playfair">
              <p className="text-lg">Large Text (18px) - For elegant introductions and important content.</p>
              <p className="text-base">Regular Text (16px) - For sophisticated body content and articles.</p>
              <p className="text-sm">Small Text (14px) - For refined secondary information.</p>
              <p className="text-xs">Extra Small Text (12px) - For elegant labels and details.</p>
            </div>
          </div>
        </section>

        {/* Typography 3 - Roboto Flex */}
        <section>
          <div className="card-elevated p-6 mb-8">
            <h2 className="heading-3 mb-6">Typography 3 - Roboto Flex</h2>
            <p className="body-large text-greyscale-600 mb-6">
              Our variable sans-serif font. Flexible, versatile, and optimized for performance across all devices.
            </p>
            
            {/* Font Weights */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { weight: 'Bold', class: 'font-bold' },
                { weight: 'Semibold', class: 'font-semibold' },
                { weight: 'Medium', class: 'font-medium' },
                { weight: 'Regular', class: 'font-normal' },
              ].map((font) => (
                <div key={font.weight} className="bg-greyscale-50 p-4 rounded-16 text-center">
                  <div className={`text-4xl ${font.class} font-roboto-flex mb-2`}>Aa</div>
                  <div className="body-small text-greyscale-600">{font.weight}</div>
                </div>
              ))}
            </div>

            {/* Headings */}
            <div className="space-y-4 mb-8">
              <h1 className="heading-1-roboto">Heading 1 - Flexible Headlines</h1>
              <h2 className="heading-2-roboto">Heading 2 - Versatile Titles</h2>
              <h3 className="heading-3-roboto">Heading 3 - Adaptive Subsections</h3>
              <h4 className="heading-4-roboto">Heading 4 - Responsive Components</h4>
              <h5 className="heading-5-roboto">Heading 5 - Variable Small Headers</h5>
              <h6 className="heading-6-roboto">Heading 6 - Dynamic Micro Headers</h6>
            </div>

            {/* Body Text */}
            <div className="space-y-3">
              <p className="body-xlarge-roboto">Body XLarge (18px) - For flexible descriptions and adaptive content.</p>
              <p className="body-large-roboto">Body Large (16px) - For versatile body text and responsive design.</p>
              <p className="body-medium-roboto">Body Medium (14px) - For adaptable secondary information.</p>
              <p className="body-small-roboto">Body Small (12px) - For dynamic labels and flexible elements.</p>
              <p className="body-xsmall-roboto">Body XSmall (10px) - For variable micro copy and responsive details.</p>
            </div>
          </div>
        </section>

        {/* Usage Guidelines */}
        <section>
          <div className="card-elevated p-6">
            <h2 className="heading-3 mb-6">When to Use Each Typography</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <h3 className="heading-5 text-primary-900">Urbanist</h3>
                <ul className="body-medium space-y-2 text-greyscale-700">
                  <li>• UI components and interfaces</li>
                  <li>• Body text and descriptions</li>
                  <li>• Navigation and menus</li>
                  <li>• Forms and inputs</li>
                  <li>• Modern, clean designs</li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h3 className="heading-5 text-secondary-900">Playfair Display</h3>
                <ul className="body-medium space-y-2 text-greyscale-700">
                  <li>• Headlines and hero sections</li>
                  <li>• Quotes and testimonials</li>
                  <li>• Premium content</li>
                  <li>• Brand statements</li>
                  <li>• Elegant, sophisticated designs</li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h3 className="heading-5 text-alert-success">Roboto Flex</h3>
                <ul className="body-medium space-y-2 text-greyscale-700">
                  <li>• Variable responsive designs</li>
                  <li>• Performance-critical content</li>
                  <li>• Multi-device applications</li>
                  <li>• Technical documentation</li>
                  <li>• Flexible, adaptive layouts</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
