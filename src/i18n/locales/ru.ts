import type { CloudTransferMessages } from "@/app/(en)/transfer/cloud/CloudTransferClient";
import type { LanTransferMessages } from "@/src/i18n/localized-transfer";

const ruLanTransferMessages: LanTransferMessages = {
  encrypted: "Сквозное шифрование",
  peerToPeer: "P2P-передача без хранения на сервере",
  sendStepTitle: "Отправить",
  sending: "Отправка...",
  receiving: "Получение...",
  sendFiles: "Отправить файлы",
  selectFilesAndDevice: "Выберите файлы и устройство получателя",
  selectDeviceToSend: "Выберите устройство для отправки",
  waitingForConnection: "Ожидание подключения...",
  linkCopied: "Ссылка скопирована",
  linkCopyFailed: "Не удалось скопировать ссылку",
  copyLinkHelp: "Откройте эту ссылку на другом устройстве, чтобы начать передачу",
  yourDevice: "Ваше устройство",
  browserNotSupportedTitle: "Браузер не поддерживается",
  browserNotSupportedDescription:
    "Этот браузер не поддерживает WebRTC. Используйте актуальную версию Chrome, Firefox или Edge.",
  changeName: "Изменить имя",
  online: "В сети",
  connecting: "Подключение",
  selectFiles: "Выбрать файлы",
  dropFiles: "Перетащите файлы сюда или",
  clickToBrowse: "нажмите, чтобы выбрать",
  fileSelectedSingular: "файл выбран",
  fileSelectedPlural: "файлов выбрано",
  clearAll: "Очистить всё",
  selectDevice: "Выберите устройство",
  connectingToServer: "Подключение к серверу сигнализации...",
  noDevicesFound: "Устройства не найдены",
  openOnAnotherDevice: "Откройте эту страницу на другом устройстве, чтобы начать передачу файлов.",
  unknownDevice: "Неизвестно",
  sendingFiles: "Отправка файлов...",
  receivingFiles: "Получение файлов...",
  totalProgress: "Общий прогресс",
};

