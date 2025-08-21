import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Church, Star, Users, Book } from 'lucide-react';
import { 
  FaithBackground, 
  FaithCard, 
  FaithButton, 
  BiblicalVerse, 
  FaithFeatures,
  DivineGlow,
  ThemeToggle,
  useFaithTheme 
} from "../components/FaithElements";

export default function FaithDemo() {
  const navigate = useNavigate();
  const { isFaithMode, shouldShowFaithFeatures } = useFaithTheme();

  return (
    <FaithBackground className="min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <FaithCard className="flex items-center justify-between p-6 mb-6">
          <button onClick={() => navigate(-1)} className="p-2">
            <ArrowLeft className={`w-6 h-6 ${isFaithMode() ? 'text-amber-800' : 'text-gray-700'}`} />
          </button>
          <div className="flex items-center space-x-3">
            {isFaithMode() && <Church className="w-6 h-6 text-amber-600" />}
            <h1 className={`text-2xl font-bold ${isFaithMode() ? 'text-amber-800' : 'text-gray-900'}`}>
              {isFaithMode() ? 'Faith Features Demo' : 'App Features Demo'}
            </h1>
          </div>
          <div className="w-10" />
        </FaithCard>

        {/* Theme Toggle Section */}
        <FaithCard className="p-6 mb-6">
          <h2 className={`text-xl font-semibold mb-4 ${isFaithMode() ? 'text-amber-800' : 'text-gray-900'}`}>
            Theme Settings
          </h2>
          <ThemeToggle />
        </FaithCard>

        {/* Biblical Verse */}
        <div className="mb-6">
          <BiblicalVerse context="love" showAlways={true} />
        </div>

        {/* Faith Features Section */}
        <FaithFeatures>
          <FaithCard className="p-6 mb-6" blessed>
            <h2 className={`text-xl font-semibold mb-4 ${isFaithMode() ? 'text-amber-800' : 'text-gray-900'}`}>
              Faith-Based Features
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <DivineGlow>
                <div className={`p-4 rounded-lg border ${
                  isFaithMode() ? 'bg-amber-50 border-amber-200' : 'bg-gray-50 border-gray-200'
                }`}>
                  <Heart className={`w-8 h-8 mb-3 ${isFaithMode() ? 'text-amber-600' : 'text-purple-600'}`} />
                  <h3 className={`font-semibold mb-2 ${isFaithMode() ? 'text-amber-800' : 'text-gray-900'}`}>
                    Christ-Centered Connections
                  </h3>
                  <p className={`text-sm ${isFaithMode() ? 'text-amber-700' : 'text-gray-700'}`}>
                    Connect with fellow believers who share your values and faith journey.
                  </p>
                </div>
              </DivineGlow>

              <div className={`p-4 rounded-lg border ${
                isFaithMode() ? 'bg-amber-50 border-amber-200' : 'bg-gray-50 border-gray-200'
              }`}>
                <Church className={`w-8 h-8 mb-3 ${isFaithMode() ? 'text-amber-600' : 'text-purple-600'}`} />
                <h3 className={`font-semibold mb-2 ${isFaithMode() ? 'text-amber-800' : 'text-gray-900'}`}>
                  Community Building
                </h3>
                <p className={`text-sm ${isFaithMode() ? 'text-amber-700' : 'text-gray-700'}`}>
                  Join a verified community of Christians committed to authentic relationships.
                </p>
              </div>

              <div className={`p-4 rounded-lg border ${
                isFaithMode() ? 'bg-amber-50 border-amber-200' : 'bg-gray-50 border-gray-200'
              }`}>
                <Star className={`w-8 h-8 mb-3 ${isFaithMode() ? 'text-amber-600' : 'text-purple-600'}`} />
                <h3 className={`font-semibold mb-2 ${isFaithMode() ? 'text-amber-800' : 'text-gray-900'}`}>
                  Spiritual Growth
                </h3>
                <p className={`text-sm ${isFaithMode() ? 'text-amber-700' : 'text-gray-700'}`}>
                  Access resources and discussions designed to strengthen your faith.
                </p>
              </div>

              <div className={`p-4 rounded-lg border ${
                isFaithMode() ? 'bg-amber-50 border-amber-200' : 'bg-gray-50 border-gray-200'
              }`}>
                <Users className={`w-8 h-8 mb-3 ${isFaithMode() ? 'text-amber-600' : 'text-purple-600'}`} />
                <h3 className={`font-semibold mb-2 ${isFaithMode() ? 'text-amber-800' : 'text-gray-900'}`}>
                  Safe Environment
                </h3>
                <p className={`text-sm ${isFaithMode() ? 'text-amber-700' : 'text-gray-700'}`}>
                  Every profile is verified to ensure a safe, authentic community.
                </p>
              </div>
            </div>
          </FaithCard>
        </FaithFeatures>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <FaithButton 
            variant="primary" 
            onClick={() => navigate('/matches')}
            className="flex-1"
          >
            <Heart className="w-5 h-5 mr-2" />
            {isFaithMode() ? 'Find Blessed Connections' : 'Find Matches'}
          </FaithButton>
          
          <FaithButton 
            variant="secondary" 
            onClick={() => navigate('/settings')}
            className="flex-1"
          >
            <Book className="w-5 h-5 mr-2" />
            View Settings
          </FaithButton>
        </div>

        {/* Feature Status */}
        <FaithCard className="p-6">
          <h3 className={`text-lg font-semibold mb-4 ${isFaithMode() ? 'text-amber-800' : 'text-gray-900'}`}>
            Current Settings
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className={isFaithMode() ? 'text-amber-700' : 'text-gray-700'}>Theme Mode:</span>
              <span className={`font-medium ${isFaithMode() ? 'text-amber-800' : 'text-gray-900'}`}>
                {isFaithMode() ? 'Faith-Based' : 'Modern'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className={isFaithMode() ? 'text-amber-700' : 'text-gray-700'}>Faith Features:</span>
              <span className={`font-medium ${isFaithMode() ? 'text-amber-800' : 'text-gray-900'}`}>
                {shouldShowFaithFeatures() ? 'Enabled' : 'Disabled'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className={isFaithMode() ? 'text-amber-700' : 'text-gray-700'}>Visual Elements:</span>
              <span className={`font-medium ${isFaithMode() ? 'text-amber-800' : 'text-gray-900'}`}>
                {isFaithMode() ? 'Faith Symbols & Colors' : 'Modern Design'}
              </span>
            </div>
          </div>
        </FaithCard>
      </div>
    </FaithBackground>
  );
}
