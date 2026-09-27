'use client';
import Script from 'next/script';
import {useEffect, useRef} from "react";
import { useAuth } from "@/src/hooks/useAuth";
import { useAdConfig } from "@/src/hooks/useAdConfig";

export default function MonetagAd() {
    const { user, loading } = useAuth();
    const { showAds } = useAdConfig();
    // 标记脚本是否已加载，避免重复插入
    const scriptLoaded = useRef(false);

    useEffect(() => {
        if (!showAds || loading || user?.tier === 'pro') return;
        // 已加载则直接返回
        if (scriptLoaded.current) return;

        // 1. 创建 script 标签
        const script = document.createElement('script');

        // 2. 配置脚本属性（对应原标签的所有属性）
        script.src = 'https://quge5.com/88/tag.min.js';
        script.dataset.zone = '217157'; // 对应 data-zone="217157"
        script.async = true; // 对应 async 属性
        script.dataset.cfasync = 'false'; // 对应 data-cfasync="false"

        // 3. 脚本加载回调（可选，用于调试）
        script.onload = () => {
            console.log('AdMob 脚本加载成功');
            scriptLoaded.current = true;
        };
        script.onerror = (error) => {
            console.error('AdMob 脚本加载失败:', error);
        };

        // 4. 插入到 body 末尾
        document.body.appendChild(script);

        // 5. 组件卸载时清理脚本
        return () => {
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
            scriptLoaded.current = false;
        };
    }, [showAds, loading, user?.tier]); // 监听 showAds、loading 和 tier 变化

    // 该组件仅加载脚本，无 UI 渲染
    return null;
}