const ruCloudTransferMessages: CloudTransferMessages = {
  signInTitle: "Войдите для облачной передачи",
  signInDescription:
    "Войдите через Google, чтобы загружать файлы, создавать ссылки и синхронизировать функции Premium.",
  signInWithGoogle: "Войти через Google",
  passwordProToast:
    "Защита паролем доступна в Pro. Открываем сведения о Premium.",
  expiryProToast:
    "Сроки хранения 7, 14 и 30 дней доступны в Pro. Открываем сведения о Premium.",
  fileTooLarge: "Файл слишком большой.",
  unsupportedExecutableFile:
    "Исполняемые файлы и скрипты не поддерживаются. Чтобы защитить получателей, Quick Share не разрешает передавать установщики, исполняемые файлы и скрипты.",
  tierAllowsUpTo: "Тариф {tier} поддерживает файлы до {size}.",
  pleaseSignInToast: "Войдите через Google, чтобы начать загрузку.",
  signInFailedToast: "Не удалось войти",
  authRequiredToast: "Для загрузки файлов требуется вход",
  freeLimitsResetToast:
    "Бесплатный тариф поддерживает только срок 3 дня и не позволяет установить пароль. Настройки будут сброшены для завершения загрузки.",
  uploadInitFailed: "Не удалось подготовить загрузку",
  uploadCompleteFailed: "Не удалось завершить загрузку",
  uploadSuccessToast: "Файл успешно загружен",
  uploadFailed: "Не удалось загрузить файл",
  fileLimitReached: "Достигнут лимит файлов",
  fileLimitReachedDetails:
    "Достигнут лимит файлов. Открываем сведения о Premium.",
  dropFileOrClick: "Перетащите файл сюда или нажмите, чтобы выбрать",
  upToPerFile: "До {size} на файл",
  deleteFilesToUploadMore:
    "Удалите существующие файлы, чтобы загрузить ещё (максимум {maxFiles})",
  preparingUpload: "Подготовка загрузки...",
  uploading: "Загрузка...",
  finalizing: "Завершение...",
  uploadAnotherFile: "Загрузить другой файл",
  cancel: "Отмена",
  expiresAfter: "Срок действия",
  requirePassword: "Требовать пароль",
  passwordHelp: "Защитите скачивание кодом доступа",
  regenerateAccessCode: "Создать новый код доступа",
  copyAccessCode: "Скопировать код доступа",
  passwordCopied: "Пароль скопирован",
  passwordCopyFailed: "Не удалось скопировать пароль",
  recipientPasswordHelp:
    "Получатель должен ввести этот 4-символьный код, чтобы скачать общий файл.",
  uploadFile: "Загрузить файл",
  expiryMonthSingular: "месяц",
  expiryMonthPlural: "месяцев",
  expiryDaySingular: "день",
  expiryDayPlural: "дней",
  copied: "Скопировано",
  copyFailed: "Не удалось скопировать",
  fileUploadedSuccessfully: "Файл успешно загружен",
  shareLink: "Ссылка для отправки",
  accessCodeLabel: "Код доступа (сообщите получателю)",
  expires: "Истекает",
  copiedLabel: "Скопировано",
  copy: "Скопировать",
  linkCopied: "Ссылка скопирована",
  labelCopied: "{label} скопировано",
  fileDeleted: "Файл удалён",
  deleteFileFailed: "Не удалось удалить файл",
  noActiveFiles: "Нет активных файлов. Загрузите файл, чтобы начать.",
  protected: "Защищено",
  storageQuota: "Место в хранилище",
  signedInPlanLabel: "Тариф {tier}",
  freePlanLabel: "Бесплатный тариф",
  filesCountTemplate: "{current} / {max} файлов",
  quotaDescriptionTemplate:
    "До {maxFileSize} на файл. Файлы с истёкшим сроком удаляются автоматически.",
  secureStorage: "Безопасное хранилище",
  autoExpiry: "Автоматическое удаление",
  passwordProtectionPro: "Защита паролем (Pro)",
  startSharingFiles: "Начать обмен файлами",
  startSharingDescription:
    "Войдите через Google, чтобы загружать файлы, настраивать срок действия и защищать их паролем.",
  proPlan: "Тариф Pro",
  freePlan: "Бесплатно",
  activeFilesTemplate: "{count} / {max} активных файлов",
  signOut: "Выйти",
  activeSharedFiles: "Активные общие файлы",
  upgradeTitle: "Перейти на Premium",
  upgradeDescription:
    "Получите больший размер файлов, защиту паролем и более долгий срок хранения.",
  freePlanTitle: "Бесплатный тариф",
  freePlanPriceSuffix: " / бесплатно навсегда",
  freePlanActiveFiles: "До 3 активных файлов",
  freePlanMaxFileSize: "До 1 ГБ на файл",
  freePlanRetention: "Хранение 3 дня",
  freePlanPasswordProtection: "Защита паролем",
  freePlanAdFree: "Без рекламы для вас и получателей",
  currentPlan: "Текущий тариф",
  basicAccess: "Базовый доступ",
  popular: "Популярный",
  premiumPlanTitle: "Тариф Premium",
  premiumPlanPriceSuffix: " / месяц",
  premiumActiveFiles: "До 20 активных файлов",
  premiumMaxFileSize: "До 5 ГБ на файл",
  premiumRetention: "Хранение до 30 дней",
  premiumPasswordProtection: "Защита паролем",
  premiumCrossDeviceSync: "Синхронизация Android и Web",
  premiumAdFree: "Без рекламы для вас и получателей",
  activePremiumSubscription: "Подписка Premium активна",
  openingPortal: "Открываем кабинет...",
  manageSubscription: "Управление подпиской",
  signInToGetPremium: "Войдите, чтобы использовать Premium",
  redirecting: "Перенаправление...",
  subscribe: "Оформить подписку",
  subscriptionNote:
    "Подписка привязана к аккаунту Google и автоматически синхронизируется между Quick Share Web и Android.",
  checkoutSuccessToast: "Оплата завершена. Обновляем аккаунт...",
  checkoutCreatingError: "Не удалось создать сессию оплаты",
  checkoutGenericError: "Не удалось начать подписку. Попробуйте ещё раз.",
  portalAuthRequired: "Войдите, чтобы управлять подпиской.",
  portalLoadError: "Не удалось загрузить кабинет клиента",
  portalGenericError:
    "Не удалось открыть настройки подписки. Попробуйте ещё раз.",
};

