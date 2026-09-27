import type { LanTransferMessages } from "@/src/i18n/localized-transfer";
import type { CloudTransferMessages } from "@/app/(en)/transfer/cloud/CloudTransferClient";

export const jaLanTransferMessages: LanTransferMessages = {
  encrypted: "エンドツーエンド暗号化",
  peerToPeer: "P2P転送・サーバー保存なし",
  sendStepTitle: "送信",
  sending: "送信中...",
  receiving: "受信中...",
  sendFiles: "ファイルを送信",
  selectFilesAndDevice: "送信するファイルと送信先デバイスを選択してください",
  selectDeviceToSend: "送信先デバイスを選択してください",
  waitingForConnection: "接続を待っています...",
  linkCopied: "リンクをコピーしました",
  linkCopyFailed: "リンクのコピーに失敗しました",
  copyLinkHelp: "このリンクを別のデバイスで開くと転送を開始できます",
  yourDevice: "このデバイス",
  browserNotSupportedTitle: "ブラウザが対応していません",
  browserNotSupportedDescription:
    "このブラウザはWebRTCに対応していません。Chrome、Firefox、Edgeなどの最新ブラウザをご利用ください。",
  changeName: "名前を変更",
  online: "オンライン",
  connecting: "接続中",
  selectFiles: "ファイルを選択",
  dropFiles: "ここにファイルをドロップ、または",
  clickToBrowse: "クリックして選択",
  fileSelectedSingular: "件のファイルを選択中",
  fileSelectedPlural: "件のファイルを選択中",
  clearAll: "すべて解除",
  selectDevice: "デバイスを選択",
  connectingToServer: "接続サーバーに接続中...",
  noDevicesFound: "デバイスが見つかりません",
  openOnAnotherDevice: "別のデバイスでこのページを開くと、ファイル転送を開始できます。",
  unknownDevice: "不明",
  sendingFiles: "ファイルを送信中...",
  receivingFiles: "ファイルを受信中...",
  totalProgress: "全体の進行状況",
};

