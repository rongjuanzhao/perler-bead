'use client';
import Script from 'next/script';
import { useAuth } from '@/src/hooks/useAuth';
import { useAdConfig } from '@/src/hooks/useAdConfig';

export default function Ad() {
    const { user, loading } = useAuth();
    const { showAds } = useAdConfig();

    if (!showAds || loading || user?.tier === 'pro') {
        return null;
    }

    return (
        <>
            <Script
                src={"https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8978922596700722"}
            />

        </>
    );
}
