import React, { useState } from 'react';
import { ArrowLeft, Heart, Star, Settings, Search, Filter, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function DesignSystemDemo() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('colors');

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary-900 text-ds-white p-6 flex items-center gap-3">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-primary-800 rounded-24 transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="heading-4 flex-1">Design System in Action</h1>
      </div>

      {/* Tab Navigation */}
      <div className="bg-ds-white border-b border-greyscale-200">
        <div className="px-6 py-4">
          <div className="flex space-x-6">
            {[
              { id: 'colors', label: 'Colors' },
              { id: 'typography', label: 'Typography' },
              { id: 'components', label: 'Components' },
              { id: 'examples', label: 'Real Examples' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`body-medium font-semibold pb-2 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-900 text-primary-900'
                    : 'border-transparent text-greyscale-600 hover:text-greyscale-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'colors' && (
          <div className="space-y-8">
            <div>
              <h2 className="heading-5 mb-4">Primary Color Usage</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="card-elevated p-4">
                  <div className="w-full h-12 bg-primary-900 rounded-16 mb-3"></div>
                  <p className="body-small text-greyscale-600">Primary 900 - Main actions</p>
                </div>
                <div className="card-elevated p-4">
                  <div className="w-full h-12 bg-primary-700 rounded-16 mb-3"></div>
                  <p className="body-small text-greyscale-600">Primary 700 - Hover states</p>
                </div>
                <div className="card-elevated p-4">
                  <div className="w-full h-12 bg-primary-50 rounded-16 mb-3"></div>
                  <p className="body-small text-greyscale-600">Primary 50 - Light backgrounds</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="heading-5 mb-4">Status Colors</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="status-success p-4 rounded-16 text-center">
                  <p className="body-medium font-semibold">Success</p>
                </div>
                <div className="status-error p-4 rounded-16 text-center">
                  <p className="body-medium font-semibold">Error</p>
                </div>
                <div className="status-warning p-4 rounded-16 text-center">
                  <p className="body-medium font-semibold">Warning</p>
                </div>
                <div className="status-info p-4 rounded-16 text-center">
                  <p className="body-medium font-semibold">Info</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'typography' && (
          <div className="space-y-8">
            <div>
              <h2 className="heading-5 mb-4">Typography Systems</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Urbanist */}
                <div className="space-y-4">
                  <h3 className="heading-6 mb-3">Urbanist (Primary)</h3>
                  <h1 className="heading-1">Heading 1</h1>
                  <h2 className="heading-2">Heading 2</h2>
                  <h3 className="heading-3">Heading 3</h3>
                  <p className="body-large">This is body text in Urbanist, our primary sans-serif font.</p>
                </div>

                {/* Playfair Display */}
                <div className="space-y-4">
                  <h3 className="heading-6 mb-3">Playfair Display (Serif)</h3>
                  <h1 className="heading-1-playfair">Heading 1</h1>
                  <h2 className="heading-2-playfair">Heading 2</h2>
                  <h3 className="heading-3-playfair">Heading 3</h3>
                  <p className="body-large font-playfair">This is body text in Playfair Display, our elegant serif font.</p>
                </div>

                {/* Roboto Flex */}
                <div className="space-y-4">
                  <h3 className="heading-6 mb-3">Roboto Flex (Flexible)</h3>
                  <h1 className="heading-1-roboto">Heading 1</h1>
                  <h2 className="heading-2-roboto">Heading 2</h2>
                  <h3 className="heading-3-roboto">Heading 3</h3>
                  <p className="body-large-roboto">This is body text in Roboto Flex, our variable sans-serif font.</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="heading-5 mb-4">Body Text Comparison</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="heading-6 mb-3">Urbanist</h4>
                  <div className="space-y-2">
                    <p className="body-xlarge">Extra Large - 18px</p>
                    <p className="body-large">Large - 16px</p>
                    <p className="body-medium">Medium - 14px</p>
                    <p className="body-small">Small - 12px</p>
                    <p className="body-xsmall">Extra Small - 10px</p>
                  </div>
                </div>
                <div>
                  <h4 className="heading-6 mb-3 font-playfair">Playfair Display</h4>
                  <div className="space-y-2 font-playfair">
                    <p className="text-lg">Extra Large - 18px</p>
                    <p className="text-base">Large - 16px</p>
                    <p className="text-sm">Medium - 14px</p>
                    <p className="text-xs">Small - 12px</p>
                    <p className="text-[10px]">Extra Small - 10px</p>
                  </div>
                </div>
                <div>
                  <h4 className="heading-6 mb-3 font-roboto-flex">Roboto Flex</h4>
                  <div className="space-y-2">
                    <p className="body-xlarge-roboto">Extra Large - 18px</p>
                    <p className="body-large-roboto">Large - 16px</p>
                    <p className="body-medium-roboto">Medium - 14px</p>
                    <p className="body-small-roboto">Small - 12px</p>
                    <p className="body-xsmall-roboto">Extra Small - 10px</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="heading-5 mb-4">Font Weight Examples</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="heading-6 mb-3">Urbanist</h4>
                  <div className="space-y-2">
                    <p className="body-large font-bold">Bold (700)</p>
                    <p className="body-large font-semibold">Semibold (600)</p>
                    <p className="body-large font-medium">Medium (500)</p>
                    <p className="body-large font-normal">Regular (400)</p>
                  </div>
                </div>
                <div>
                  <h4 className="heading-6 mb-3 font-playfair">Playfair Display</h4>
                  <div className="space-y-2 font-playfair">
                    <p className="text-base font-bold">Bold (700)</p>
                    <p className="text-base font-semibold">Semibold (600)</p>
                    <p className="text-base font-medium">Medium (500)</p>
                    <p className="text-base font-normal">Regular (400)</p>
                  </div>
                </div>
                <div>
                  <h4 className="heading-6 mb-3 font-roboto-flex">Roboto Flex</h4>
                  <div className="space-y-2 font-roboto-flex">
                    <p className="text-base font-bold">Bold (700)</p>
                    <p className="text-base font-semibold">Semibold (600)</p>
                    <p className="text-base font-medium">Medium (500)</p>
                    <p className="text-base font-normal">Regular (400)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'components' && (
          <div className="space-y-8">
            <div>
              <h2 className="heading-5 mb-4">Buttons</h2>
              <div className="flex flex-wrap gap-4">
                <button className="btn-primary">Primary Button</button>
                <button className="btn-secondary">Secondary Button</button>
                <button className="btn-outline">Outline Button</button>
                <button className="btn-primary" disabled>Disabled Button</button>
              </div>
            </div>

            <div>
              <h2 className="heading-5 mb-4">Cards</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card-elevated p-6">
                  <h3 className="heading-6 mb-3">Elevated Card</h3>
                  <p className="body-medium text-greyscale-600 mb-4">
                    This card uses the elevated shadow from our design system.
                  </p>
                  <button className="btn-primary">Learn More</button>
                </div>
                <div className="surface-greyscale p-6 rounded-24">
                  <h3 className="heading-6 mb-3">Surface Card</h3>
                  <p className="body-medium text-greyscale-600 mb-4">
                    This card uses the greyscale surface background.
                  </p>
                  <button className="btn-outline">Explore</button>
                </div>
              </div>
            </div>

            <div>
              <h2 className="heading-5 mb-4">Form Elements</h2>
              <div className="space-y-4 max-w-md">
                <div>
                  <label className="body-medium font-semibold text-greyscale-900 mb-2 block">
                    Input Field
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your text here..."
                    className="w-full p-3 border border-greyscale-300 rounded-16 focus:border-primary-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="body-medium font-semibold text-greyscale-900 mb-2 block">
                    Textarea
                  </label>
                  <textarea
                    placeholder="Enter your message..."
                    rows={4}
                    className="w-full p-3 border border-greyscale-300 rounded-16 focus:border-primary-900 focus:outline-none resize-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'examples' && (
          <div className="space-y-8">
            <div>
              <h2 className="heading-5 mb-4">Dating Profile Card</h2>
              <div className="card-elevated p-6 max-w-md">
                <div className="w-full h-48 bg-gradient-purple rounded-16 mb-4 flex items-center justify-center">
                  <span className="text-ds-white heading-4">Photo</span>
                </div>
                <h3 className="heading-5 mb-1">Sarah, 25</h3>
                <p className="body-medium text-greyscale-600 mb-3">2.5 miles away</p>
                <p className="body-medium mb-4">
                  Love hiking, coffee, and good conversations. Looking for someone genuine.
                </p>
                <div className="flex gap-3">
                  <button className="btn-primary flex-1 flex items-center justify-center gap-2">
                    <Heart size={20} />
                    Like
                  </button>
                  <button className="btn-secondary flex items-center justify-center gap-2">
                    <Star size={20} />
                    Super
                  </button>
                </div>
              </div>
            </div>

            <div>
              <h2 className="heading-5 mb-4">Navigation Header</h2>
              <div className="card-elevated p-4">
                <div className="flex items-center justify-between">
                  <h3 className="heading-6">Discover</h3>
                  <div className="flex items-center gap-3">
                    <button className="p-2 hover:bg-greyscale-100 rounded-16 transition-colors">
                      <Search size={20} className="text-greyscale-600" />
                    </button>
                    <button className="p-2 hover:bg-greyscale-100 rounded-16 transition-colors">
                      <Filter size={20} className="text-greyscale-600" />
                    </button>
                    <button className="p-2 hover:bg-greyscale-100 rounded-16 transition-colors relative">
                      <Bell size={20} className="text-greyscale-600" />
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-alert-error rounded-full"></div>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="heading-5 mb-4">Message Thread</h2>
              <div className="card-elevated p-4 max-w-md">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-secondary-300 rounded-full"></div>
                  <div>
                    <h4 className="body-medium font-semibold">Alex</h4>
                    <p className="body-small text-greyscale-600">Online now</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="bg-greyscale-100 p-3 rounded-16 rounded-bl-4">
                    <p className="body-medium">Hey! How's your day going?</p>
                  </div>
                  <div className="bg-primary-900 text-ds-white p-3 rounded-16 rounded-br-4 ml-8">
                    <p className="body-medium">Great! Just finished a hike. How about you?</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="heading-5 mb-4">Settings Menu</h2>
              <div className="card-elevated max-w-md">
                {[
                  { icon: Settings, label: 'Account Settings', desc: 'Privacy, security, and more' },
                  { icon: Bell, label: 'Notifications', desc: 'Push, email, and SMS settings' },
                  { icon: Heart, label: 'Discovery', desc: 'Who can see you and preferences' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 hover:bg-greyscale-50 transition-colors">
                    <div className="w-10 h-10 bg-bg-purple rounded-16 flex items-center justify-center">
                      <item.icon size={20} className="text-primary-900" />
                    </div>
                    <div className="flex-1">
                      <h4 className="body-medium font-semibold">{item.label}</h4>
                      <p className="body-small text-greyscale-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="heading-5 mb-4">Typography in Action</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Urbanist Example */}
                <div className="card-elevated p-6">
                  <h3 className="heading-5 mb-3">Modern & Clean</h3>
                  <p className="body-medium text-greyscale-600 mb-4">
                    Urbanist provides excellent readability for UI elements and body text.
                  </p>
                  <button className="btn-primary">Get Started</button>
                </div>

                {/* Playfair Display Example */}
                <div className="card-elevated p-6">
                  <h3 className="heading-5-playfair mb-3">Elegant & Refined</h3>
                  <p className="body-medium text-greyscale-600 mb-4 font-playfair">
                    Playfair Display adds sophistication and elegance to headlines and special content.
                  </p>
                  <button className="btn-secondary">Learn More</button>
                </div>

                {/* Roboto Flex Example */}
                <div className="card-elevated p-6">
                  <h3 className="heading-5-roboto mb-3">Flexible & Versatile</h3>
                  <p className="body-medium-roboto text-greyscale-600 mb-4">
                    Roboto Flex offers variable font technology for optimal performance and flexibility.
                  </p>
                  <button className="btn-outline">Explore</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
