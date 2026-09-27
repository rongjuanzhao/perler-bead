import type { CloudTransferMessages } from "@/app/(en)/transfer/cloud/CloudTransferClient";
import type { LanTransferMessages } from "@/src/i18n/localized-transfer";

const koLanTransferMessages: LanTransferMessages = {
  encrypted: "종단 간 암호화", peerToPeer: "P2P 전송, 서버에 저장하지 않음", sendStepTitle: "보내기", sending: "보내는 중...", receiving: "받는 중...", sendFiles: "파일 보내기", selectFilesAndDevice: "파일과 받을 기기를 선택하세요", selectDeviceToSend: "받을 기기를 선택하세요", waitingForConnection: "연결을 기다리는 중...", linkCopied: "링크를 복사했습니다", linkCopyFailed: "링크를 복사하지 못했습니다", copyLinkHelp: "다른 기기에서 이 링크를 열어 전송을 시작하세요", yourDevice: "이 기기", browserNotSupportedTitle: "지원하지 않는 브라우저", browserNotSupportedDescription: "이 브라우저는 WebRTC를 지원하지 않습니다. 최신 Chrome, Firefox 또는 Edge를 사용하세요.", changeName: "이름 변경", online: "온라인", connecting: "연결 중", selectFiles: "파일 선택", dropFiles: "여기에 파일을 놓거나", clickToBrowse: "클릭해서 선택", fileSelectedSingular: "개 파일 선택됨", fileSelectedPlural: "개 파일 선택됨", clearAll: "모두 지우기", selectDevice: "기기 선택", connectingToServer: "서버에 연결하는 중...", noDevicesFound: "기기를 찾지 못했습니다", openOnAnotherDevice: "다른 기기에서 이 페이지를 열면 파일을 전송할 수 있습니다.", unknownDevice: "알 수 없음", sendingFiles: "파일을 보내는 중...", receivingFiles: "파일을 받는 중...", totalProgress: "전체 진행률",
};

