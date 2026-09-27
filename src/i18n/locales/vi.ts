import type { CloudTransferMessages } from "@/app/(en)/transfer/cloud/CloudTransferClient";
import type { LanTransferMessages } from "@/src/i18n/localized-transfer";

const viLanTransferMessages: LanTransferMessages = {
  encrypted: "Mã hóa đầu cuối",
  peerToPeer: "Truyền P2P, không lưu trên máy chủ",
  sendStepTitle: "Gửi",
  sending: "Đang gửi...",
  receiving: "Đang nhận...",
  sendFiles: "Gửi tệp",
  selectFilesAndDevice: "Chọn tệp và thiết bị nhận để bắt đầu gửi",
  selectDeviceToSend: "Chọn thiết bị để gửi đến",
  waitingForConnection: "Đang chờ kết nối...",
  linkCopied: "Đã sao chép liên kết",
  linkCopyFailed: "Không thể sao chép liên kết",
  copyLinkHelp: "Mở liên kết này trên thiết bị khác để bắt đầu truyền tệp",
  yourDevice: "Thiết bị của bạn",
  browserNotSupportedTitle: "Trình duyệt không được hỗ trợ",
  browserNotSupportedDescription:
    "Trình duyệt này không hỗ trợ WebRTC. Hãy dùng phiên bản mới của Chrome, Firefox hoặc Edge.",
  changeName: "Đổi tên",
  online: "Trực tuyến",
  connecting: "Đang kết nối",
  selectFiles: "Chọn tệp",
  dropFiles: "Thả tệp vào đây hoặc",
  clickToBrowse: "bấm để chọn",
  fileSelectedSingular: "tệp đã chọn",
  fileSelectedPlural: "tệp đã chọn",
  clearAll: "Xóa tất cả",
  selectDevice: "Chọn thiết bị",
  connectingToServer: "Đang kết nối máy chủ tín hiệu...",
  noDevicesFound: "Không tìm thấy thiết bị nào",
  openOnAnotherDevice: "Mở trang này trên thiết bị khác để bắt đầu truyền tệp.",
  unknownDevice: "Không xác định",
  sendingFiles: "Đang gửi tệp...",
  receivingFiles: "Đang nhận tệp...",
  totalProgress: "Tiến trình tổng",
};

