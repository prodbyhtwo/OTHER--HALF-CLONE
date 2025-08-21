import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function DesignSystem() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-ds-white">
      {/* Header */}
      <div className="bg-greyscale-900 text-ds-white p-20 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-greyscale-800 rounded-16 transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="heading-1 flex-1">Design System</h1>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/typography-showcase')}
            className="bg-secondary-900 hover:bg-secondary-800 text-white px-6 py-3 rounded-24 font-semibold transition-colors"
          >
            Typography Guide
          </button>
          <button
            onClick={() => navigate('/design-system-demo')}
            className="bg-primary-900 hover:bg-primary-800 text-white px-6 py-3 rounded-24 font-semibold transition-colors"
          >
            View Examples
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-20 space-y-20">
        {/* Colors Section */}
        <section>
          {/* Main Colors */}
          <div className="mb-20">
            <h2 className="heading-2 mb-10">Main</h2>
            <div className="grid grid-cols-2 gap-10">
              {/* Primary */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold">Primary</h3>
                  <span className="text-greyscale-500">#9610FF</span>
                </div>
                <div className="space-y-0">
                  <div className="h-40 bg-primary-900 rounded-t-32"></div>
                  <div className="flex">
                    <div className="h-20 flex-1 bg-primary-900 rounded-bl-32"></div>
                    <div className="h-20 flex-1 bg-primary-800"></div>
                    <div className="h-20 flex-1 bg-primary-700"></div>
                    <div className="h-20 flex-1 bg-primary-600"></div>
                    <div className="h-20 flex-1 bg-primary-500"></div>
                    <div className="h-20 flex-1 bg-primary-400"></div>
                    <div className="h-20 flex-1 bg-primary-300"></div>
                    <div className="h-20 flex-1 bg-primary-200"></div>
                    <div className="h-20 flex-1 bg-primary-100"></div>
                    <div className="h-20 flex-1 bg-primary-50 rounded-br-32"></div>
                  </div>
                </div>
              </div>

              {/* Secondary */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold">Secondary</h3>
                  <span className="text-greyscale-500">#6A5ACD</span>
                </div>
                <div className="space-y-0">
                  <div className="h-40 bg-secondary-900 rounded-t-32"></div>
                  <div className="flex">
                    <div className="h-20 flex-1 bg-secondary-900 rounded-bl-32"></div>
                    <div className="h-20 flex-1 bg-secondary-800"></div>
                    <div className="h-20 flex-1 bg-secondary-700"></div>
                    <div className="h-20 flex-1 bg-secondary-600"></div>
                    <div className="h-20 flex-1 bg-secondary-500"></div>
                    <div className="h-20 flex-1 bg-secondary-400"></div>
                    <div className="h-20 flex-1 bg-secondary-300"></div>
                    <div className="h-20 flex-1 bg-secondary-200"></div>
                    <div className="h-20 flex-1 bg-secondary-100"></div>
                    <div className="h-20 flex-1 bg-secondary-50 rounded-br-32"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-greyscale-200 mb-20"></div>

          {/* Alert & Status */}
          <div className="mb-20">
            <h2 className="heading-2 mb-15">Alert & Status</h2>
            <div className="grid grid-cols-4 gap-10">
              {[
                { name: 'Info', color: 'alert-info', hex: '#9610FF' },
                { name: 'Success', color: 'alert-success', hex: '#12D18E' },
                { name: 'Warning', color: 'alert-warning', hex: '#FACC15' },
                { name: 'Error', color: 'alert-error', hex: '#F75555' },
                { name: 'Light Dis.', color: 'alert-light-disabled', hex: '#D8D8D8' },
                { name: 'Dark Dis.', color: 'alert-dark-disabled', hex: '#23252B' },
                { name: 'Dis. Button', color: 'alert-button-disabled', hex: '#780DCC' },
              ].slice(0, 4).map((item) => (
                <div key={item.name} className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold">{item.name}</h3>
                    <span className="text-greyscale-600 text-sm">{item.hex}</span>
                  </div>
                  <div className={`h-35 rounded-32 rounded-tl-0 bg-[var(--${item.color})]`}></div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-4 gap-10 mt-10">
              {[
                { name: 'Light Dis.', color: 'alert-light-disabled', hex: '#D8D8D8' },
                { name: 'Dark Dis.', color: 'alert-dark-disabled', hex: '#23252B' },
                { name: 'Dis. Button', color: 'alert-button-disabled', hex: '#780DCC' },
              ].map((item) => (
                <div key={item.name} className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold">{item.name}</h3>
                    <span className="text-greyscale-600 text-sm">{item.hex}</span>
                  </div>
                  <div className={`h-35 rounded-32 rounded-tl-0 bg-[var(--${item.color})]`}></div>
                </div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-greyscale-200 mb-20"></div>

          {/* Greyscale */}
          <div className="mb-20">
            <h2 className="heading-2 mb-15">Greyscale</h2>
            <div className="space-y-12">
              <div className="grid grid-cols-5 gap-10">
                {[
                  { name: '900', color: 'greyscale-900', hex: '#212121' },
                  { name: '800', color: 'greyscale-800', hex: '#424242' },
                  { name: '700', color: 'greyscale-700', hex: '#616161' },
                  { name: '600', color: 'greyscale-600', hex: '#757575' },
                  { name: '500', color: 'greyscale-500', hex: '#9E9E9E' },
                ].map((item) => (
                  <div key={item.name} className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-bold">{item.name}</h3>
                      <span className="text-greyscale-600 text-sm">{item.hex}</span>
                    </div>
                    <div className={`h-35 rounded-32 rounded-tl-0 bg-[var(--${item.color})]`}></div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-5 gap-10">
                {[
                  { name: '400', color: 'greyscale-400', hex: '#BDBDBD' },
                  { name: '300', color: 'greyscale-300', hex: '#E0E0E0' },
                  { name: '200', color: 'greyscale-200', hex: '#EEEEEE' },
                  { name: '100', color: 'greyscale-100', hex: '#F5F5F5' },
                  { name: '50', color: 'greyscale-50', hex: '#FAFAFA' },
                ].map((item) => (
                  <div key={item.name} className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-bold">{item.name}</h3>
                      <span className="text-greyscale-600 text-sm">{item.hex}</span>
                    </div>
                    <div className={`h-35 rounded-32 rounded-tl-0 bg-[var(--${item.color})]`}></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-greyscale-200 mb-20"></div>

          {/* Gradients */}
          <div className="mb-20">
            <h2 className="heading-2 mb-15">Gradients</h2>
            <div className="grid grid-cols-4 gap-10">
              {[
                { name: 'Gradient Purple', bg: 'bg-gradient-purple' },
                { name: 'Gradient Green', bg: 'bg-gradient-green' },
                { name: 'Gradient Blue', bg: 'bg-gradient-blue' },
                { name: 'Gradient Red', bg: 'bg-gradient-red' },
                { name: 'Gradient Teal', bg: 'bg-gradient-teal' },
                { name: 'Gradient Brown', bg: 'bg-gradient-brown' },
                { name: 'Gradient Yellow', bg: 'bg-gradient-yellow' },
                { name: 'Gradient Orange', bg: 'bg-gradient-orange' },
              ].map((item) => (
                <div key={item.name} className="space-y-4">
                  <h3 className="text-lg font-bold">{item.name}</h3>
                  <div className={`h-35 rounded-32 rounded-tl-0 ${item.bg}`}></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Typography Section */}
        <section>
          <h2 className="heading-2 mb-15">Typography Systems</h2>
          
          {/* Typography 1 - Urbanist */}
          <div className="mb-20">
            <h3 className="heading-3 mb-15">Typography 1 - Urbanist</h3>
            <div className="grid grid-cols-4 gap-10">
              {[
                { weight: 'Bold', sample: 'Aa', class: 'font-bold' },
                { weight: 'Semibold', sample: 'Aa', class: 'font-semibold' },
                { weight: 'Medium', sample: 'Aa', class: 'font-medium' },
                { weight: 'Regular', sample: 'Aa', class: 'font-normal' },
              ].map((font) => (
                <div key={font.weight} className="card-elevated p-7 space-y-3">
                  <div className="flex items-center gap-5">
                    <div className="w-23 h-23 bg-ds-white rounded-16 flex items-center justify-center shadow-elevation-1">
                      <span className={`text-5xl ${font.class} font-urbanist`}>{font.sample}</span>
                    </div>
                    <div>
                      <div className="text-lg font-bold">Urbanist</div>
                      <div className="text-greyscale-400 text-sm">{font.weight}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Typography 2 - Playfair Display */}
          <div className="mb-20">
            <h3 className="heading-3 mb-15">Typography 2 - Playfair Display</h3>
            <div className="grid grid-cols-4 gap-10">
              {[
                { weight: 'Bold', sample: 'Aa', class: 'font-bold' },
                { weight: 'Semibold', sample: 'Aa', class: 'font-semibold' },
                { weight: 'Medium', sample: 'Aa', class: 'font-medium' },
                { weight: 'Regular', sample: 'Aa', class: 'font-normal' },
              ].map((font) => (
                <div key={font.weight} className="card-elevated p-7 space-y-3">
                  <div className="flex items-center gap-5">
                    <div className="w-23 h-23 bg-ds-white rounded-16 flex items-center justify-center shadow-elevation-1">
                      <span className={`text-5xl ${font.class} font-playfair`}>{font.sample}</span>
                    </div>
                    <div>
                      <div className="text-lg font-bold font-playfair">Playfair Display</div>
                      <div className="text-greyscale-400 text-sm">{font.weight}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Typography 3 - Roboto Flex */}
          <div className="mb-20">
            <h3 className="heading-3 mb-15">Typography 3 - Roboto Flex</h3>
            <div className="grid grid-cols-4 gap-10">
              {[
                { weight: 'Bold', sample: 'Aa', class: 'font-bold' },
                { weight: 'Semibold', sample: 'Aa', class: 'font-semibold' },
                { weight: 'Medium', sample: 'Aa', class: 'font-medium' },
                { weight: 'Regular', sample: 'Aa', class: 'font-normal' },
              ].map((font) => (
                <div key={font.weight} className="card-elevated p-7 space-y-3">
                  <div className="flex items-center gap-5">
                    <div className="w-23 h-23 bg-ds-white rounded-16 flex items-center justify-center shadow-elevation-1">
                      <span className={`text-5xl ${font.class} font-roboto-flex`}>{font.sample}</span>
                    </div>
                    <div>
                      <div className="text-lg font-bold font-roboto-flex">Roboto Flex</div>
                      <div className="text-greyscale-400 text-sm">{font.weight}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-greyscale-200 mb-15"></div>

          {/* Headings - Urbanist */}
          <div className="mb-20">
            <h3 className="heading-3 mb-15">Headings - Urbanist</h3>
            <div className="grid grid-cols-6 gap-10">
              {[
                { name: 'Heading 1', class: 'heading-1', size: '48px' },
                { name: 'Heading 2', class: 'heading-2', size: '40px' },
                { name: 'Heading 3', class: 'heading-3', size: '32px' },
                { name: 'Heading 4', class: 'heading-4', size: '24px' },
                { name: 'Heading 5', class: 'heading-5', size: '20px' },
                { name: 'Heading 6', class: 'heading-6', size: '18px' },
              ].map((heading) => (
                <div key={heading.name} className="space-y-4">
                  <div className={heading.class}>{heading.name}</div>
                  <div className={`${heading.class} font-semibold`}>{heading.name}</div>
                  <div className={`${heading.class} font-medium`}>{heading.name}</div>
                  <div className={`${heading.class} font-normal`}>{heading.name}</div>
                  <div className="text-greyscale-400 text-sm">{heading.name} / Bold / {heading.size}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Headings - Playfair Display */}
          <div className="mb-20">
            <h3 className="heading-3 mb-15">Headings - Playfair Display</h3>
            <div className="grid grid-cols-6 gap-10">
              {[
                { name: 'Heading 1', class: 'heading-1-playfair', size: '48px' },
                { name: 'Heading 2', class: 'heading-2-playfair', size: '40px' },
                { name: 'Heading 3', class: 'heading-3-playfair', size: '32px' },
                { name: 'Heading 4', class: 'heading-4-playfair', size: '24px' },
                { name: 'Heading 5', class: 'heading-5-playfair', size: '20px' },
                { name: 'Heading 6', class: 'heading-6-playfair', size: '18px' },
              ].map((heading) => (
                <div key={heading.name} className="space-y-4">
                  <div className={heading.class}>{heading.name}</div>
                  <div className={`${heading.class} font-semibold`}>{heading.name}</div>
                  <div className={`${heading.class} font-medium`}>{heading.name}</div>
                  <div className={`${heading.class} font-normal`}>{heading.name}</div>
                  <div className="text-greyscale-400 text-sm">{heading.name} / Bold / {heading.size}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Headings - Roboto Flex */}
          <div className="mb-20">
            <h3 className="heading-3 mb-15">Headings - Roboto Flex</h3>
            <div className="grid grid-cols-6 gap-10">
              {[
                { name: 'Heading 1', class: 'heading-1-roboto', size: '48px' },
                { name: 'Heading 2', class: 'heading-2-roboto', size: '40px' },
                { name: 'Heading 3', class: 'heading-3-roboto', size: '32px' },
                { name: 'Heading 4', class: 'heading-4-roboto', size: '24px' },
                { name: 'Heading 5', class: 'heading-5-roboto', size: '20px' },
                { name: 'Heading 6', class: 'heading-6-roboto', size: '18px' },
              ].map((heading) => (
                <div key={heading.name} className="space-y-4">
                  <div className={heading.class}>{heading.name}</div>
                  <div className={`${heading.class} font-semibold`}>{heading.name}</div>
                  <div className={`${heading.class} font-medium`}>{heading.name}</div>
                  <div className={`${heading.class} font-normal`}>{heading.name}</div>
                  <div className="text-greyscale-400 text-sm">{heading.name} / Bold / {heading.size}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-greyscale-200 mb-15"></div>

          {/* Body Text - Urbanist */}
          <div className="mb-20">
            <h3 className="heading-3 mb-15">Body Text - Urbanist</h3>
            <div className="space-y-12">
              {[
                { name: 'Body XLarge', class: 'body-xlarge', size: '18px' },
                { name: 'Body Large', class: 'body-large', size: '16px' },
                { name: 'Body Medium', class: 'body-medium', size: '14px' },
                { name: 'Body Small', class: 'body-small', size: '12px' },
                { name: 'Body XSmall', class: 'body-xsmall', size: '10px' },
              ].map((body) => (
                <div key={body.name} className="grid grid-cols-4 gap-10">
                  {['font-bold', 'font-semibold', 'font-medium', 'font-normal'].map((weight, index) => (
                    <div key={weight} className="space-y-4">
                      <div className={`${body.class} ${weight}`}>{body.name}</div>
                      <div className={`${body.class} ${weight} text-greyscale-400`}>
                        The quick brown fox jumps over the lazy dog
                      </div>
                      <div className="text-greyscale-400 text-sm">
                        {body.name} / {['Bold', 'Semibold', 'Medium', 'Regular'][index]} / {body.size}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Body Text - Roboto Flex */}
          <div className="mb-15">
            <h3 className="heading-3 mb-15">Body Text - Roboto Flex</h3>
            <div className="space-y-12">
              {[
                { name: 'Body XLarge', class: 'body-xlarge-roboto', size: '18px' },
                { name: 'Body Large', class: 'body-large-roboto', size: '16px' },
                { name: 'Body Medium', class: 'body-medium-roboto', size: '14px' },
                { name: 'Body Small', class: 'body-small-roboto', size: '12px' },
                { name: 'Body XSmall', class: 'body-xsmall-roboto', size: '10px' },
              ].map((body) => (
                <div key={body.name} className="grid grid-cols-4 gap-10">
                  {['font-bold', 'font-semibold', 'font-medium', 'font-normal'].map((weight, index) => (
                    <div key={weight} className="space-y-4">
                      <div className={`${body.class} ${weight}`}>{body.name}</div>
                      <div className={`${body.class} ${weight} text-greyscale-400`}>
                        The quick brown fox jumps over the lazy dog
                      </div>
                      <div className="text-greyscale-400 text-sm">
                        {body.name} / {['Bold', 'Semibold', 'Medium', 'Regular'][index]} / {body.size}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Components Section */}
        <section>
          <h2 className="heading-2 mb-15">Components</h2>
          
          <div className="space-y-10">
            {/* Buttons */}
            <div>
              <h3 className="heading-4 mb-6">Buttons</h3>
              <div className="flex gap-4">
                <button className="btn-primary">Primary Button</button>
                <button className="btn-secondary">Secondary Button</button>
                <button className="btn-outline">Outline Button</button>
              </div>
            </div>

            {/* Cards */}
            <div>
              <h3 className="heading-4 mb-6">Cards</h3>
              <div className="grid grid-cols-3 gap-6">
                <div className="card-elevated p-6">
                  <h4 className="heading-5 mb-3">Elevated Card</h4>
                  <p className="body-medium text-greyscale-600">
                    This is an elevated card with shadow and rounded corners.
                  </p>
                </div>
                <div className="surface-greyscale rounded-24 p-6">
                  <h4 className="heading-5 mb-3">Surface Card</h4>
                  <p className="body-medium text-greyscale-600">
                    This is a surface card with background color.
                  </p>
                </div>
                <div className="bg-bg-purple rounded-24 p-6">
                  <h4 className="heading-5 mb-3">Colored Background</h4>
                  <p className="body-medium text-greyscale-600">
                    This card uses a colored background from the design system.
                  </p>
                </div>
              </div>
            </div>

            {/* Status Indicators */}
            <div>
              <h3 className="heading-4 mb-6">Status Indicators</h3>
              <div className="flex gap-4">
                <div className="status-success px-4 py-2 rounded-16 text-sm font-medium">Success</div>
                <div className="status-error px-4 py-2 rounded-16 text-sm font-medium">Error</div>
                <div className="status-warning px-4 py-2 rounded-16 text-sm font-medium">Warning</div>
                <div className="status-info px-4 py-2 rounded-16 text-sm font-medium">Info</div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