export const jaCloudTransferMessages: CloudTransferMessages = {
  signInTitle: "クラウド転送にログイン",
  signInDescription:
    "Googleアカウントでログインすると、クラウドへのファイルアップロード、共有リンク作成、Premium機能の同期が利用できます。",
  signInWithGoogle: "Googleでログイン",
  passwordProToast: "パスワード保護はPro機能です。Premiumの詳細を表示します。",
  expiryProToast: "7日、14日、30日の有効期限はPro機能です。Premiumの詳細を表示します。",
  fileTooLarge: "ファイルサイズが大きすぎます。",
  unsupportedExecutableFile:
    "実行可能ファイルやスクリプトはアップロードできません。ダウンロードするユーザーを保護するため、Quick Share ではインストーラー、実行可能ファイル、スクリプト ファイルを共有できません。",
  tierAllowsUpTo: "{tier}では最大{size}までアップロードできます。",
  pleaseSignInToast: "アップロードを開始するにはGoogleでログインしてください。",
  signInFailedToast: "ログインに失敗しました",
  authRequiredToast: "ファイルをアップロードするには認証が必要です",
  freeLimitsResetToast:
    "無料プランでは有効期限は3日、パスワードなしのみ対応しています。アップロードを完了するため設定をリセットします。",
  uploadInitFailed: "アップロードの準備に失敗しました",
  uploadCompleteFailed: "アップロード完了処理に失敗しました",
  uploadSuccessToast: "ファイルをアップロードしました",
  uploadFailed: "アップロードに失敗しました",
  fileLimitReached: "ファイル数の上限に達しました",
  fileLimitReachedDetails: "ファイル数の上限に達しました。Premiumの詳細を表示します。",
  dropFileOrClick: "ここにファイルをドロップ、またはクリックして選択",
  upToPerFile: "1ファイル最大{size}",
  deleteFilesToUploadMore: "さらにアップロードするには既存ファイルを削除してください（最大{maxFiles}件）",
  preparingUpload: "アップロードを準備中...",
  uploading: "アップロード中...",
  finalizing: "完了処理中...",
  uploadAnotherFile: "別のファイルをアップロード",
  cancel: "キャンセル",
  expiresAfter: "有効期限",
  requirePassword: "パスワードを要求",
  passwordHelp: "アクセスコードでダウンロードを保護します",
  regenerateAccessCode: "アクセスコードを再生成",
  copyAccessCode: "アクセスコードをコピー",
  passwordCopied: "パスワードをコピーしました",
  passwordCopyFailed: "パスワードのコピーに失敗しました",
  recipientPasswordHelp: "受信者は共有ファイルをダウンロードするために、この4文字のコードを入力する必要があります。",
  uploadFile: "ファイルをアップロード",
  expiryMonthSingular: "か月",
  expiryMonthPlural: "か月",
  expiryDaySingular: "日",
  expiryDayPlural: "日",
  copied: "コピーしました",
  copyFailed: "コピーに失敗しました",
  fileUploadedSuccessfully: "ファイルのアップロードが完了しました",
  shareLink: "共有リンク",
  accessCodeLabel: "アクセスコード（受信者に共有）",
  expires: "有効期限",
  copiedLabel: "コピー済み",
  copy: "コピー",
  linkCopied: "リンクをコピーしました",
  labelCopied: "{label}をコピーしました",
  fileDeleted: "ファイルを削除しました",
  deleteFileFailed: "ファイルの削除に失敗しました",
  noActiveFiles: "共有中のファイルはありません。ファイルをアップロードして開始してください。",
  protected: "保護中",
  storageQuota: "ストレージ容量",
  signedInPlanLabel: "{tier}プラン",
  freePlanLabel: "無料プラン",
  filesCountTemplate: "{current} / {max} 件",
  quotaDescriptionTemplate: "1ファイル最大{maxFileSize}。期限切れのファイルは自動的に削除されます。",
  secureStorage: "安全なストレージ",
  autoExpiry: "自動期限切れ",
  passwordProtectionPro: "パスワード保護（Pro）",
  startSharingFiles: "ファイル共有を開始",
  startSharingDescription:
    "Googleでログインすると、ファイルのアップロード、有効期限の変更、パスワード保護を利用できます。",
  proPlan: "Proプラン",
  freePlan: "無料プラン",
  activeFilesTemplate: "{count} / {max} 件を共有中",
  signOut: "ログアウト",
  activeSharedFiles: "共有中のファイル",
  upgradeTitle: "Premiumにアップグレード",
  upgradeDescription: "より大きな容量、パスワード保護、長い有効期限を利用できます。",
  freePlanTitle: "無料プラン",
  freePlanPriceSuffix: " / ずっと無料",
  freePlanActiveFiles: "最大3件の共有ファイル",
  freePlanMaxFileSize: "1ファイル最大1 GB",
  freePlanRetention: "保存期間3日",
  freePlanPasswordProtection: "パスワード保護",
  freePlanAdFree: "あなたと受信者の広告なし体験",
  currentPlan: "現在のプラン",
  basicAccess: "基本アクセス",
  popular: "人気",
  premiumPlanTitle: "Premiumプラン",
  premiumPlanPriceSuffix: " / 月",
  premiumActiveFiles: "最大20件の共有ファイル",
  premiumMaxFileSize: "1ファイル最大5 GB",
  premiumRetention: "最大30日間保存",
  premiumPasswordProtection: "パスワード保護",
  premiumCrossDeviceSync: "デバイス間同期（Android・Web）",
  premiumAdFree: "あなたと受信者の広告なし体験",
  activePremiumSubscription: "Premiumサブスクリプション有効",
  openingPortal: "ポータルを開いています...",
  manageSubscription: "サブスクリプション管理",
  signInToGetPremium: "ログインしてPremiumを利用",
  redirecting: "リダイレクト中...",
  subscribe: "登録する",
  subscriptionNote:
    "サブスクリプション状態はGoogleアカウントに紐づき、QuickShareのWeb版とAndroid版で自動的に同期されます。",
  checkoutSuccessToast: "決済が完了しました。アカウントをアップグレードしています...",
  checkoutCreatingError: "決済セッションの作成に失敗しました",
  checkoutGenericError: "サブスクリプションの開始に失敗しました。もう一度お試しください。",
  portalAuthRequired: "サブスクリプションを管理するにはログインが必要です。",
  portalLoadError: "カスタマーポータルの読み込みに失敗しました",
  portalGenericError: "サブスクリプション設定を開けませんでした。もう一度お試しください。",
};