const viCloudTransferMessages: CloudTransferMessages = {
  signInTitle: "Đăng nhập để chuyển tệp qua đám mây",
  signInDescription:
    "Đăng nhập bằng tài khoản Google để tải tệp lên, tạo liên kết chia sẻ và đồng bộ các tính năng Premium.",
  signInWithGoogle: "Đăng nhập bằng Google",
  passwordProToast: "Bảo vệ bằng mật khẩu là tính năng Pro. Đang mở thông tin Premium.",
  expiryProToast: "Thời hạn 7, 14 và 30 ngày là tính năng Pro. Đang mở thông tin Premium.",
  fileTooLarge: "Tệp quá lớn.",
  unsupportedExecutableFile:
    "Không hỗ trợ tệp thực thi và tập lệnh. Để bảo vệ người tải xuống, Quick Share không cho phép chia sẻ trình cài đặt, tệp thực thi hoặc tập lệnh.",
  tierAllowsUpTo: "Gói {tier} hỗ trợ tệp tối đa {size}.",
  pleaseSignInToast: "Hãy đăng nhập bằng Google để bắt đầu tải lên.",
  signInFailedToast: "Đăng nhập không thành công",
  authRequiredToast: "Bạn cần đăng nhập để tải tệp lên",
  freeLimitsResetToast:
    "Gói miễn phí chỉ hỗ trợ thời hạn 3 ngày và không có mật khẩu. Các tùy chọn sẽ được đặt lại để hoàn tất tải lên.",
  uploadInitFailed: "Không thể chuẩn bị tải lên",
  uploadCompleteFailed: "Không thể hoàn tất tải lên",
  uploadSuccessToast: "Đã tải tệp lên thành công",
  uploadFailed: "Tải tệp lên không thành công",
  fileLimitReached: "Đã đạt giới hạn số tệp",
  fileLimitReachedDetails: "Đã đạt giới hạn số tệp. Đang mở thông tin Premium.",
  dropFileOrClick: "Thả tệp vào đây hoặc bấm để chọn",
  upToPerFile: "Tối đa {size} mỗi tệp",
  deleteFilesToUploadMore: "Xóa các tệp hiện có để tải thêm (tối đa {maxFiles} tệp)",
  preparingUpload: "Đang chuẩn bị tải lên...",
  uploading: "Đang tải lên...",
  finalizing: "Đang hoàn tất...",
  uploadAnotherFile: "Tải tệp khác lên",
  cancel: "Hủy",
  expiresAfter: "Hết hạn sau",
  requirePassword: "Yêu cầu mật khẩu",
  passwordHelp: "Bảo vệ lượt tải xuống bằng mã truy cập",
  regenerateAccessCode: "Tạo lại mã truy cập",
  copyAccessCode: "Sao chép mã truy cập",
  passwordCopied: "Đã sao chép mật khẩu",
  passwordCopyFailed: "Không thể sao chép mật khẩu",
  recipientPasswordHelp:
    "Người nhận phải nhập mã gồm 4 ký tự này để tải tệp được chia sẻ.",
  uploadFile: "Tải tệp lên",
  expiryMonthSingular: "tháng",
  expiryMonthPlural: "tháng",
  expiryDaySingular: "ngày",
  expiryDayPlural: "ngày",
  copied: "Đã sao chép",
  copyFailed: "Sao chép không thành công",
  fileUploadedSuccessfully: "Đã tải tệp lên thành công",
  shareLink: "Liên kết chia sẻ",
  accessCodeLabel: "Mã truy cập (gửi cho người nhận)",
  expires: "Hết hạn",
  copiedLabel: "Đã sao chép",
  copy: "Sao chép",
  linkCopied: "Đã sao chép liên kết",
  labelCopied: "Đã sao chép {label}",
  fileDeleted: "Đã xóa tệp",
  deleteFileFailed: "Không thể xóa tệp",
  noActiveFiles: "Chưa có tệp đang chia sẻ. Hãy tải tệp lên để bắt đầu.",
  protected: "Đã bảo vệ",
  storageQuota: "Dung lượng lưu trữ",
  signedInPlanLabel: "Gói {tier}",
  freePlanLabel: "Gói miễn phí",
  filesCountTemplate: "{current} / {max} tệp",
  quotaDescriptionTemplate:
    "Tối đa {maxFileSize} mỗi tệp. Tệp hết hạn sẽ được xóa tự động.",
  secureStorage: "Lưu trữ an toàn",
  autoExpiry: "Tự động hết hạn",
  passwordProtectionPro: "Bảo vệ bằng mật khẩu (Pro)",
  startSharingFiles: "Bắt đầu chia sẻ tệp",
  startSharingDescription:
    "Đăng nhập bằng Google để tải tệp lên, tùy chỉnh thời hạn và dùng mật khẩu bảo vệ.",
  proPlan: "Gói Pro",
  freePlan: "Miễn phí",
  activeFilesTemplate: "{count} / {max} tệp đang chia sẻ",
  signOut: "Đăng xuất",
  activeSharedFiles: "Tệp đang chia sẻ",
  upgradeTitle: "Nâng cấp lên Premium",
  upgradeDescription:
    "Nhận dung lượng lớn hơn, bảo vệ bằng mật khẩu và thời hạn lưu trữ lâu hơn.",
  freePlanTitle: "Gói miễn phí",
  freePlanPriceSuffix: " / miễn phí mãi mãi",
  freePlanActiveFiles: "Tối đa 3 tệp đang chia sẻ",
  freePlanMaxFileSize: "Tối đa 1 GB mỗi tệp",
  freePlanRetention: "Lưu trong 3 ngày",
  freePlanPasswordProtection: "Bảo vệ bằng mật khẩu",
  freePlanAdFree: "Không quảng cáo cho bạn và người nhận",
  currentPlan: "Gói hiện tại",
  basicAccess: "Quyền truy cập cơ bản",
  popular: "Phổ biến",
  premiumPlanTitle: "Gói Premium",
  premiumPlanPriceSuffix: " / tháng",
  premiumActiveFiles: "Tối đa 20 tệp đang chia sẻ",
  premiumMaxFileSize: "Tối đa 5 GB mỗi tệp",
  premiumRetention: "Lưu tối đa 30 ngày",
  premiumPasswordProtection: "Bảo vệ bằng mật khẩu",
  premiumCrossDeviceSync: "Đồng bộ giữa Android và Web",
  premiumAdFree: "Không quảng cáo cho bạn và người nhận",
  activePremiumSubscription: "Gói Premium đang hoạt động",
  openingPortal: "Đang mở cổng khách hàng...",
  manageSubscription: "Quản lý gói đăng ký",
  signInToGetPremium: "Đăng nhập để dùng Premium",
  redirecting: "Đang chuyển hướng...",
  subscribe: "Đăng ký",
  subscriptionNote:
    "Gói đăng ký được liên kết với tài khoản Google và tự động đồng bộ giữa Quick Share Web và Android.",
  checkoutSuccessToast: "Thanh toán hoàn tất. Đang cập nhật tài khoản...",
  checkoutCreatingError: "Không thể tạo phiên thanh toán",
  checkoutGenericError: "Không thể bắt đầu đăng ký. Vui lòng thử lại.",
  portalAuthRequired: "Hãy đăng nhập để quản lý gói đăng ký.",
  portalLoadError: "Không thể tải cổng khách hàng",
  portalGenericError: "Không thể mở phần cài đặt gói đăng ký. Vui lòng thử lại.",
};

