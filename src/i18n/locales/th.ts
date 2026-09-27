import type { CloudTransferMessages } from "@/app/(en)/transfer/cloud/CloudTransferClient";
import type { LanTransferMessages } from "@/src/i18n/localized-transfer";

const thLanTransferMessages: LanTransferMessages = {
  encrypted: "เข้ารหัสแบบต้นทางถึงปลายทาง",
  peerToPeer: "โอนแบบ P2P ไม่เก็บบนเซิร์ฟเวอร์",
  sendStepTitle: "ส่ง",
  sending: "กำลังส่ง...",
  receiving: "กำลังรับ...",
  sendFiles: "ส่งไฟล์",
  selectFilesAndDevice: "เลือกไฟล์และอุปกรณ์ปลายทางเพื่อเริ่มส่ง",
  selectDeviceToSend: "เลือกอุปกรณ์ที่จะส่งไป",
  waitingForConnection: "กำลังรอการเชื่อมต่อ...",
  linkCopied: "คัดลอกลิงก์แล้ว",
  linkCopyFailed: "คัดลอกลิงก์ไม่สำเร็จ",
  copyLinkHelp: "เปิดลิงก์นี้บนอุปกรณ์อีกเครื่องเพื่อเริ่มส่งไฟล์",
  yourDevice: "อุปกรณ์ของคุณ",
  browserNotSupportedTitle: "เบราว์เซอร์นี้ไม่รองรับ",
  browserNotSupportedDescription:
    "เบราว์เซอร์นี้ไม่รองรับ WebRTC โปรดใช้ Chrome, Firefox หรือ Edge เวอร์ชันใหม่",
  changeName: "เปลี่ยนชื่อ",
  online: "ออนไลน์",
  connecting: "กำลังเชื่อมต่อ",
  selectFiles: "เลือกไฟล์",
  dropFiles: "วางไฟล์ที่นี่ หรือ",
  clickToBrowse: "คลิกเพื่อเลือก",
  fileSelectedSingular: "ไฟล์ที่เลือก",
  fileSelectedPlural: "ไฟล์ที่เลือก",
  clearAll: "ล้างทั้งหมด",
  selectDevice: "เลือกอุปกรณ์",
  connectingToServer: "กำลังเชื่อมต่อเซิร์ฟเวอร์สัญญาณ...",
  noDevicesFound: "ไม่พบอุปกรณ์",
  openOnAnotherDevice: "เปิดหน้านี้บนอุปกรณ์อีกเครื่องเพื่อเริ่มส่งไฟล์",
  unknownDevice: "ไม่ทราบชื่อ",
  sendingFiles: "กำลังส่งไฟล์...",
  receivingFiles: "กำลังรับไฟล์...",
  totalProgress: "ความคืบหน้ารวม",
};

