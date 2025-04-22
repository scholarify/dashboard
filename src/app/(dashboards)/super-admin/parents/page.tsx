"use client";

import SuperLayout from '@/components/Dashboard/Layouts/SuperLayout';
import CircularLoader from '@/components/widgets/CircularLoader';
import React, { Suspense, useEffect, useState } from 'react';
import { UserPlus, Users } from 'lucide-react';

export default function Page() {
  const BASE_URL = "/super-admin";

  const navigation = {
    icon: UserPlus,
    baseHref: `${BASE_URL}/parents`,
    title: "Parents",
  };


  return (
    <Suspense fallback={
      <div className="flex justify-center items-center h-screen absolute top-0 left-0 z-50">
        <CircularLoader size={32} color="teal" />
      </div>
    }>
      <SuperLayout
        navigation={navigation}
        showGoPro={true}
        onLogout={() => console.log("Logged out")}
      >
        parents
      </SuperLayout>
    </Suspense>
  );
}


