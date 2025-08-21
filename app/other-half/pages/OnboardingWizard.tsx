import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  ArrowRight, 
  Upload, 
  Camera, 
  MapPin, 
  Heart,
  CheckCircle,
  AlertCircle,
  User,
  Calendar,
  Gamepad2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  ONBOARDING_STEPS, 
  DENOMINATIONS, 
  CHURCH_ATTENDANCE,
  LOVE_LANGUAGES,
  LOOKING_FOR_OPTIONS,
  AVAILABILITY_OPTIONS,
  ID_TYPES,
  BIBLICAL_VERSES
} from '../lib/constants';
import { useActionLoggerContext } from '../components/ActionLogger';
import { User } from '../types';

interface OnboardingData {
  // Personal Info
  age: number | null;
  location: string;
  bio: string;
  looking_for: string;
  
  // Faith Profile
  denomination: string;
  church_attendance: string;
  love_language: string;
  personality_type: string;
  
  // Interests & Preferences
  interests: string[];
  preferred_age_min: number | null;
  preferred_age_max: number | null;
  max_distance: number | null;
  
  // Availability
  availability: string[];
  
  // Photos & Verification
  face_photo_url: string;
  id_type: string;
  id_photo_url: string;
}

const initialData: OnboardingData = {
  age: null,
  location: '',
  bio: '',
  looking_for: '',
  denomination: '',
  church_attendance: '',
  love_language: '',
  personality_type: '',
  interests: [],
  preferred_age_min: null,
  preferred_age_max: null,
  max_distance: null,
  availability: [],
  face_photo_url: '',
  id_type: '',
  id_photo_url: ''
};

// Step 1: Personal Info
function PersonalInfoStep({ 
  data, 
  onUpdate, 
  onNext, 
  onPrev 
}: StepProps) {
  const { logClick, logSubmit } = useActionLoggerContext();
  
  const handleNext = () => {
    logClick('onboarding-personal-next', 'button', { step: 1 });
    onNext();
  };

  const handleFieldChange = (field: string, value: any) => {
    logSubmit('onboarding-personal', { field, value });
    onUpdate({ [field]: value });
  };

  const isValid = data.age && data.location && data.bio && data.looking_for;

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 divine-glow">
          <User className="h-8 w-8 text-primary-600" />
        </div>
        <h2 className="text-2xl font-semibold text-neutral-900 mb-2">
          Tell Us About Yourself
        </h2>
        <p className="text-neutral-600">
          Let's start with some basic information to help you connect with the right people.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="age" className="form-label">Age *</Label>
          <Input
            id="age"
            type="number"
            placeholder="Enter your age"
            value={data.age || ''}
            onChange={(e) => handleFieldChange('age', parseInt(e.target.value) || null)}
            className="form-input"
            min="18"
            max="100"
            required
          />
        </div>

        <div>
          <Label htmlFor="location" className="form-label">Location *</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <Input
              id="location"
              placeholder="City, State"
              value={data.location}
              onChange={(e) => handleFieldChange('location', e.target.value)}
              className="form-input pl-10"
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="looking_for" className="form-label">I'm looking for *</Label>
          <Select value={data.looking_for} onValueChange={(value) => handleFieldChange('looking_for', value)}>
            <SelectTrigger className="form-input">
              <SelectValue placeholder="Select what you're looking for" />
            </SelectTrigger>
            <SelectContent>
              {LOOKING_FOR_OPTIONS.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="bio" className="form-label">Tell us about yourself *</Label>
          <Textarea
            id="bio"
            placeholder="Share a bit about your faith journey, interests, and what makes you unique..."
            value={data.bio}
            onChange={(e) => handleFieldChange('bio', e.target.value)}
            className="form-input min-h-[100px]"
            maxLength={500}
            required
          />
          <p className="text-xs text-neutral-500 mt-1">
            {data.bio.length}/500 characters
          </p>
        </div>
      </div>

      <div className="bible-verse text-center">
        "For I know the plans I have for you," declares the Lord
        <div className="text-sm text-neutral-500 mt-1">— Jeremiah 29:11</div>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleNext}
          disabled={!isValid}
          className="btn-primary"
        >
          Continue
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}