const thCloudTransferMessages: CloudTransferMessages = {
  signInTitle: "เข้าสู่ระบบเพื่อส่งไฟล์ผ่านคลาวด์",
  signInDescription:
    "เข้าสู่ระบบด้วยบัญชี Google เพื่ออัปโหลดไฟล์ สร้างลิงก์แชร์ และซิงก์ฟีเจอร์ Premium",
  signInWithGoogle: "เข้าสู่ระบบด้วย Google",
  passwordProToast: "การป้องกันด้วยรหัสผ่านเป็นฟีเจอร์ Pro กำลังเปิดรายละเอียด Premium",
  expiryProToast:
    "การกำหนดวันหมดอายุ 7, 14 และ 30 วันเป็นฟีเจอร์ Pro กำลังเปิดรายละเอียด Premium",
  fileTooLarge: "ไฟล์มีขนาดใหญ่เกินไป",
  unsupportedExecutableFile:
    "ไม่รองรับไฟล์ปฏิบัติการและสคริปต์ เพื่อปกป้องผู้ดาวน์โหลด Quick Share ไม่อนุญาตให้แชร์ตัวติดตั้ง ไฟล์ปฏิบัติการ หรือสคริปต์",
  tierAllowsUpTo: "แพ็กเกจ {tier} รองรับไฟล์สูงสุด {size}",
  pleaseSignInToast: "เข้าสู่ระบบด้วย Google เพื่อเริ่มอัปโหลด",
  signInFailedToast: "เข้าสู่ระบบไม่สำเร็จ",
  authRequiredToast: "ต้องเข้าสู่ระบบก่อนอัปโหลดไฟล์",
  freeLimitsResetToast:
    "แพ็กเกจฟรีรองรับวันหมดอายุ 3 วันและไม่มีรหัสผ่านเท่านั้น ระบบจะรีเซ็ตตัวเลือกเพื่ออัปโหลดให้เสร็จ",
  uploadInitFailed: "เตรียมการอัปโหลดไม่สำเร็จ",
  uploadCompleteFailed: "อัปโหลดไม่สำเร็จ",
  uploadSuccessToast: "อัปโหลดไฟล์สำเร็จ",
  uploadFailed: "อัปโหลดไฟล์ไม่สำเร็จ",
  fileLimitReached: "ถึงจำนวนไฟล์สูงสุดแล้ว",
  fileLimitReachedDetails: "ถึงจำนวนไฟล์สูงสุดแล้ว กำลังเปิดรายละเอียด Premium",
  dropFileOrClick: "วางไฟล์ที่นี่ หรือคลิกเพื่อเลือก",
  upToPerFile: "สูงสุด {size} ต่อไฟล์",
  deleteFilesToUploadMore: "ลบไฟล์เดิมเพื่ออัปโหลดเพิ่ม (สูงสุด {maxFiles} ไฟล์)",
  preparingUpload: "กำลังเตรียมอัปโหลด...",
  uploading: "กำลังอัปโหลด...",
  finalizing: "กำลังดำเนินการให้เสร็จ...",
  uploadAnotherFile: "อัปโหลดไฟล์อื่น",
  cancel: "ยกเลิก",
  expiresAfter: "หมดอายุภายใน",
  requirePassword: "ต้องใช้รหัสผ่าน",
  passwordHelp: "ป้องกันการดาวน์โหลดด้วยรหัสเข้าถึง",
  regenerateAccessCode: "สร้างรหัสเข้าถึงใหม่",
  copyAccessCode: "คัดลอกรหัสเข้าถึง",
  passwordCopied: "คัดลอกรหัสผ่านแล้ว",
  passwordCopyFailed: "คัดลอกรหัสผ่านไม่สำเร็จ",
  recipientPasswordHelp:
    "ผู้รับต้องกรอกรหัส 4 ตัวอักษรนี้เพื่อดาวน์โหลดไฟล์ที่แชร์",
  uploadFile: "อัปโหลดไฟล์",
  expiryMonthSingular: "เดือน",
  expiryMonthPlural: "เดือน",
  expiryDaySingular: "วัน",
  expiryDayPlural: "วัน",
  copied: "คัดลอกแล้ว",
  copyFailed: "คัดลอกไม่สำเร็จ",
  fileUploadedSuccessfully: "อัปโหลดไฟล์สำเร็จ",
  shareLink: "ลิงก์แชร์",
  accessCodeLabel: "รหัสเข้าถึง (ส่งให้ผู้รับ)",
  expires: "หมดอายุ",
  copiedLabel: "คัดลอกแล้ว",
  copy: "คัดลอก",
  linkCopied: "คัดลอกลิงก์แล้ว",
  labelCopied: "คัดลอก {label} แล้ว",
  fileDeleted: "ลบไฟล์แล้ว",
  deleteFileFailed: "ลบไฟล์ไม่สำเร็จ",
  noActiveFiles: "ยังไม่มีไฟล์ที่แชร์อยู่ อัปโหลดไฟล์เพื่อเริ่มต้น",
  protected: "มีการป้องกัน",
  storageQuota: "พื้นที่จัดเก็บ",
  signedInPlanLabel: "แพ็กเกจ {tier}",
  freePlanLabel: "แพ็กเกจฟรี",
  filesCountTemplate: "{current} / {max} ไฟล์",
  quotaDescriptionTemplate:
    "สูงสุด {maxFileSize} ต่อไฟล์ ไฟล์ที่หมดอายุจะถูกลบโดยอัตโนมัติ",
  secureStorage: "พื้นที่จัดเก็บปลอดภัย",
  autoExpiry: "หมดอายุอัตโนมัติ",
  passwordProtectionPro: "ป้องกันด้วยรหัสผ่าน (Pro)",
  startSharingFiles: "เริ่มแชร์ไฟล์",
  startSharingDescription:
    "เข้าสู่ระบบด้วย Google เพื่ออัปโหลดไฟล์ ปรับวันหมดอายุ และป้องกันด้วยรหัสผ่าน",
  proPlan: "แพ็กเกจ Pro",
  freePlan: "ฟรี",
  activeFilesTemplate: "{count} / {max} ไฟล์ที่กำลังแชร์",
  signOut: "ออกจากระบบ",
  activeSharedFiles: "ไฟล์ที่กำลังแชร์",
  upgradeTitle: "อัปเกรดเป็น Premium",
  upgradeDescription:
    "รับขนาดไฟล์ที่ใหญ่ขึ้น การป้องกันด้วยรหัสผ่าน และระยะเวลาเก็บไฟล์ที่นานขึ้น",
  freePlanTitle: "แพ็กเกจฟรี",
  freePlanPriceSuffix: " / ฟรีตลอดไป",
  freePlanActiveFiles: "แชร์ไฟล์พร้อมกันได้สูงสุด 3 ไฟล์",
  freePlanMaxFileSize: "สูงสุด 1 GB ต่อไฟล์",
  freePlanRetention: "เก็บไว้ 3 วัน",
  freePlanPasswordProtection: "การป้องกันด้วยรหัสผ่าน",
  freePlanAdFree: "ไม่มีโฆษณาสำหรับคุณและผู้รับ",
  currentPlan: "แพ็กเกจปัจจุบัน",
  basicAccess: "สิทธิ์ใช้งานพื้นฐาน",
  popular: "ยอดนิยม",
  premiumPlanTitle: "แพ็กเกจ Premium",
  premiumPlanPriceSuffix: " / เดือน",
  premiumActiveFiles: "แชร์ไฟล์พร้อมกันได้สูงสุด 20 ไฟล์",
  premiumMaxFileSize: "สูงสุด 5 GB ต่อไฟล์",
  premiumRetention: "เก็บได้นานสูงสุด 30 วัน",
  premiumPasswordProtection: "การป้องกันด้วยรหัสผ่าน",
  premiumCrossDeviceSync: "ซิงก์ระหว่าง Android และเว็บ",
  premiumAdFree: "ไม่มีโฆษณาสำหรับคุณและผู้รับ",
  activePremiumSubscription: "แพ็กเกจ Premium ใช้งานอยู่",
  openingPortal: "กำลังเปิดหน้าจัดการลูกค้า...",
  manageSubscription: "จัดการการสมัครสมาชิก",
  signInToGetPremium: "เข้าสู่ระบบเพื่อใช้ Premium",
  redirecting: "กำลังเปลี่ยนหน้า...",
  subscribe: "สมัครสมาชิก",
  subscriptionNote:
    "การสมัครสมาชิกเชื่อมกับบัญชี Google และซิงก์อัตโนมัติระหว่าง Quick Share บนเว็บและ Android",
  checkoutSuccessToast: "ชำระเงินสำเร็จ กำลังอัปเดตบัญชี...",
  checkoutCreatingError: "สร้างเซสชันชำระเงินไม่สำเร็จ",
  checkoutGenericError: "เริ่มการสมัครสมาชิกไม่สำเร็จ โปรดลองอีกครั้ง",
  portalAuthRequired: "เข้าสู่ระบบเพื่อจัดการการสมัครสมาชิก",
  portalLoadError: "โหลดหน้าจัดการลูกค้าไม่สำเร็จ",
  portalGenericError: "เปิดการตั้งค่าการสมัครสมาชิกไม่สำเร็จ โปรดลองอีกครั้ง",
};

