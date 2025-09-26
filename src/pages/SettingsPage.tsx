import React from 'react';
import MainLayout from '@/layouts/MainLayout';
import PersonalizationSettings from '@/components/settings/PersonalizationSettings';

const SettingsPage: React.FC = () => {
  return (
    <MainLayout>
      <div className="pt-16 pb-24">
        <PersonalizationSettings />
      </div>
    </MainLayout>
  );
};

export default SettingsPage;