const koCloudTransferMessages: CloudTransferMessages = {
  signInTitle: "클라우드 전송 로그인", signInDescription: "Google 계정으로 로그인하여 파일을 업로드하고 공유 링크를 만들며 Premium 기능을 동기화하세요.", signInWithGoogle: "Google로 로그인", passwordProToast: "비밀번호 보호는 Pro 기능입니다. Premium 정보를 엽니다.", expiryProToast: "7일, 14일, 30일 보관은 Pro 기능입니다. Premium 정보를 엽니다.", fileTooLarge: "파일이 너무 큽니다.", unsupportedExecutableFile: "실행 파일과 스크립트는 업로드할 수 없습니다. 다운로드하는 사용자를 보호하기 위해 Quick Share에서는 설치 프로그램, 실행 파일 및 스크립트 파일의 공유를 허용하지 않습니다.", tierAllowsUpTo: "{tier} 요금제는 최대 {size}까지 지원합니다.", pleaseSignInToast: "업로드를 시작하려면 Google로 로그인하세요.", signInFailedToast: "로그인하지 못했습니다", authRequiredToast: "파일을 업로드하려면 로그인이 필요합니다", freeLimitsResetToast: "무료 요금제는 3일 보관과 비밀번호 미사용만 지원합니다. 설정을 초기화합니다.", uploadInitFailed: "업로드를 준비하지 못했습니다", uploadCompleteFailed: "업로드를 완료하지 못했습니다", uploadSuccessToast: "파일을 업로드했습니다", uploadFailed: "업로드하지 못했습니다", fileLimitReached: "파일 개수 한도에 도달했습니다", fileLimitReachedDetails: "파일 개수 한도에 도달했습니다. Premium 정보를 엽니다.", dropFileOrClick: "여기에 파일을 놓거나 클릭해서 선택하세요", upToPerFile: "파일당 최대 {size}", deleteFilesToUploadMore: "파일을 더 올리려면 기존 파일을 삭제하세요(최대 {maxFiles}개)", preparingUpload: "업로드 준비 중...", uploading: "업로드 중...", finalizing: "마무리 중...", uploadAnotherFile: "다른 파일 업로드", cancel: "취소", expiresAfter: "보관 기간", requirePassword: "비밀번호 사용", passwordHelp: "접근 코드로 다운로드를 보호합니다", regenerateAccessCode: "접근 코드 다시 만들기", copyAccessCode: "접근 코드 복사", passwordCopied: "비밀번호를 복사했습니다", passwordCopyFailed: "비밀번호를 복사하지 못했습니다", recipientPasswordHelp: "받는 사람이 파일을 다운로드하려면 이 4자리 코드를 입력해야 합니다.", uploadFile: "파일 업로드", expiryMonthSingular: "개월", expiryMonthPlural: "개월", expiryDaySingular: "일", expiryDayPlural: "일", copied: "복사됨", copyFailed: "복사 실패", fileUploadedSuccessfully: "파일 업로드 완료", shareLink: "공유 링크", accessCodeLabel: "접근 코드(받는 사람에게 전달)", expires: "만료", copiedLabel: "복사됨", copy: "복사", linkCopied: "링크를 복사했습니다", labelCopied: "{label} 복사 완료", fileDeleted: "파일을 삭제했습니다", deleteFileFailed: "파일을 삭제하지 못했습니다", noActiveFiles: "공유 중인 파일이 없습니다. 파일을 업로드해 시작하세요.", protected: "보호됨", storageQuota: "저장 공간", signedInPlanLabel: "{tier} 요금제", freePlanLabel: "무료 요금제", filesCountTemplate: "{current} / {max}개", quotaDescriptionTemplate: "파일당 최대 {maxFileSize}. 만료된 파일은 자동으로 삭제됩니다.", secureStorage: "안전한 저장 공간", autoExpiry: "자동 만료", passwordProtectionPro: "비밀번호 보호(Pro)", startSharingFiles: "파일 공유 시작", startSharingDescription: "Google로 로그인하여 파일을 업로드하고 보관 기간과 비밀번호를 설정하세요.", proPlan: "Pro 요금제", freePlan: "무료", activeFilesTemplate: "{count} / {max}개 공유 중", signOut: "로그아웃", activeSharedFiles: "공유 중인 파일", upgradeTitle: "Premium으로 업그레이드", upgradeDescription: "더 큰 용량, 비밀번호 보호, 더 긴 보관 기간을 이용하세요.", freePlanTitle: "무료 요금제", freePlanPriceSuffix: " / 평생 무료", freePlanActiveFiles: "최대 3개 파일 공유", freePlanMaxFileSize: "파일당 최대 1 GB", freePlanRetention: "3일 보관", freePlanPasswordProtection: "비밀번호 보호", freePlanAdFree: "보내는 사람과 받는 사람 모두 광고 없음", currentPlan: "현재 요금제", basicAccess: "기본 이용", popular: "인기", premiumPlanTitle: "Premium 요금제", premiumPlanPriceSuffix: " / 월", premiumActiveFiles: "최대 20개 파일 공유", premiumMaxFileSize: "파일당 최대 5 GB", premiumRetention: "최대 30일 보관", premiumPasswordProtection: "비밀번호 보호", premiumCrossDeviceSync: "Android와 웹 기기 간 동기화", premiumAdFree: "보내는 사람과 받는 사람 모두 광고 없음", activePremiumSubscription: "Premium 구독 이용 중", openingPortal: "포털을 여는 중...", manageSubscription: "구독 관리", signInToGetPremium: "로그인하고 Premium 이용", redirecting: "이동 중...", subscribe: "구독하기", subscriptionNote: "구독 상태는 Google 계정에 연결되며 QuickShare 웹과 Android에서 자동으로 동기화됩니다.", checkoutSuccessToast: "결제가 완료되었습니다. 계정을 업그레이드하는 중...", checkoutCreatingError: "결제 세션을 만들지 못했습니다", checkoutGenericError: "구독을 시작하지 못했습니다. 다시 시도하세요.", portalAuthRequired: "구독을 관리하려면 로그인하세요.", portalLoadError: "고객 포털을 불러오지 못했습니다", portalGenericError: "구독 설정을 열지 못했습니다. 다시 시도하세요.",
};