// Step 2: Faith Profile
function FaithProfileStep({ data, onUpdate, onNext, onPrev }: StepProps) {
  const { logClick } = useActionLoggerContext();

  const handleNext = () => {
    logClick('onboarding-faith-next', 'button', { step: 2 });
    onNext();
  };

  const handlePrev = () => {
    logClick('onboarding-faith-prev', 'button', { step: 2 });
    onPrev();
  };

  const isValid = data.denomination && data.church_attendance && data.love_language;

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 divine-glow">
          <Heart className="h-8 w-8 text-primary-600" />
        </div>
        <h2 className="text-2xl font-semibold text-neutral-900 mb-2">
          Your Faith Journey
        </h2>
        <p className="text-neutral-600">
          Help us understand your faith background and preferences.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label className="form-label">Denomination *</Label>
          <Select value={data.denomination} onValueChange={(value) => onUpdate({ denomination: value })}>
            <SelectTrigger className="form-input">
              <SelectValue placeholder="Select your denomination" />
            </SelectTrigger>
            <SelectContent>
              {DENOMINATIONS.map(denom => (
                <SelectItem key={denom} value={denom}>
                  {denom}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="form-label">Church Attendance *</Label>
          <Select value={data.church_attendance} onValueChange={(value) => onUpdate({ church_attendance: value })}>
            <SelectTrigger className="form-input">
              <SelectValue placeholder="How often do you attend church?" />
            </SelectTrigger>
            <SelectContent>
              {CHURCH_ATTENDANCE.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="form-label">Love Language *</Label>
          <Select value={data.love_language} onValueChange={(value) => onUpdate({ love_language: value })}>
            <SelectTrigger className="form-input">
              <SelectValue placeholder="What's your primary love language?" />
            </SelectTrigger>
            <SelectContent>
              {LOVE_LANGUAGES.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="personality_type" className="form-label">Personality Type (Optional)</Label>
          <Input
            id="personality_type"
            placeholder="e.g., ENFJ, INTJ (Myers-Briggs)"
            value={data.personality_type}
            onChange={(e) => onUpdate({ personality_type: e.target.value })}
            className="form-input"
          />
        </div>
      </div>

      <div className="bible-verse text-center">
        "Above all else, guard your heart, for everything you do flows from it."
        <div className="text-sm text-neutral-500 mt-1">— Proverbs 4:23</div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={handlePrev} className="btn-secondary">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Button onClick={handleNext} disabled={!isValid} className="btn-primary">
          Continue
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}

// Main Onboarding Wizard Component
interface StepProps {
  data: OnboardingData;
  onUpdate: (updates: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export function OnboardingWizard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<OnboardingData>(initialData);
  const { logClick } = useActionLoggerContext();

  useEffect(() => {
    // Determine current step from URL
    const path = location.pathname;
    const stepIndex = ONBOARDING_STEPS.findIndex(step => 
      path.includes(step.route.split('/').pop()!)
    );
    if (stepIndex >= 0) {
      setCurrentStep(stepIndex);
    }
  }, [location]);

  const updateData = (updates: Partial<OnboardingData>) => {
    setData(prev => ({ ...prev, ...updates }));
  };

  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      navigate(ONBOARDING_STEPS[nextStep].route);
      logClick('onboarding-next', 'button', { 
        from_step: currentStep + 1, 
        to_step: nextStep + 1 
      });
    } else {
      handleSubmit();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      navigate(ONBOARDING_STEPS[prevStep].route);
      logClick('onboarding-prev', 'button', { 
        from_step: currentStep + 1, 
        to_step: prevStep + 1 
      });
    }
  };

  const handleSubmit = async () => {
    try {
      logClick('onboarding-submit', 'button', { 
        step: ONBOARDING_STEPS.length,
        data: { ...data, bio: '[REDACTED]' } // Don't log full bio
      });

      // TODO: Submit to API
      // await User.updateMyUserData({
      //   ...data,
      //   onboarding_complete: true,
      //   verification_status: 'pending'
      // });

      // Navigate to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Onboarding submission error:', error);
    }
  };

  const progress = ((currentStep + 1) / ONBOARDING_STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-surface faith-background flex items-center justify-center p-4">
      <div className="faith-symbols">
        <div className="faith-symbol cross-1">✝</div>
        <div className="faith-symbol heart-1">💛</div>
        <div className="faith-symbol dove-1">🕊</div>
      </div>

      <div className="w-full max-w-2xl">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-primary-100 rounded-lg">
                <Heart className="h-6 w-6 text-primary-600" />
              </div>
              <h1 className="text-xl font-semibold text-neutral-900">Other Half</h1>
            </div>
            <div className="text-sm text-neutral-600">
              Step {currentStep + 1} of {ONBOARDING_STEPS.length}
            </div>
          </div>
          
          <Progress value={progress} className="h-2 bg-neutral-200">
            <div 
              className="h-full bg-primary-500 transition-all duration-300 ease-in-out rounded-full"
              style={{ width: `${progress}%` }}
            />
          </Progress>
          
          <p className="text-sm text-neutral-600 mt-2">
            {ONBOARDING_STEPS[currentStep]?.title}
          </p>
        </div>

        {/* Step Content */}
        <Card className="faith-card blessed">
          <CardContent className="p-8">
            <Routes>
              <Route path="/personal" element={
                <PersonalInfoStep 
                  data={data} 
                  onUpdate={updateData} 
                  onNext={handleNext} 
                  onPrev={handlePrev} 
                />
              } />
              <Route path="/faith" element={
                <FaithProfileStep 
                  data={data} 
                  onUpdate={updateData} 
                  onNext={handleNext} 
                  onPrev={handlePrev} 
                />
              } />
              {/* Additional steps would go here */}
              <Route path="*" element={
                <PersonalInfoStep 
                  data={data} 
                  onUpdate={updateData} 
                  onNext={handleNext} 
                  onPrev={handlePrev} 
                />
              } />
            </Routes>
          </CardContent>
        </Card>

        {/* Step indicators */}
        <div className="flex justify-center mt-6 space-x-2">
          {ONBOARDING_STEPS.map((step, index) => (
            <div
              key={step.step}
              className={cn(
                'w-3 h-3 rounded-full transition-colors',
                index <= currentStep ? 'bg-primary-500' : 'bg-neutral-300'
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default OnboardingWizard;
