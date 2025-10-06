import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import MainLayout from '@/layouts/MainLayout';
import Button from '@/components/ui/Button';
import PersonalizationSettings from '@/components/settings/PersonalizationSettings';

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <MainLayout>
      <div className="w-full max-w-md mx-auto px-4 pt-20 pb-24">
        <div className="mb-4 flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/')}
            icon={<ChevronLeft size={16} />}
            className="text-white"
          >
            Back
          </Button>
          <h1 className="text-sm font-bold text-white ml-2">Settings</h1>
        </div>
        
        <PersonalizationSettings />
      </div>
    </MainLayout>
  );
};

export default SettingsPage;