export const ja = {
  locale: "ja",
  metadataLocale: "ja_JP",
  header: {
    transfer: "転送",
    lanTransfer: "LAN転送",
    cloudTransfer: "クラウド転送",
    pricing: "料金",
    blog: "ブログ",
    download: "ダウンロード",
    downloadApp: "アプリをダウンロード",
    myCloudFiles: "クラウドファイル",
    myFiles: "ファイル",
    signIn: "ログイン",
    signInWithGoogle: "Googleでログイン",
    signOut: "ログアウト",
    transferOptions: "転送方法",
    navigation: "ナビゲーション",
    directP2PShare: "P2Pで直接共有",
    linkSharingViaCloud: "クラウド経由でリンク共有",
    toggleNavigation: "ナビゲーションメニューを切り替え",
    language: {
      label: "言語",
      current: "日本語",
    },
  },
  home: {
    meta: {
      title: "Quick Share - スマホ・PC間のファイル転送をかんたんに",
      description:
        "Quick Shareは、Android、Windows、iPhone、Macなどのデバイス間でファイルをすばやく共有できるファイル転送ツールです。LAN転送、クラウド共有、ブラウザ転送に対応。",
      ogDescription:
        "Android、Windows、iPhone、Mac間で使えるファイル転送ツール。LAN転送、クラウド共有、ブラウザ転送に対応。",
      twitterDescription:
        "スマホ、PC、タブレット間でファイルをすばやく共有。LAN転送とクラウド共有に対応。",
      imageAlt: "Quick Share - スマホ・PC間のファイル転送",
    },
    nav: {
      transfer: "ファイル転送",
      download: "ダウンロード",
      faq: "FAQ",
      get: "入手する",
    },
    hero: {
      beforeHighlight: "Quick Shareでスマホ・PC間の",
      highlight: "ファイル転送",
      afterHighlight: "をかんたんに",
      description:
        "Android、Windows、iPhone、Macの間で写真・動画・資料をすばやく共有。LAN転送も、リンクで送るクラウド共有も選べます。",
      primaryCta: "今すぐファイル転送",
      demoCta: "デモを見る",
      animation: {
        sourceDevice: "このデバイス",
        recipient: "受信者",
        transferComplete: "転送が完了しました",
        transferringSpeed: "100 MB/sで転送中",
      },
    },
    transfer: {
      title: "用途に合わせて選べるファイル転送",
      description:
        "同じWi-Fi内ならLAN転送。離れた相手にはクラウド共有リンク。スマホとPCの間でも、ブラウザからすぐに使えます。",
      lan: {
        title: "LANファイル転送",
        description:
          "同じネットワーク上の端末へ直接送信。写真や動画をサーバーにアップロードせずに共有できます。",
        badges: ["暗号化", "サーバー不要"],
        cta: "LAN転送を始める",
      },
      cloud: {
        title: "クラウド共有リンク",
        description:
          "同じWi-Fiにいない相手にも、リンクを送るだけでファイル共有できます。遠隔での受け渡しに便利です。",
        badges: ["安全に共有", "リンク送信"],
        cta: "クラウド転送を始める",
      },
    },
    download: {
      eyebrow: "ダウンロード",
      title: "Quick Shareアプリをダウンロード",
      description: "利用するプラットフォームを選んで、すぐにファイル共有を始められます。",
      androidTitle: "Google Play",
      androidSubtitle: "Android",
      windowsTitle: "Microsoft Store",
      windowsSubtitle: "Windows",
      iosTitle: "App Store",
      iosSubtitle: "iOS",
      linuxTitle: "Snap Store",
      linuxSubtitle: "Linux",
      newBadge: "新着",
      downloadAction: "ダウンロード",
      comingSoonAction: "近日公開",
    },
    gallery: [
      {
        src: "/quick_share_1.webp",
        alt: "Quick Shareのデバイス検出画面",
        title: "デバイス検出",
        description: "同じネットワーク上の端末を見つけて、すぐに送信先を選べます。",
        icon: "smartphone",
      },
      {
        src: "/quick_share_2.webp",
        alt: "Quick Shareのファイル転送画面",
        title: "高速ファイル転送",
        description: "写真、動画、資料などをローカルネットワーク経由で送信できます。",
        icon: "laptop",
      },
      {
        src: "/quick_share_3.webp",
        alt: "Quick Shareのクロスプラットフォーム対応",
        title: "クロスプラットフォーム",
        description: "スマホからPC、PCからスマホなど、端末をまたいだ共有に対応します。",
        icon: "globe",
      },
      {
        src: "/quick_share_4.webp",
        alt: "Quick Shareのセキュリティ保護",
        title: "安全な共有",
        description: "用途に合わせて、LAN転送とクラウド共有を選べます。",
        icon: "shield",
      },
    ],
    features: {
      title: "ファイル共有に必要な機能をまとめて",
      description: "速度、使いやすさ、プライバシーを意識したQuick Shareのファイル転送。",
      items: [
        {
          icon: "wifi",
          title: "同じWi-Fiならアップロード不要",
          description: "LAN転送では、ファイルをクラウドに預けずにデバイス間で直接送信できます。",
        },
        {
          icon: "shield",
          title: "プライバシーを重視したファイル共有",
          description:
            "ローカル転送ではファイルが外部サーバーを経由しないため、個人の写真や業務ファイルにも使いやすい設計です。",
        },
        {
          icon: "smartphone",
          title: "スマホ・PC・タブレットに対応",
          description:
            "Android、iPhone、Windows、Mac、Linuxなど、主要なデバイス間でファイル転送できます。",
        },
        {
          icon: "globe",
          title: "ブラウザからすぐに使える",
          description: "アプリを入れられない端末でも、Webブラウザからファイル共有を開始できます。",
        },
        {
          icon: "link",
          title: "離れた相手にはリンクで共有",
          description: "同じネットワークにいない相手には、クラウド転送で共有リンクを作成できます。",
        },
        {
          icon: "user",
          title: "登録なしでも始めやすい",
          description: "ローカルネットワーク内のファイル転送は、アカウント登録なしで利用できます。",
        },
      ],
    },
    faq: {
      title: "よくある質問",
      description: "Quick Shareのファイル転送について、よく検索される疑問をまとめました。",
      items: [
        {
          question: "Quick ShareはAndroidとWindowsの間で使えますか？",
          answer:
            "はい。Android、Windows、iPhone、Mac、Linuxなど、同じローカルネットワークに接続された端末間でファイル転送できます。",
        },
        {
          question: "インターネットなしでもファイル転送できますか？",
          answer:
            "LAN転送は同じWi-Fiまたはローカルネットワーク内で動作します。外部インターネットに接続できない環境でも、端末同士が同じネットワーク上にあれば利用できます。",
        },
        {
          question: "アプリのインストールは必要ですか？",
          answer:
            "Web版はブラウザから利用できます。Android版やWindows版を使うと、よりスムーズにファイル共有できます。",
        },
        {
          question: "ファイルはサーバーにアップロードされますか？",
          answer:
            "LAN転送ではファイルは外部サーバーにアップロードされません。離れた相手に共有したい場合は、クラウド転送で共有リンクを作成できます。",
        },
        {
          question: "大きい動画や資料も送れますか？",
          answer:
            "ローカル転送では人工的なファイルサイズ制限を設けていません。実際の速度や安定性はWi-Fi環境、端末性能、空き容量に左右されます。",
        },
      ],
    },
    cta: {
      title: "スマホとPCのファイル共有を、もっとシンプルに。",
      description:
        "写真、動画、PDF、仕事の資料まで。Quick Shareで必要な相手や端末へすばやく送れます。",
      button: "Quick Shareを入手",
    },
    footer: {
      tagline: "スマホ・PC間のファイル転送をかんたんに。",
      product: "製品",
      pricing: "料金",
      download: "ダウンロード",
      company: "会社",
      contact: "お問い合わせ",
      legal: "法的情報",
      privacy: "プライバシー",
      terms: "利用規約",
    },
  },
  transferLan: {
    meta: {
      title: "LANファイル転送 - Quick Share",
      description:
        "同じWi-FiまたはLAN上のデバイス間で、ファイルを直接転送できます。サーバーへのアップロード不要で、スマホとPCのファイル共有に便利です。",
      ogDescription:
        "同じネットワーク上のスマホ・PC間でファイルを直接共有。サーバーにアップロードせずに転送できます。",
    },
    backHome: "ホームに戻る",
    title: "LANファイル転送",
    description:
      "同じWi-FiまたはLAN上のデバイス間でファイルを直接転送できます。ファイルはP2Pで送信され、外部サーバーにアップロードされません。",
    howToTitle: "LAN転送の使い方",
    steps: [
      {
        title: "2台のデバイスで開く",
        description: "ファイルを送りたい端末と受け取りたい端末の両方で、このLAN転送ページを開きます。",
      },
      {
        title: "自動検出を待つ",
        description: "同じネットワーク上にあるデバイスが自動で検出され、送信先として表示されます。",
      },
      {
        title: "ファイルを選んで送信",
        description: "転送したいファイルを選択し、送信先デバイスを選んで送信を開始します。",
      },
      {
        title: "受信側で保存",
        description: "受信側のデバイスでファイルを受け取り、必要な場所に保存します。",
      },
    ],
    faqTitle: "LANファイル転送のよくある質問",
    faqs: [
      {
        question: "同じWi-FiまたはLANに接続する必要がありますか？",
        answer: "はい。LAN転送では、送信側と受信側のデバイスが同じローカルネットワークに接続されている必要があります。",
      },
      {
        question: "ファイルはサーバーを経由しますか？",
        answer: "いいえ。ファイル本体はWebRTCでデバイス間を直接転送されます。接続のための小さな情報だけがサーバーを通ります。",
      },
      {
        question: "スマホでも使えますか？",
        answer: "はい。スマホのブラウザでこのページを開けば、スマホ同士、スマホとPC、PC同士でファイル共有できます。",
      },
      {
        question: "ファイルサイズ制限はありますか？",
        answer: "LAN転送にはサーバー保存容量による制限はありません。実際の転送速度や安定性は、Wi-Fi環境や端末性能に左右されます。",
      },
    ],
    clientMessages: jaLanTransferMessages,
  },
  transferCloud: {
    meta: {
      title: "クラウドファイル転送 - Quick Share",
      description:
        "Quick Shareのクラウド転送で、ファイルをアップロードして共有リンクを作成できます。離れた相手へのファイル共有、期限付きリンク、パスワード保護に対応。",
      ogDescription:
        "離れた相手にもリンクでファイル共有。期限付きリンクとパスワード保護に対応したクラウド転送。",
    },
    backHome: "ホームに戻る",
    title: "クラウドファイル転送",
    description:
      "ファイルをアップロードして共有リンクを作成。離れた相手にもブラウザからダウンロードしてもらえます。",
    howToTitle: "Quick Shareのクラウド転送の使い方",
    howToDescription:
      "クラウド転送は、同じWi-Fiにいない相手へファイルを渡したいときに便利です。ファイルをアップロードすると共有リンクが作成され、相手はスマホやPCのブラウザからダウンロードできます。",
    steps: [
      {
        title: "ファイルを選択してアップロード",
        description:
          "無料プランでは1ファイル最大{freeMaxFileSize}、Premiumでは最大{proMaxFileSize}まで対応します。",
      },
      {
        title: "期限とパスワードを設定",
        description: "共有リンクの有効期限を設定できます。Premiumではパスワード保護も利用できます。",
      },
      {
        title: "リンクをコピーして共有",
        description: "アップロード完了後に作成される共有リンクを、メールやチャットで相手に送ります。",
      },
    ],
    faqTitle: "クラウド転送のよくある質問",
    faqs: [
      {
        question: "クラウド転送とは何ですか？",
        answer: "ファイルをクラウドにアップロードし、共有リンクを使って相手にダウンロードしてもらう機能です。",
      },
      {
        question: "無料プランの制限は？",
        answer:
          "無料ユーザーは最大{freeMaxFiles}個のアクティブファイルを共有でき、1ファイルあたり最大{freeMaxFileSize}までアップロードできます。",
      },
      {
        question: "ファイルは安全ですか？",
        answer: "ファイルはHTTPSで転送され、クラウドストレージに保存されます。Premiumではパスワード保護を追加できます。",
      },
      {
        question: "期限が切れるとどうなりますか？",
        answer: "期限切れのファイルは自動的に削除され、共有リンクからアクセスできなくなります。",
      },
    ],
    clientMessages: jaCloudTransferMessages,
  },
} as const;