export const ru = {
  locale: "ru",
  metadataLocale: "ru_RU",
  header: {
    transfer: "Передача",
    lanTransfer: "Передача по LAN",
    cloudTransfer: "Облачная передача",
    pricing: "Тарифы",
    blog: "Блог",
    download: "Скачать",
    downloadApp: "Скачать приложение",
    myCloudFiles: "Файлы в облаке",
    myFiles: "Мои файлы",
    signIn: "Войти",
    signInWithGoogle: "Войти через Google",
    signOut: "Выйти",
    transferOptions: "Способы передачи",
    navigation: "Навигация",
    directP2PShare: "Прямой P2P-обмен",
    linkSharingViaCloud: "Обмен по облачной ссылке",
    toggleNavigation: "Открыть или закрыть меню",
    language: { label: "Язык", current: "Русский" },
  },
  home: {
    meta: {
      title: "Как передать файлы с телефона на компьютер без кабеля | Quick Share",
      description:
        "Передать файлы с телефона на компьютер можно по Wi-Fi без кабеля. Quick Share помогает отправлять фото, видео и документы между Android, iPhone, Windows и Mac или делиться ссылкой на скачивание.",
      ogDescription:
        "Передавайте фото, видео и документы между телефоном и компьютером по Wi-Fi или по защищённой ссылке.",
      twitterDescription:
        "Быстро обменивайтесь файлами между телефоном, компьютером и планшетом по Wi-Fi или по ссылке.",
      imageAlt: "Quick Share для передачи файлов с телефона на компьютер",
    },
    nav: {
      transfer: "Передать файлы",
      download: "Скачать",
      faq: "Вопросы и ответы",
      get: "Начать",
    },
    hero: {
      beforeHighlight: "Как ",
      highlight: "передать файлы с телефона на компьютер",
      afterHighlight: " без кабеля",
      description:
        "Передать файлы с телефона на компьютер можно через Wi-Fi: отправляйте фото, видео и документы между Android, iPhone, Windows и Mac. Для получателя в другой сети создайте ссылку на скачивание.",
      primaryCta: "Передать файлы",
      demoCta: "Смотреть демо",
      animation: {
        sourceDevice: "Это устройство",
        recipient: "Получатель",
        transferComplete: "Передача завершена",
        transferringSpeed: "Передача со скоростью 100 МБ/с",
      },
    },
    transfer: {
      title: "Выберите удобный способ обмена файлами",
      description:
        "Передавайте напрямую, когда устройства подключены к одной сети Wi-Fi, или загрузите файл в облако и поделитесь ссылкой с удалённым получателем.",
      lan: {
        title: "Прямая передача по Wi-Fi",
        description:
          "Отправляйте фото, видео и документы между устройствами в одной сети без загрузки на сервер.",
        badges: ["Шифрование", "Без облака"],
        cta: "Передать по Wi-Fi",
      },
      cloud: {
        title: "Обмен файлами по ссылке",
        description:
          "Загрузите файл и создайте ссылку на скачивание, которую можно отправить кому угодно.",
        badges: ["Защищённая ссылка", "Удалённый обмен"],
        cta: "Поделиться ссылкой",
      },
    },
    download: {
      eyebrow: "Скачать",
      title: "Скачать приложение Quick Share",
      description: "Выберите платформу и начните обмен файлами сразу.",
      androidTitle: "Google Play",
      androidSubtitle: "Android",
      windowsTitle: "Microsoft Store",
      windowsSubtitle: "Windows",
      iosTitle: "App Store",
      iosSubtitle: "iOS",
      linuxTitle: "Snap Store",
      linuxSubtitle: "Linux",
      newBadge: "Новое",
      downloadAction: "Скачать",
      comingSoonAction: "Скоро",
    },
    gallery: [
      {
        src: "/quick_share_1.webp",
        alt: "Quick Share ищет устройства",
        title: "Автоматический поиск устройств",
        description: "Находите устройства в одной сети и сразу выбирайте получателя.",
        icon: "smartphone",
      },
      {
        src: "/quick_share_2.webp",
        alt: "Быстрая передача файлов в Quick Share",
        title: "Быстрая передача",
        description: "Передавайте фото, видео и документы по локальной сети.",
        icon: "laptop",
      },
      {
        src: "/quick_share_3.webp",
        alt: "Кроссплатформенный обмен файлами Quick Share",
        title: "Работает на разных платформах",
        description: "Обменивайтесь между телефоном и компьютером, а также с другими устройствами.",
        icon: "globe",
      },
      {
        src: "/quick_share_4.webp",
        alt: "Безопасный обмен файлами Quick Share",
        title: "Безопасный обмен",
        description: "Выберите локальную P2P-передачу или защищённую облачную ссылку.",
        icon: "shield",
      },
    ],
    features: {
      title: "Всё необходимое для обмена файлами",
      description:
        "Быстрый, простой и ориентированный на приватность способ передавать файлы между устройствами.",
      items: [
        {
          icon: "wifi",
          title: "Прямой обмен в одной сети Wi-Fi",
          description:
            "В локальной сети файлы идут напрямую между устройствами без загрузки в облако.",
        },
        {
          icon: "shield",
          title: "Личные файлы без промежуточного сервера",
          description:
            "При локальном обмене файлы не хранятся на внешних серверах — это удобно для личных фото и рабочих документов.",
        },
        {
          icon: "smartphone",
          title: "Телефон, компьютер и планшет",
          description:
            "Работает на Android, iPhone, Windows, Mac, Linux и в современных браузерах.",
        },
        {
          icon: "globe",
          title: "Работает прямо в браузере",
          description:
            "Обменивайтесь файлами и на устройствах, где нельзя установить приложение.",
        },
        {
          icon: "link",
          title: "Отправляйте файлы издалека по ссылке",
          description:
            "Если вы в разных сетях, загрузите файл и отправьте ссылку на скачивание.",
        },
        {
          icon: "user",
          title: "Без регистрации для локальной передачи",
          description:
            "Начните обмен в локальной сети без создания аккаунта.",
        },
      ],
    },
    faq: {
      title: "Частые вопросы",
      description:
        "Ответы на популярные вопросы о передаче и обмене файлами в Quick Share.",
      items: [
        {
          question: "Как передать файлы с телефона на компьютер?",
          answer:
            "Откройте Quick Share на телефоне и компьютере, подключённых к одной сети Wi-Fi. Выберите файлы и устройство получателя, чтобы начать прямую передачу.",
        },
        {
          question: "Можно ли передавать файлы без интернета?",
          answer:
            "Да. Локальная передача работает в одной сети Wi-Fi или LAN и не требует внешнего интернета, если устройства могут связаться друг с другом.",
        },
        {
          question: "Нужно ли устанавливать приложение?",
          answer:
            "Нет. Веб-версия работает прямо в браузере. Приложения для Android и Windows удобны для частого использования.",
        },
        {
          question: "Файлы загружаются на сервер?",
          answer:
            "Нет, при локальной передаче. Чтобы отправить файл человеку далеко от вас, используйте облачную передачу и создайте ссылку.",
        },
        {
          question: "Можно ли передавать видео или большие файлы?",
          answer:
            "Локальная передача не ограничена размером серверного хранилища. Скорость и стабильность зависят от Wi-Fi, устройств и свободного места.",
        },
      ],
    },
    cta: {
      title: "Обмен файлами между телефоном и компьютером стал проще.",
      description:
        "Отправляйте фото, видео, PDF и рабочие документы нужному человеку или на нужное устройство.",
      button: "Скачать Quick Share",
    },
    footer: {
      tagline: "Простой обмен файлами между телефоном и компьютером.",
      product: "Продукт",
      pricing: "Тарифы",
      download: "Скачать",
      company: "Компания",
      contact: "Контакты",
      legal: "Правовая информация",
      privacy: "Конфиденциальность",
      terms: "Условия использования",
    },
  },
  transferLan: {
    meta: {
      title: "Передача файлов по Wi-Fi между телефоном и компьютером | Quick Share",
      description:
        "Передача файлов по Wi-Fi работает между телефоном и компьютером в одной сети без установки приложения и без загрузки данных в облако.",
      ogDescription:
        "Обменивайтесь файлами в локальной сети через браузер без установки приложения.",
    },
    backHome: "На главную",
    title: "Передача файлов по Wi-Fi",
    description:
      "Передача файлов по Wi-Fi работает, когда два устройства подключены к одной локальной сети. Файлы идут напрямую по P2P и не загружаются в облако.",
    howToTitle: "Как работает передача файлов по Wi-Fi",
    steps: [
      {
        title: "Откройте страницу на двух устройствах",
        description:
          "Передача файлов по Wi-Fi начинается, когда вы открываете эту страницу на устройстве отправителя и получателя.",
      },
      {
        title: "Подключитесь к одной сети Wi-Fi",
        description: "Устройства в одной локальной сети будут найдены автоматически.",
      },
      {
        title: "Выберите файл и получателя",
        description: "Выберите фото, видео или документ, затем укажите устройство получателя.",
      },
      {
        title: "Сохраните полученный файл",
        description: "Примите передачу на другом устройстве и сохраните файл в нужную папку.",
      },
    ],
    faqTitle: "Передача файлов по Wi-Fi: вопросы и ответы",
    faqs: [
      {
        question: "Нужна ли одна сеть Wi-Fi для обоих устройств?",
        answer:
          "Да. Для локальной передачи отправитель и получатель должны быть подключены к одной локальной сети.",
      },
      {
        question: "Файлы проходят через сервер?",
        answer:
          "Нет. Файлы передаются напрямую между устройствами через WebRTC. Через сервер проходит только небольшая информация, необходимая для установки соединения.",
      },
      {
        question: "Доступна ли передача файлов по Wi-Fi без приложения?",
        answer:
          "Да. Откройте эту страницу в браузере телефона и компьютера и подключите оба устройства к одной сети Wi-Fi.",
      },
      {
        question: "Есть ли ограничение на размер файла?",
        answer:
          "Нет ограничения со стороны серверного хранилища. Практический предел зависит от сети, производительности устройств и свободного места.",
      },
    ],
    clientMessages: ruLanTransferMessages,
  },
  transferCloud: {
    meta: {
      title: "Как отправить большой файл по ссылке | Quick Share",
      description:
        "Отправить большой файл можно после загрузки: создайте ссылку на скачивание со сроком действия и добавьте пароль в Premium.",
      ogDescription:
        "Делитесь большими файлами онлайн по защищённой ссылке со сроком действия.",
    },
    backHome: "На главную",
    title: "Отправить большой файл по ссылке",
    description:
      "Отправить большой файл можно, загрузив его и создав ссылку на скачивание для отправки по почте или в мессенджере.",
    howToTitle: "Как отправить большой файл",
    howToDescription:
      "Ссылка удобна, когда получатель находится не в вашей сети Wi-Fi. После загрузки её можно открыть на телефоне или компьютере и скачать файл.",
    steps: [
      {
        title: "Загрузите файл",
        description:
          "Чтобы отправить большой файл, бесплатный тариф поддерживает до {freeMaxFileSize} на файл, а Premium — до {proMaxFileSize}.",
      },
      {
        title: "Настройте срок и защиту",
        description:
          "Выберите, как долго будет работать ссылка. В Premium можно добавить пароль на скачивание.",
      },
      {
        title: "Скопируйте и отправьте ссылку",
        description:
          "Скопируйте ссылку на скачивание и отправьте её по почте, в сообщении или мессенджере.",
      },
    ],
    faqTitle: "Вопросы: как отправить большой файл",
    faqs: [
      {
        question: "Как отправить большой файл онлайн?",
        answer:
          "Загрузите файл в Quick Share и передайте получателю ссылку на скачивание, созданную после завершения загрузки.",
      },
      {
        question: "Какие ограничения есть у бесплатного тарифа?",
        answer:
          "Можно хранить до {freeMaxFiles} активных файлов и загружать до {freeMaxFileSize} на каждый файл.",
      },
      {
        question: "Безопасен ли обмен по ссылке?",
        answer:
          "Файлы передаются по HTTPS и хранятся в облаке. Premium позволяет защитить скачивание паролем.",
      },
      {
        question: "Что произойдёт после окончания срока ссылки?",
        answer:
          "Файл будет удалён автоматически и станет недоступен по прежней ссылке.",
      },
    ],
    clientMessages: ruCloudTransferMessages,
  },
} as const;