export const vi = {
  locale: "vi",
  metadataLocale: "vi_VN",
  header: {
    transfer: "Chuyển tệp",
    lanTransfer: "Chuyển tệp LAN",
    cloudTransfer: "Chuyển tệp qua đám mây",
    pricing: "Bảng giá",
    blog: "Blog",
    download: "Tải xuống",
    downloadApp: "Tải ứng dụng",
    myCloudFiles: "Tệp trên đám mây",
    myFiles: "Tệp của tôi",
    signIn: "Đăng nhập",
    signInWithGoogle: "Đăng nhập bằng Google",
    signOut: "Đăng xuất",
    transferOptions: "Cách chuyển tệp",
    navigation: "Điều hướng",
    directP2PShare: "Chia sẻ P2P trực tiếp",
    linkSharingViaCloud: "Chia sẻ bằng liên kết đám mây",
    toggleNavigation: "Mở hoặc đóng menu điều hướng",
    language: { label: "Ngôn ngữ", current: "Tiếng Việt" },
  },
  home: {
    meta: {
      title: "Chuyển file từ điện thoại sang máy tính không cần cáp | Quick Share",
      description:
        "Chuyển file từ điện thoại sang máy tính qua Wi-Fi, không cần cáp. Quick Share giúp gửi ảnh, video và tài liệu giữa Android, iPhone, Windows và Mac hoặc tạo liên kết chia sẻ.",
      ogDescription:
        "Gửi ảnh, video và tài liệu giữa điện thoại với máy tính qua Wi-Fi hoặc bằng liên kết chia sẻ an toàn.",
      twitterDescription:
        "Chia sẻ tệp nhanh giữa điện thoại, máy tính và máy tính bảng qua Wi-Fi hoặc liên kết.",
      imageAlt: "Quick Share chuyển file từ điện thoại sang máy tính",
    },
    nav: {
      transfer: "Chuyển tệp",
      download: "Tải xuống",
      faq: "Câu hỏi thường gặp",
      get: "Dùng ngay",
    },
    hero: {
      beforeHighlight: "Chuyển file từ điện thoại sang máy tính",
      highlight: " nhanh",
      afterHighlight: ", không cần cáp",
      description:
        "Chuyển file từ điện thoại sang máy tính bằng Wi-Fi để gửi ảnh, video và tài liệu giữa Android, iPhone, Windows và Mac. Khi ở xa, hãy tạo liên kết tải xuống để chia sẻ.",
      primaryCta: "Chuyển tệp ngay",
      demoCta: "Xem bản demo",
      animation: {
        sourceDevice: "Thiết bị này",
        recipient: "Người nhận",
        transferComplete: "Đã chuyển xong",
        transferringSpeed: "Đang chuyển ở 100 MB/s",
      },
    },
    transfer: {
      title: "Chọn cách gửi tệp phù hợp",
      description:
        "Gửi trực tiếp khi các thiết bị cùng Wi-Fi, hoặc tải tệp lên đám mây và chia sẻ bằng liên kết khi người nhận ở xa.",
      lan: {
        title: "Gửi tệp trực tiếp qua Wi-Fi",
        description:
          "Gửi ảnh, video và tài liệu giữa các thiết bị trong cùng mạng mà không phải tải lên máy chủ.",
        badges: ["Được mã hóa", "Không dùng đám mây"],
        cta: "Gửi qua Wi-Fi",
      },
      cloud: {
        title: "Chia sẻ tệp bằng liên kết",
        description:
          "Tải tệp lên và tạo liên kết tải xuống để gửi cho bất kỳ ai, dù họ ở đâu.",
        badges: ["Liên kết an toàn", "Chia sẻ từ xa"],
        cta: "Chia sẻ bằng liên kết",
      },
    },
    download: {
      eyebrow: "Tải xuống",
      title: "Tải ứng dụng Quick Share",
      description: "Chọn nền tảng của bạn và bắt đầu chia sẻ tệp ngay.",
      androidTitle: "Google Play",
      androidSubtitle: "Android",
      windowsTitle: "Microsoft Store",
      windowsSubtitle: "Windows",
      iosTitle: "App Store",
      iosSubtitle: "iOS",
      linuxTitle: "Snap Store",
      linuxSubtitle: "Linux",
      newBadge: "Mới",
      downloadAction: "Tải xuống",
      comingSoonAction: "Sắp ra mắt",
    },
    gallery: [
      {
        src: "/quick_share_1.webp",
        alt: "Quick Share tìm thiết bị",
        title: "Tự động tìm thiết bị",
        description: "Tìm các thiết bị trong cùng mạng và chọn ngay nơi nhận tệp.",
        icon: "smartphone",
      },
      {
        src: "/quick_share_2.webp",
        alt: "Quick Share chuyển tệp nhanh",
        title: "Chuyển tệp nhanh",
        description: "Gửi ảnh, video và tài liệu qua mạng cục bộ.",
        icon: "laptop",
      },
      {
        src: "/quick_share_3.webp",
        alt: "Quick Share chia sẻ tệp đa nền tảng",
        title: "Dùng trên nhiều nền tảng",
        description: "Chia sẻ từ điện thoại sang máy tính, từ máy tính sang điện thoại và hơn thế nữa.",
        icon: "globe",
      },
      {
        src: "/quick_share_4.webp",
        alt: "Quick Share chia sẻ an toàn",
        title: "Chia sẻ an toàn",
        description: "Chọn truyền P2P trong mạng cục bộ hoặc liên kết đám mây được bảo vệ.",
        icon: "shield",
      },
    ],
    features: {
      title: "Mọi thứ bạn cần để chia sẻ tệp",
      description:
        "Cách chuyển tệp nhanh, dễ dùng và chú trọng quyền riêng tư giữa các thiết bị.",
      items: [
        {
          icon: "wifi",
          title: "Gửi trực tiếp trong cùng Wi-Fi",
          description:
            "Trong mạng cục bộ, tệp đi thẳng giữa các thiết bị mà không cần đưa lên đám mây.",
        },
        {
          icon: "shield",
          title: "Tệp riêng tư, không qua máy chủ trung gian",
          description:
            "Tệp LAN không được lưu trên máy chủ bên ngoài, phù hợp cho ảnh cá nhân và tài liệu công việc.",
        },
        {
          icon: "smartphone",
          title: "Giữa điện thoại, máy tính và máy tính bảng",
          description:
            "Hoạt động với Android, iPhone, Windows, Mac, Linux và các trình duyệt hiện đại.",
        },
        {
          icon: "globe",
          title: "Dùng ngay trong trình duyệt",
          description:
            "Bạn vẫn có thể chia sẻ tệp trên thiết bị không thể cài ứng dụng.",
        },
        {
          icon: "link",
          title: "Gửi tệp từ xa bằng liên kết",
          description:
            "Khi không cùng mạng, hãy tải tệp lên và gửi liên kết tải xuống.",
        },
        {
          icon: "user",
          title: "Không cần tạo tài khoản cho mạng LAN",
          description:
            "Bắt đầu gửi tệp trong mạng cục bộ mà không cần đăng ký.",
        },
      ],
    },
    faq: {
      title: "Câu hỏi thường gặp",
      description:
        "Giải đáp các câu hỏi phổ biến về chuyển tệp và chia sẻ tệp với Quick Share.",
      items: [
        {
          question: "Làm sao chuyển file từ điện thoại sang máy tính?",
          answer:
            "Mở Quick Share trên điện thoại và máy tính cùng kết nối Wi-Fi. Chọn tệp, sau đó chọn thiết bị nhận để bắt đầu gửi trực tiếp.",
        },
        {
          question: "Có thể gửi tệp khi không có Internet không?",
          answer:
            "Có. Chuyển tệp LAN hoạt động trong cùng Wi-Fi hoặc mạng cục bộ, không cần Internet bên ngoài nếu hai thiết bị kết nối được với nhau.",
        },
        {
          question: "Có cần cài ứng dụng không?",
          answer:
            "Không. Bản web hoạt động ngay trong trình duyệt. Ứng dụng Android và Windows giúp việc gửi thường xuyên thuận tiện hơn.",
        },
        {
          question: "Tệp có được tải lên máy chủ không?",
          answer:
            "Không với chuyển tệp LAN. Khi cần gửi tệp cho người ở xa, bạn có thể dùng chuyển tệp đám mây để tạo liên kết chia sẻ.",
        },
        {
          question: "Có thể gửi video hoặc tệp lớn không?",
          answer:
            "Chuyển tệp cục bộ không bị giới hạn bởi dung lượng máy chủ. Tốc độ và độ ổn định phụ thuộc vào Wi-Fi, thiết bị và dung lượng còn trống.",
        },
      ],
    },
    cta: {
      title: "Chia sẻ tệp giữa điện thoại và máy tính đơn giản hơn.",
      description:
        "Gửi ảnh, video, PDF và tài liệu công việc đến đúng người hoặc đúng thiết bị.",
      button: "Tải Quick Share",
    },
    footer: {
      tagline: "Chuyển tệp đơn giản giữa điện thoại và máy tính.",
      product: "Sản phẩm",
      pricing: "Bảng giá",
      download: "Tải xuống",
      company: "Công ty",
      contact: "Liên hệ",
      legal: "Pháp lý",
      privacy: "Quyền riêng tư",
      terms: "Điều khoản sử dụng",
    },
  },
  transferLan: {
    meta: {
      title: "Chuyển file qua Wi-Fi không cần cài ứng dụng | Quick Share",
      description:
        "Chuyển file qua Wi-Fi giữa điện thoại và máy tính trong cùng mạng, không cần cài ứng dụng hay tải dữ liệu lên đám mây.",
      ogDescription:
        "Chia sẻ tệp trong mạng cục bộ bằng trình duyệt, không cần cài ứng dụng.",
    },
    backHome: "Về trang chủ",
    title: "Chuyển file qua Wi-Fi",
    description:
      "Chuyển file qua Wi-Fi khi hai thiết bị cùng kết nối mạng cục bộ. Tệp đi trực tiếp bằng P2P và không được tải lên đám mây.",
    howToTitle: "Cách chuyển file qua Wi-Fi",
    steps: [
      {
        title: "Mở trang trên hai thiết bị",
        description:
          "Để chuyển file qua Wi-Fi, hãy mở trang này trên cả thiết bị gửi và thiết bị nhận.",
      },
      {
        title: "Kết nối cùng mạng Wi-Fi",
        description: "Các thiết bị trong cùng mạng cục bộ sẽ được phát hiện tự động.",
      },
      {
        title: "Chọn tệp và thiết bị nhận",
        description: "Chọn ảnh, video hoặc tài liệu, sau đó chọn thiết bị sẽ nhận tệp.",
      },
      {
        title: "Lưu tệp đã nhận",
        description: "Chấp nhận việc truyền trên thiết bị kia và lưu tệp vào vị trí bạn muốn.",
      },
    ],
    faqTitle: "Câu hỏi thường gặp về chuyển file qua Wi-Fi",
    faqs: [
      {
        question: "Hai thiết bị có phải dùng cùng Wi-Fi không?",
        answer:
          "Có. Để truyền tệp LAN, thiết bị gửi và nhận phải cùng một mạng cục bộ.",
      },
      {
        question: "Tệp có đi qua máy chủ không?",
        answer:
          "Không. Tệp được truyền trực tiếp giữa các thiết bị qua WebRTC. Chỉ thông tin nhỏ cần thiết để thiết lập kết nối đi qua máy chủ.",
      },
      {
        question: "Chuyển file qua Wi-Fi có cần cài ứng dụng không?",
        answer:
          "Không. Bạn có thể mở trang này trên điện thoại và máy tính, rồi kết nối cả hai vào cùng Wi-Fi.",
      },
      {
        question: "Có giới hạn dung lượng tệp không?",
        answer:
          "Không có giới hạn từ dung lượng máy chủ. Giới hạn thực tế phụ thuộc vào mạng, hiệu năng thiết bị và dung lượng còn trống.",
      },
    ],
    clientMessages: viLanTransferMessages,
  },
  transferCloud: {
    meta: {
      title: "Gửi file dung lượng lớn bằng liên kết | Quick Share",
      description:
        "Gửi file dung lượng lớn bằng cách tải lên, tạo liên kết tải xuống có thời hạn và thêm mật khẩu với Premium.",
      ogDescription:
        "Chia sẻ tệp lớn trực tuyến bằng liên kết tải xuống an toàn, có thời hạn.",
    },
    backHome: "Về trang chủ",
    title: "Gửi file dung lượng lớn",
    description:
      "Gửi file dung lượng lớn bằng cách tải tệp lên và tạo liên kết tải xuống để chia sẻ qua email hoặc ứng dụng chat.",
    howToTitle: "Cách gửi file dung lượng lớn",
    howToDescription:
      "Liên kết chia sẻ hữu ích khi người nhận không ở cùng Wi-Fi. Sau khi tải lên, họ có thể mở liên kết và tải tệp xuống từ điện thoại hoặc máy tính.",
    steps: [
      {
        title: "Tải tệp lên",
        description:
          "Để gửi file dung lượng lớn, gói miễn phí hỗ trợ tối đa {freeMaxFileSize} mỗi tệp và Premium hỗ trợ tối đa {proMaxFileSize}.",
      },
      {
        title: "Chọn thời hạn và bảo vệ",
        description:
          "Chọn thời gian liên kết còn hiệu lực. Với Premium, bạn có thể thêm mật khẩu tải xuống.",
      },
      {
        title: "Sao chép và gửi liên kết",
        description:
          "Sao chép liên kết tải xuống rồi gửi bằng email, tin nhắn hoặc ứng dụng chat.",
      },
    ],
    faqTitle: "Câu hỏi về gửi file dung lượng lớn",
    faqs: [
      {
        question: "Làm sao gửi file dung lượng lớn trực tuyến?",
        answer:
          "Tải tệp lên Quick Share, sau đó gửi liên kết tải xuống được tạo sau khi quá trình tải lên hoàn tất.",
      },
      {
        question: "Gói miễn phí có giới hạn gì?",
        answer:
          "Bạn có thể chia sẻ tối đa {freeMaxFiles} tệp đang hoạt động và tải lên tối đa {freeMaxFileSize} cho mỗi tệp.",
      },
      {
        question: "Chia sẻ bằng liên kết có an toàn không?",
        answer:
          "Tệp được truyền qua HTTPS và lưu trong đám mây. Premium cho phép bảo vệ lượt tải xuống bằng mật khẩu.",
      },
      {
        question: "Điều gì xảy ra khi liên kết hết hạn?",
        answer:
          "Tệp hết hạn sẽ được xóa tự động và không thể truy cập bằng liên kết cũ.",
      },
    ],
    clientMessages: viCloudTransferMessages,
  },
} as const;