export const ko = {
  locale: "ko", metadataLocale: "ko_KR",
  header: { transfer: "전송", lanTransfer: "LAN 전송", cloudTransfer: "클라우드 전송", pricing: "요금", blog: "블로그", download: "다운로드", downloadApp: "앱 다운로드", myCloudFiles: "클라우드 파일", myFiles: "내 파일", signIn: "로그인", signInWithGoogle: "Google로 로그인", signOut: "로그아웃", transferOptions: "전송 방법", navigation: "메뉴", directP2PShare: "P2P 직접 공유", linkSharingViaCloud: "클라우드 링크 공유", toggleNavigation: "메뉴 열기 또는 닫기", language: { label: "언어", current: "한국어" } },
  home: {
    meta: { title: "휴대폰 PC 파일 전송, 빠르고 간편하게 | Quick Share", description: "Android, iPhone, Windows, Mac 사이에서 사진과 동영상을 전송하세요. 같은 Wi-Fi에서는 P2P로, 멀리 있는 사람에게는 링크로 파일을 공유할 수 있습니다.", ogDescription: "휴대폰과 PC 사이에서 Wi-Fi로 파일을 전송하거나 안전한 링크로 공유하세요.", twitterDescription: "휴대폰, PC, 태블릿 사이에서 사진, 동영상, 문서를 빠르게 공유하세요.", imageAlt: "Quick Share 휴대폰 PC 파일 전송" },
    nav: { transfer: "파일 전송", download: "다운로드", faq: "자주 묻는 질문", get: "받기" },
    hero: { beforeHighlight: "휴대폰과 PC에서 빠른 ", highlight: "파일 전송", afterHighlight: "을 시작하세요", description: "파일 전송으로 Android, iPhone, Windows, Mac 사이에서 사진, 동영상, 문서를 빠르게 보내세요. 같은 Wi-Fi에서는 직접 보내고, 멀리 있는 사람에게는 공유 링크를 만들 수 있습니다.", primaryCta: "지금 파일 전송", demoCta: "데모 보기", animation: { sourceDevice: "이 기기", recipient: "받는 사람", transferComplete: "전송 완료", transferringSpeed: "100 MB/s로 전송 중" } },
    transfer: { title: "상황에 맞는 파일 전송 방법", description: "같은 Wi-Fi에 있는 기기는 LAN으로 직접 연결하고, 다른 장소에 있는 사람에게는 클라우드 다운로드 링크를 보내세요.", lan: { title: "Wi-Fi 파일 전송", description: "같은 네트워크의 기기로 파일을 직접 보내며 외부 서버에 업로드하지 않습니다.", badges: ["암호화", "서버 저장 없음"], cta: "Wi-Fi로 전송" }, cloud: { title: "온라인 파일 공유", description: "파일을 업로드하고 다운로드 링크를 만들어 어디서든 공유하세요.", badges: ["안전한 링크", "원격 공유"], cta: "링크로 공유" } },
    download: { eyebrow: "다운로드", title: "Quick Share 앱 다운로드", description: "사용할 플랫폼을 선택하고 바로 파일 공유를 시작하세요.", androidTitle: "Google Play", androidSubtitle: "Android", windowsTitle: "Microsoft Store", windowsSubtitle: "Windows", iosTitle: "App Store", iosSubtitle: "iOS", linuxTitle: "Snap Store", linuxSubtitle: "Linux", newBadge: "신규", downloadAction: "다운로드", comingSoonAction: "출시 예정" },
    gallery: [
      { src: "/quick_share_1.webp", alt: "Quick Share 주변 기기 검색", title: "기기 자동 검색", description: "같은 네트워크의 기기를 찾아 파일을 받을 기기를 바로 선택할 수 있습니다.", icon: "smartphone" },
      { src: "/quick_share_2.webp", alt: "Quick Share 빠른 파일 전송", title: "빠른 파일 전송", description: "로컬 네트워크를 통해 사진, 동영상, 문서를 전송합니다.", icon: "laptop" },
      { src: "/quick_share_3.webp", alt: "Quick Share 크로스 플랫폼 파일 공유", title: "다양한 운영체제 지원", description: "휴대폰에서 PC로, PC에서 휴대폰으로 기기 종류와 관계없이 공유하세요.", icon: "globe" },
      { src: "/quick_share_4.webp", alt: "Quick Share 안전한 파일 공유", title: "안전한 공유", description: "용도에 따라 로컬 P2P 전송이나 클라우드 링크를 선택하세요.", icon: "shield" },
    ],
    features: { title: "파일 공유에 필요한 기능을 한곳에", description: "속도와 편의성, 개인정보 보호를 고려한 기기 간 파일 전송입니다.", items: [
      { icon: "wifi", title: "같은 Wi-Fi에서 바로 전송", description: "LAN 전송은 클라우드에 올리지 않고 기기 사이에서 파일을 직접 보냅니다." },
      { icon: "shield", title: "개인 파일을 서버에 저장하지 않음", description: "로컬 전송 파일은 외부 서버에 저장되지 않아 개인 사진과 업무 문서를 공유하기 좋습니다." },
      { icon: "smartphone", title: "휴대폰, PC, 태블릿 지원", description: "Android, iPhone, Windows, Mac, Linux와 주요 브라우저에서 사용할 수 있습니다." },
      { icon: "globe", title: "브라우저에서 바로 사용", description: "앱을 설치할 수 없는 기기에서도 웹 브라우저로 파일을 공유할 수 있습니다." },
      { icon: "link", title: "대용량 파일을 링크로 공유", description: "상대방이 다른 네트워크에 있다면 클라우드에 업로드하고 다운로드 링크를 보내세요." },
      { icon: "user", title: "LAN 전송은 회원가입 없이", description: "계정을 만들지 않아도 로컬 네트워크에서 바로 파일을 전송할 수 있습니다." },
    ] },
    faq: { title: "자주 묻는 질문", description: "Quick Share 파일 전송과 공유에 관해 자주 찾는 내용을 정리했습니다.", items: [
      { question: "휴대폰에서 PC로 파일을 어떻게 전송하나요?", answer: "휴대폰과 PC를 같은 Wi-Fi에 연결한 뒤 두 기기에서 Quick Share를 여세요. 파일과 받을 기기를 선택하면 직접 전송이 시작됩니다." },
      { question: "인터넷 없이도 파일 전송이 가능한가요?", answer: "네. LAN 전송은 같은 Wi-Fi 또는 로컬 네트워크 안에서 작동합니다. 두 기기가 서로 연결될 수 있다면 외부 인터넷은 필요하지 않습니다." },
      { question: "앱을 설치해야 하나요?", answer: "아니요. 웹 버전은 브라우저에서 바로 사용할 수 있습니다. Android와 Windows 앱을 설치하면 자주 전송할 때 더 편리합니다." },
      { question: "파일이 서버에 업로드되나요?", answer: "LAN 전송에서는 업로드되지 않습니다. 멀리 있는 사람에게 보내려면 클라우드 전송으로 공유 링크를 만들 수 있습니다." },
      { question: "동영상이나 대용량 파일도 보낼 수 있나요?", answer: "로컬 전송에는 서버 저장 공간에 따른 제한이 없습니다. 실제 속도와 안정성은 Wi-Fi 환경, 기기 성능, 남은 저장 공간에 따라 달라집니다." },
    ] },
    cta: { title: "휴대폰과 PC 파일 공유를 더 간단하게.", description: "사진, 동영상, PDF, 업무 문서를 필요한 사람이나 기기로 빠르게 보내세요.", button: "Quick Share 다운로드" },
    footer: { tagline: "휴대폰과 PC 사이의 간편한 파일 전송.", product: "제품", pricing: "요금", download: "다운로드", company: "회사", contact: "문의", legal: "법적 고지", privacy: "개인정보 처리방침", terms: "이용약관" },
  },
  transferLan: {
    meta: { title: "웹 파일 전송, 앱 설치 없이 브라우저에서", description: "웹 파일 전송으로 같은 Wi-Fi의 휴대폰과 PC에서 앱 설치 없이 파일을 보내세요. 파일은 기기 사이에서 직접 이동하며 클라우드에 저장되지 않습니다.", ogDescription: "앱 설치 없이 브라우저에서 사용하는 로컬 파일 공유." },
    backHome: "홈으로", title: "웹 파일 전송", description: "웹 파일 전송을 사용하려면 같은 Wi-Fi에 연결된 두 기기에서 이 페이지를 여세요. 파일은 P2P로 직접 이동하며 클라우드에 저장되지 않습니다.", howToTitle: "웹 파일 전송 사용 방법",
    steps: [
      { title: "두 기기에서 페이지 열기", description: "웹 파일 전송을 시작하려면 파일을 보낼 기기와 받을 기기 모두에서 이 페이지를 여세요." },
      { title: "같은 Wi-Fi에 연결", description: "같은 로컬 네트워크에 있는 기기가 자동으로 검색됩니다." },
      { title: "파일과 받을 기기 선택", description: "사진, 동영상 또는 문서를 선택하고 받을 기기를 누르세요." },
      { title: "받은 파일 저장", description: "상대 기기에서 전송을 수락하고 원하는 위치에 파일을 저장하세요." },
    ],
    faqTitle: "웹 파일 전송 FAQ", faqs: [
      { question: "두 기기가 같은 Wi-Fi에 있어야 하나요?", answer: "네. LAN 전송을 사용하려면 보내는 기기와 받는 기기가 같은 로컬 네트워크에 연결되어야 합니다." },
      { question: "파일이 서버를 거치나요?", answer: "아니요. 파일은 WebRTC로 기기 사이에서 직접 전송됩니다. 연결에 필요한 소량의 정보만 서버를 거칩니다." },
      { question: "웹 파일 전송을 사용하려면 앱을 설치해야 하나요?", answer: "아니요. 웹 파일 전송은 앱 설치 없이 휴대폰과 PC의 브라우저에서 바로 사용할 수 있습니다. 두 기기를 같은 Wi-Fi에 연결하세요." },
      { question: "파일 크기 제한이 있나요?", answer: "서버 저장 용량에 따른 제한은 없습니다. 실제 한계는 네트워크와 기기 성능, 남은 저장 공간에 따라 달라집니다." },
    ], clientMessages: koLanTransferMessages,
  },
  transferCloud: {
    meta: { title: "대용량 파일 보내기, 링크로 안전하게", description: "대용량 파일 보내기로 파일을 업로드하고 만료되는 다운로드 링크를 만드세요. Premium에서는 비밀번호도 설정할 수 있습니다.", ogDescription: "대용량 파일을 안전한 다운로드 링크로 온라인에서 공유하세요." },
    backHome: "홈으로", title: "대용량 파일 보내기", description: "대용량 파일 보내기는 파일을 업로드한 뒤 다운로드 링크를 만들어 카카오톡, 메시지 또는 이메일로 공유하는 방식입니다.", howToTitle: "대용량 파일 보내기 방법", howToDescription: "같은 Wi-Fi에 있지 않은 사람에게는 공유 링크가 편리합니다. 업로드 후 생성되는 링크를 휴대폰이나 PC에서 열어 다운로드할 수 있습니다.",
    steps: [
      { title: "파일 업로드", description: "대용량 파일 보내기는 무료 요금제에서 파일당 최대 {freeMaxFileSize}, Premium에서 최대 {proMaxFileSize}까지 지원합니다." },
      { title: "만료 기간과 보안 설정", description: "링크가 유지될 기간을 선택하세요. Premium에서는 다운로드 비밀번호도 설정할 수 있습니다." },
      { title: "링크 복사해 보내기", description: "다운로드 링크를 복사해 카카오톡, 메시지 또는 이메일로 보내세요." },
    ],
    faqTitle: "대용량 파일 보내기 FAQ", faqs: [
      { question: "대용량 파일 보내기는 어떻게 하나요?", answer: "대용량 파일 보내기를 사용하려면 Quick Share에 파일을 업로드한 뒤 생성된 다운로드 링크를 받는 사람에게 전달하세요." },
      { question: "무료 요금제의 제한은 무엇인가요?", answer: "무료 사용자는 활성 파일을 최대 {freeMaxFiles}개 공유할 수 있고 파일당 최대 {freeMaxFileSize}까지 업로드할 수 있습니다." },
      { question: "링크로 파일을 공유해도 안전한가요?", answer: "파일은 HTTPS로 전송되어 클라우드에 저장됩니다. Premium에서는 다운로드 링크에 비밀번호를 추가할 수 있습니다." },
      { question: "링크가 만료되면 어떻게 되나요?", answer: "만료된 파일은 자동으로 삭제되며 기존 링크로 더 이상 접근할 수 없습니다." },
    ], clientMessages: koCloudTransferMessages,
  },
} as const;