export const th = {
  locale: "th",
  metadataLocale: "th_TH",
  header: {
    transfer: "ส่งไฟล์",
    lanTransfer: "ส่งไฟล์ใน LAN",
    cloudTransfer: "ส่งไฟล์ผ่านคลาวด์",
    pricing: "ราคา",
    blog: "บล็อก",
    download: "ดาวน์โหลด",
    downloadApp: "ดาวน์โหลดแอป",
    myCloudFiles: "ไฟล์บนคลาวด์",
    myFiles: "ไฟล์ของฉัน",
    signIn: "เข้าสู่ระบบ",
    signInWithGoogle: "เข้าสู่ระบบด้วย Google",
    signOut: "ออกจากระบบ",
    transferOptions: "วิธีส่งไฟล์",
    navigation: "เมนู",
    directP2PShare: "แชร์แบบ P2P โดยตรง",
    linkSharingViaCloud: "แชร์ด้วยลิงก์คลาวด์",
    toggleNavigation: "เปิดหรือปิดเมนู",
    language: { label: "ภาษา", current: "ไทย" },
  },
  home: {
    meta: {
      title: "ส่งไฟล์จากมือถือไปคอม ง่าย เร็ว ไม่ต้องใช้สาย | Quick Share",
      description:
        "ส่งไฟล์จากมือถือไปคอมผ่าน Wi-Fi โดยไม่ต้องใช้สาย Quick Share ช่วยส่งรูป วิดีโอ และเอกสารระหว่าง Android, iPhone, Windows และ Mac หรือสร้างลิงก์แชร์ให้คนที่อยู่ไกลได้",
      ogDescription:
        "ส่งรูป วิดีโอ และเอกสารระหว่างมือถือกับคอมพิวเตอร์ผ่าน Wi-Fi หรือด้วยลิงก์แชร์ที่ปลอดภัย",
      twitterDescription:
        "แชร์ไฟล์ระหว่างมือถือ คอมพิวเตอร์ และแท็บเล็ตได้อย่างรวดเร็วผ่าน Wi-Fi หรือลิงก์",
      imageAlt: "Quick Share ส่งไฟล์จากมือถือไปคอม",
    },
    nav: {
      transfer: "ส่งไฟล์",
      download: "ดาวน์โหลด",
      faq: "คำถามที่พบบ่อย",
      get: "เริ่มใช้",
    },
    hero: {
      beforeHighlight: "ส่งไฟล์จากมือถือไปคอม",
      highlight: " ได้เร็ว",
      afterHighlight: " โดยไม่ต้องใช้สาย",
      description:
        "ส่งไฟล์จากมือถือไปคอมผ่าน Wi-Fi เพื่อแชร์รูป วิดีโอ และเอกสารระหว่าง Android, iPhone, Windows และ Mac หากผู้รับอยู่ไกล ให้สร้างลิงก์ดาวน์โหลดเพื่อส่งต่อได้ทันที",
      primaryCta: "ส่งไฟล์ตอนนี้",
      demoCta: "ดูตัวอย่าง",
      animation: {
        sourceDevice: "อุปกรณ์นี้",
        recipient: "ผู้รับ",
        transferComplete: "ส่งเสร็จแล้ว",
        transferringSpeed: "กำลังส่งที่ 100 MB/s",
      },
    },
    transfer: {
      title: "เลือกวิธีส่งไฟล์ให้เหมาะกับคุณ",
      description:
        "ส่งตรงเมื่ออุปกรณ์อยู่ Wi-Fi เดียวกัน หรืออัปโหลดขึ้นคลาวด์แล้วแชร์ลิงก์เมื่อผู้รับอยู่คนละที่",
      lan: {
        title: "ส่งไฟล์ตรงผ่าน Wi-Fi",
        description:
          "ส่งรูป วิดีโอ และเอกสารระหว่างอุปกรณ์ในเครือข่ายเดียวกัน โดยไม่ต้องอัปโหลดขึ้นเซิร์ฟเวอร์",
        badges: ["เข้ารหัส", "ไม่ใช้คลาวด์"],
        cta: "ส่งผ่าน Wi-Fi",
      },
      cloud: {
        title: "แชร์ไฟล์ด้วยลิงก์",
        description:
          "อัปโหลดไฟล์แล้วสร้างลิงก์ดาวน์โหลดเพื่อส่งให้ใครก็ได้ ไม่ว่าจะอยู่ที่ไหน",
        badges: ["ลิงก์ปลอดภัย", "แชร์ระยะไกล"],
        cta: "แชร์ด้วยลิงก์",
      },
    },
    download: {
      eyebrow: "ดาวน์โหลด",
      title: "ดาวน์โหลดแอป Quick Share",
      description: "เลือกแพลตฟอร์มของคุณและเริ่มแชร์ไฟล์ได้ทันที",
      androidTitle: "Google Play",
      androidSubtitle: "Android",
      windowsTitle: "Microsoft Store",
      windowsSubtitle: "Windows",
      iosTitle: "App Store",
      iosSubtitle: "iOS",
      linuxTitle: "Snap Store",
      linuxSubtitle: "Linux",
      newBadge: "ใหม่",
      downloadAction: "ดาวน์โหลด",
      comingSoonAction: "เร็ว ๆ นี้",
    },
    gallery: [
      {
        src: "/quick_share_1.webp",
        alt: "Quick Share ค้นหาอุปกรณ์",
        title: "ค้นหาอุปกรณ์อัตโนมัติ",
        description: "ค้นหาอุปกรณ์ในเครือข่ายเดียวกันและเลือกปลายทางได้ทันที",
        icon: "smartphone",
      },
      {
        src: "/quick_share_2.webp",
        alt: "Quick Share ส่งไฟล์รวดเร็ว",
        title: "ส่งไฟล์รวดเร็ว",
        description: "ส่งรูป วิดีโอ และเอกสารผ่านเครือข่ายภายใน",
        icon: "laptop",
      },
      {
        src: "/quick_share_3.webp",
        alt: "Quick Share แชร์ไฟล์ข้ามแพลตฟอร์ม",
        title: "รองรับหลายแพลตฟอร์ม",
        description: "แชร์จากมือถือไปคอม จากคอมไปมือถือ และระหว่างอุปกรณ์อื่น ๆ",
        icon: "globe",
      },
      {
        src: "/quick_share_4.webp",
        alt: "Quick Share แชร์ไฟล์ปลอดภัย",
        title: "แชร์อย่างปลอดภัย",
        description: "เลือกส่งแบบ P2P ในเครือข่ายภายในหรือใช้ลิงก์คลาวด์ที่มีการป้องกัน",
        icon: "shield",
      },
    ],
    features: {
      title: "ทุกอย่างที่ต้องใช้สำหรับการแชร์ไฟล์",
      description:
        "ส่งไฟล์ระหว่างอุปกรณ์ได้เร็ว ใช้งานง่าย และคำนึงถึงความเป็นส่วนตัว",
      items: [
        {
          icon: "wifi",
          title: "ส่งตรงเมื่ออยู่ Wi-Fi เดียวกัน",
          description:
            "ในเครือข่ายภายใน ไฟล์จะส่งตรงระหว่างอุปกรณ์โดยไม่ต้องอัปโหลดขึ้นคลาวด์",
        },
        {
          icon: "shield",
          title: "ไฟล์ส่วนตัว ไม่ผ่านเซิร์ฟเวอร์กลาง",
          description:
            "ไฟล์จากการส่งใน LAN จะไม่ถูกเก็บบนเซิร์ฟเวอร์ภายนอก เหมาะกับรูปส่วนตัวและเอกสารงาน",
        },
        {
          icon: "smartphone",
          title: "ใช้ได้กับมือถือ คอมพิวเตอร์ และแท็บเล็ต",
          description:
            "รองรับ Android, iPhone, Windows, Mac, Linux และเบราว์เซอร์รุ่นใหม่",
        },
        {
          icon: "globe",
          title: "ใช้ได้ทันทีในเบราว์เซอร์",
          description: "ยังแชร์ไฟล์ได้แม้ในอุปกรณ์ที่ติดตั้งแอปไม่ได้",
        },
        {
          icon: "link",
          title: "ส่งไฟล์ไกล ๆ ด้วยลิงก์",
          description: "เมื่ออยู่คนละเครือข่าย ให้อัปโหลดไฟล์แล้วส่งลิงก์ดาวน์โหลด",
        },
        {
          icon: "user",
          title: "ส่งใน LAN โดยไม่ต้องสมัคร",
          description: "เริ่มส่งไฟล์ในเครือข่ายภายในได้โดยไม่ต้องสร้างบัญชี",
        },
      ],
    },
    faq: {
      title: "คำถามที่พบบ่อย",
      description:
        "คำตอบสำหรับคำถามยอดนิยมเกี่ยวกับการส่งและแชร์ไฟล์ด้วย Quick Share",
      items: [
        {
          question: "ส่งไฟล์จากมือถือไปคอมอย่างไร?",
          answer:
            "เปิด Quick Share บนมือถือและคอมพิวเตอร์ที่ต่อ Wi-Fi เดียวกัน เลือกไฟล์และเลือกอุปกรณ์ปลายทางเพื่อเริ่มส่งโดยตรง",
        },
        {
          question: "ส่งไฟล์โดยไม่ใช้อินเทอร์เน็ตได้ไหม?",
          answer:
            "ได้ การส่งใน LAN ใช้งานบน Wi-Fi หรือเครือข่ายภายในเดียวกันโดยไม่ต้องมีอินเทอร์เน็ตภายนอก หากอุปกรณ์ติดต่อกันได้",
        },
        {
          question: "ต้องติดตั้งแอปไหม?",
          answer:
            "ไม่ต้อง เวอร์ชันเว็บใช้ได้ในเบราว์เซอร์ทันที แอป Android และ Windows ช่วยให้ส่งเป็นประจำได้สะดวกขึ้น",
        },
        {
          question: "ไฟล์ถูกอัปโหลดขึ้นเซิร์ฟเวอร์หรือไม่?",
          answer:
            "ไม่ใช่สำหรับการส่งใน LAN หากต้องส่งให้คนไกล คุณสามารถใช้การส่งผ่านคลาวด์เพื่อสร้างลิงก์แชร์ได้",
        },
        {
          question: "ส่งวิดีโอหรือไฟล์ใหญ่ได้ไหม?",
          answer:
            "การส่งในเครือข่ายภายในไม่มีข้อจำกัดจากพื้นที่เซิร์ฟเวอร์ ความเร็วและความเสถียรขึ้นอยู่กับ Wi-Fi อุปกรณ์ และพื้นที่ว่าง",
        },
      ],
    },
    cta: {
      title: "แชร์ไฟล์ระหว่างมือถือกับคอมพิวเตอร์ให้ง่ายขึ้น",
      description: "ส่งรูป วิดีโอ PDF และเอกสารงานไปยังคนหรืออุปกรณ์ที่ต้องการ",
      button: "ดาวน์โหลด Quick Share",
    },
    footer: {
      tagline: "ส่งไฟล์ระหว่างมือถือและคอมพิวเตอร์ได้อย่างง่ายดาย",
      product: "ผลิตภัณฑ์",
      pricing: "ราคา",
      download: "ดาวน์โหลด",
      company: "บริษัท",
      contact: "ติดต่อเรา",
      legal: "กฎหมาย",
      privacy: "ความเป็นส่วนตัว",
      terms: "ข้อกำหนดการใช้งาน",
    },
  },
  transferLan: {
    meta: {
      title: "ส่งไฟล์ไร้สายผ่าน Wi-Fi ไม่ต้องติดตั้งแอป | Quick Share",
      description:
        "ส่งไฟล์ไร้สายระหว่างมือถือและคอมพิวเตอร์ในเครือข่ายเดียวกัน โดยไม่ต้องติดตั้งแอปหรืออัปโหลดข้อมูลขึ้นคลาวด์",
      ogDescription:
        "ส่งไฟล์ในเครือข่ายภายในผ่านเบราว์เซอร์ โดยไม่ต้องติดตั้งแอป",
    },
    backHome: "กลับหน้าหลัก",
    title: "ส่งไฟล์ไร้สาย",
    description:
      "ส่งไฟล์ไร้สายเมื่ออุปกรณ์สองเครื่องเชื่อมต่อเครือข่ายภายในเดียวกัน ไฟล์จะส่งตรงแบบ P2P และไม่ถูกอัปโหลดขึ้นคลาวด์",
    howToTitle: "วิธีส่งไฟล์ไร้สาย",
    steps: [
      {
        title: "เปิดหน้านี้บนสองอุปกรณ์",
        description:
          "หากต้องการส่งไฟล์ไร้สาย ให้เปิดหน้านี้ทั้งบนอุปกรณ์ส่งและอุปกรณ์รับ",
      },
      {
        title: "เชื่อมต่อ Wi-Fi เดียวกัน",
        description: "ระบบจะค้นหาอุปกรณ์ในเครือข่ายภายในเดียวกันโดยอัตโนมัติ",
      },
      {
        title: "เลือกไฟล์และอุปกรณ์รับ",
        description: "เลือกรูป วิดีโอ หรือเอกสาร แล้วเลือกอุปกรณ์ปลายทาง",
      },
      {
        title: "บันทึกไฟล์ที่รับ",
        description: "ยอมรับการส่งบนอีกอุปกรณ์หนึ่ง แล้วบันทึกไฟล์ไว้ในตำแหน่งที่ต้องการ",
      },
    ],
    faqTitle: "คำถามเกี่ยวกับการส่งไฟล์ไร้สาย",
    faqs: [
      {
        question: "ต้องใช้ Wi-Fi เดียวกันหรือไม่?",
        answer:
          "ใช่ สำหรับการส่งใน LAN อุปกรณ์ส่งและรับต้องเชื่อมต่อเครือข่ายภายในเดียวกัน",
      },
      {
        question: "ไฟล์ผ่านเซิร์ฟเวอร์หรือไม่?",
        answer:
          "ไม่ ไฟล์จะส่งตรงระหว่างอุปกรณ์ผ่าน WebRTC มีเพียงข้อมูลเล็กน้อยที่ใช้ตั้งค่าการเชื่อมต่อเท่านั้นที่ผ่านเซิร์ฟเวอร์",
      },
      {
        question: "ส่งไฟล์ไร้สายโดยไม่ต้องติดตั้งแอปได้ไหม?",
        answer:
          "ได้ เปิดหน้านี้บนมือถือและคอมพิวเตอร์ แล้วเชื่อมต่อทั้งสองเครื่องเข้ากับ Wi-Fi เดียวกัน",
      },
      {
        question: "จำกัดขนาดไฟล์หรือไม่?",
        answer:
          "ไม่มีข้อจำกัดจากพื้นที่เซิร์ฟเวอร์ ข้อจำกัดจริงขึ้นอยู่กับเครือข่าย ประสิทธิภาพอุปกรณ์ และพื้นที่ว่าง",
      },
    ],
    clientMessages: thLanTransferMessages,
  },
  transferCloud: {
    meta: {
      title: "ส่งไฟล์ขนาดใหญ่ด้วยลิงก์ | Quick Share",
      description:
        "ส่งไฟล์ขนาดใหญ่ด้วยการอัปโหลดไฟล์ สร้างลิงก์ดาวน์โหลดที่กำหนดวันหมดอายุได้ และเพิ่มรหัสผ่านด้วย Premium",
      ogDescription:
        "แชร์ไฟล์ขนาดใหญ่ทางออนไลน์ด้วยลิงก์ดาวน์โหลดที่ปลอดภัยและกำหนดวันหมดอายุได้",
    },
    backHome: "กลับหน้าหลัก",
    title: "ส่งไฟล์ขนาดใหญ่",
    description:
      "ส่งไฟล์ขนาดใหญ่ด้วยการอัปโหลดไฟล์และสร้างลิงก์ดาวน์โหลดเพื่อแชร์ทางอีเมลหรือแชต",
    howToTitle: "วิธีส่งไฟล์ขนาดใหญ่",
    howToDescription:
      "ลิงก์แชร์เหมาะเมื่อผู้รับไม่ได้อยู่ Wi-Fi เดียวกัน หลังอัปโหลดแล้ว ผู้รับเปิดลิงก์และดาวน์โหลดจากมือถือหรือคอมพิวเตอร์ได้",
    steps: [
      {
        title: "อัปโหลดไฟล์",
        description:
          "หากต้องส่งไฟล์ขนาดใหญ่ แพ็กเกจฟรีรองรับสูงสุด {freeMaxFileSize} ต่อไฟล์ และ Premium รองรับสูงสุด {proMaxFileSize}",
      },
      {
        title: "ตั้งวันหมดอายุและการป้องกัน",
        description:
          "เลือกระยะเวลาที่ลิงก์ใช้งานได้ และเพิ่มรหัสผ่านสำหรับดาวน์โหลดได้ด้วย Premium",
      },
      {
        title: "คัดลอกและส่งลิงก์",
        description: "คัดลอกลิงก์ดาวน์โหลด แล้วส่งผ่านอีเมล ข้อความ หรือแชต",
      },
    ],
    faqTitle: "คำถามเกี่ยวกับการส่งไฟล์ขนาดใหญ่",
    faqs: [
      {
        question: "ส่งไฟล์ขนาดใหญ่ทางออนไลน์อย่างไร?",
        answer:
          "อัปโหลดไฟล์ไปยัง Quick Share แล้วส่งลิงก์ดาวน์โหลดที่สร้างขึ้นหลังอัปโหลดเสร็จให้ผู้รับ",
      },
      {
        question: "แพ็กเกจฟรีมีข้อจำกัดอะไร?",
        answer:
          "คุณแชร์ไฟล์ที่ใช้งานอยู่ได้สูงสุด {freeMaxFiles} ไฟล์ และอัปโหลดได้สูงสุด {freeMaxFileSize} ต่อไฟล์",
      },
      {
        question: "แชร์ด้วยลิงก์ปลอดภัยไหม?",
        answer:
          "ไฟล์ส่งผ่าน HTTPS และเก็บไว้บนคลาวด์ Premium ช่วยเพิ่มรหัสผ่านให้การดาวน์โหลดได้",
      },
      {
        question: "เกิดอะไรขึ้นเมื่อลิงก์หมดอายุ?",
        answer:
          "ไฟล์ที่หมดอายุจะถูกลบโดยอัตโนมัติ และเข้าถึงผ่านลิงก์เดิมไม่ได้อีก",
      },
    ],
    clientMessages: thCloudTransferMessages,
  },
} as const;
