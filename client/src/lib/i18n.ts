import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// English translations
const enResources = {
  translation: {
    // App general
    appName: "National Tax Service",
    loading: "Loading...",
    error: "An error occurred",
    submit: "Submit",
    cancel: "Cancel",
    save: "Save",
    delete: "Delete",
    edit: "Edit",
    view: "View",
    download: "Download",
    noData: "No data available",
    
    // Auth
    login: "Login",
    register: "Register",
    logout: "Logout",
    username: "Username",
    password: "Password",
    confirmPassword: "Confirm Password",
    email: "Email",
    firstName: "First Name",
    lastName: "Last Name",
    taxId: "Tax ID",
    phoneNumber: "Phone Number",
    address: "Address",
    enterUsername: "Enter your username",
    enterPassword: "Enter your password",
    chooseUsername: "Choose a username",
    choosePassword: "Choose a password",
    confirmYourPassword: "Confirm your password",
    enterEmail: "Enter your email",
    enterFirstName: "Enter your first name",
    enterLastName: "Enter your last name",
    enterTaxId: "Enter your Tax ID",
    enterPhoneNumber: "Enter your phone number",
    enterAddress: "Enter your address",
    loginSuccessful: "Login Successful",
    welcomeBack: "Welcome back, {{name}}!",
    loginFailed: "Login Failed",
    registrationSuccessful: "Registration Successful",
    accountCreated: "Your account has been created successfully",
    registrationFailed: "Registration Failed",
    logoutSuccessful: "Logout Successful",
    loggedOut: "You have been logged out",
    logoutFailed: "Logout Failed",
    loginError: "Invalid username or password",
    registrationError: "Unable to register your account",
    loggingIn: "Logging in...",
    registering: "Registering...",

    // Navigation
    dashboard: "Dashboard",
    taxDocuments: "Tax Documents",
    payments: "Payments",
    inquiries: "Inquiries",
    notifications: "Notifications",
    resources: "Resources",
    faqs: "FAQs",
    taxEducation: "Tax Education",
    support: "Support",
    settings: "Settings",
    profile: "Profile",
    
    // Dashboard
    welcome: "Welcome back, {{name}}",
    taxOverview: "Here's your tax overview and recent activity",
    importantTaxDeadline: "Important Tax Deadline",
    taxDeadlineMessage: "Your annual income tax return is due in",
    fileNow: "File now",
    outstandingBalance: "Outstanding Balance",
    lastPayment: "Last Payment",
    yearToDateTaxesPaid: "Year-to-Date Taxes Paid",
    dueBy: "Due by {{date}}",
    processedOn: "Processed on {{date}}",
    acrossTaxCategories: "Across all tax categories",
    payNow: "Pay Now",
    viewReceipt: "View Receipt",
    viewDetails: "View Details",
    dueSoon: "Due soon",
    processed: "Processed",
    taxOverviewTab: "Tax Overview",
    paymentHistoryTab: "Payment History",
    documentsTab: "Documents",
    taxBreakdownByCategory: "Tax Breakdown by Category",
    recentActivities: "Recent Activities",
    viewAll: "View All",
    upcomingDeadlines: "Upcoming Deadlines",
    dueOn: "Due on",
    daysLeft: "days left",
    viewAllDeadlines: "View all deadlines",
    quickAccess: "Quick Access",
    needHelp: "Need Help?",
    contactTaxSupport: "Contact Tax Support",
    days: "days",
    amount: "Amount",
    
    // Tax Categories
    "taxCategory.income": "Income Tax",
    "taxCategory.property": "Property Tax",
    "taxCategory.vehicle": "Vehicle Tax",
    "taxCategory.other": "Other Taxes",
    
    // Document types
    documentTypes: {
      tax_return: "Tax Return",
      receipt: "Receipt",
      assessment: "Assessment",
      statement: "Statement"
    },
    
    // Footer
    footerCopyright: "National Tax Service. All rights reserved.",
    privacyPolicy: "Privacy Policy",
    termsOfService: "Terms of Service",
    accessibility: "Accessibility",
    
    // Page specific content
    noTaxDataAvailable: "No tax data available",
    noRecentActivities: "No recent activities",
    noUpcomingDeadlines: "No upcoming deadlines",
    
    // Misc
    uploadSupportingDocuments: "Upload Supporting Documents",
    maxFileSize: "Maximum file size: 5MB",
    allowedFileTypes: "Allowed file types: PDF, DOC, DOCX, JPG, PNG"
  }
};

// Russian translations
const ruResources = {
  translation: {
    // App general
    appName: "Федеральная налоговая служба",
    loading: "Загрузка...",
    error: "Произошла ошибка",
    submit: "Отправить",
    cancel: "Отмена",
    save: "Сохранить",
    delete: "Удалить",
    edit: "Редактировать",
    view: "Просмотр",
    download: "Скачать",
    noData: "Данные отсутствуют",
    
    // Auth
    login: "Вход",
    register: "Регистрация",
    logout: "Выйти",
    username: "Имя пользователя",
    password: "Пароль",
    confirmPassword: "Подтверждение пароля",
    email: "Электронная почта",
    firstName: "Имя",
    lastName: "Фамилия",
    taxId: "ИНН",
    phoneNumber: "Номер телефона",
    address: "Адрес",
    enterUsername: "Введите имя пользователя",
    enterPassword: "Введите пароль",
    chooseUsername: "Выберите имя пользователя",
    choosePassword: "Выберите пароль",
    confirmYourPassword: "Подтвердите пароль",
    enterEmail: "Введите электронную почту",
    enterFirstName: "Введите имя",
    enterLastName: "Введите фамилию",
    enterTaxId: "Введите ИНН",
    enterPhoneNumber: "Введите номер телефона",
    enterAddress: "Введите адрес",
    loginSuccessful: "Вход выполнен успешно",
    welcomeBack: "С возвращением, {{name}}!",
    loginFailed: "Ошибка входа",
    registrationSuccessful: "Регистрация завершена",
    accountCreated: "Ваша учетная запись успешно создана",
    registrationFailed: "Ошибка регистрации",
    logoutSuccessful: "Выход выполнен успешно",
    loggedOut: "Вы вышли из системы",
    logoutFailed: "Ошибка выхода",
    loginError: "Неверное имя пользователя или пароль",
    registrationError: "Не удалось зарегистрировать учетную запись",
    loggingIn: "Выполняется вход...",
    registering: "Регистрация...",
    loginWithGosuslugi: "Войти через Госуслуги",
    loginWithINN: "Войти по ИНН и паспорту",

    // Navigation
    dashboard: "Главная",
    taxDocuments: "Налоговые документы",
    payments: "Платежи",
    inquiries: "Запросы",
    notifications: "Уведомления",
    resources: "Ресурсы",
    faqs: "Частые вопросы",
    taxEducation: "Налоговое обучение",
    support: "Поддержка",
    settings: "Настройки",
    profile: "Профиль",
    
    // Dashboard
    welcome: "С возвращением, {{name}}",
    taxOverview: "Ваш налоговый обзор и последние действия",
    importantTaxDeadline: "Важный налоговый срок",
    taxDeadlineMessage: "Ваша годовая налоговая декларация должна быть подана через",
    fileNow: "Подать сейчас",
    outstandingBalance: "Задолженность",
    lastPayment: "Последний платеж",
    yearToDateTaxesPaid: "Уплаченные налоги с начала года",
    dueBy: "Срок до {{date}}",
    processedOn: "Обработано {{date}}",
    acrossTaxCategories: "По всем налоговым категориям",
    payNow: "Оплатить сейчас",
    viewReceipt: "Просмотр квитанции",
    viewDetails: "Подробности",
    dueSoon: "Скоро истекает",
    processed: "Обработано",
    taxOverviewTab: "Обзор налогов",
    paymentHistoryTab: "История платежей",
    documentsTab: "Документы",
    taxBreakdownByCategory: "Распределение налогов по категориям",
    recentActivities: "Последние действия",
    viewAll: "Просмотреть все",
    upcomingDeadlines: "Предстоящие сроки",
    dueOn: "Срок",
    daysLeft: "дней осталось",
    viewAllDeadlines: "Просмотреть все сроки",
    quickAccess: "Быстрый доступ",
    needHelp: "Нужна помощь?",
    contactTaxSupport: "Связаться с налоговой поддержкой",
    days: "дней",
    amount: "Сумма",
    
    // Tax Categories
    "taxCategory.income": "НДФЛ",
    "taxCategory.property": "Налог на имущество",
    "taxCategory.vehicle": "Транспортный налог",
    "taxCategory.other": "Другие налоги",
    "taxCategory.usn": "УСН",
    "taxCategory.vat": "НДС",
    
    // Document types
    documentTypes: {
      tax_return: "Налоговая декларация",
      receipt: "Квитанция",
      assessment: "Уведомление",
      statement: "Выписка"
    },
    
    // Footer
    footerCopyright: "Федеральная налоговая служба. Все права защищены.",
    privacyPolicy: "Политика конфиденциальности",
    termsOfService: "Условия использования",
    accessibility: "Доступность",
    
    // Page specific content
    noTaxDataAvailable: "Налоговые данные отсутствуют",
    noRecentActivities: "Нет недавних действий",
    noUpcomingDeadlines: "Нет предстоящих сроков",
    
    // Payment methods
    paymentMethods: {
      sberbank: "Сбербанк Онлайн",
      tinkoff: "Тинькофф",
      yoomoney: "ЮKassa (YooMoney)",
      qiwi: "QIWI"
    },
    
    // Misc
    uploadSupportingDocuments: "Загрузить подтверждающие документы",
    maxFileSize: "Максимальный размер файла: 5MB",
    allowedFileTypes: "Разрешенные типы файлов: PDF, DOC, DOCX, JPG, PNG",
    rubleSymbol: "₽"
  }
};

// Spanish translations
const esResources = {
  translation: {
    // App general
    appName: "Servicio Nacional de Impuestos",
    loading: "Cargando...",
    error: "Ocurrió un error",
    submit: "Enviar",
    cancel: "Cancelar",
    save: "Guardar",
    delete: "Eliminar",
    edit: "Editar",
    view: "Ver",
    download: "Descargar",
    noData: "No hay datos disponibles",
    
    // Auth
    login: "Iniciar sesión",
    register: "Registrarse",
    logout: "Cerrar sesión",
    username: "Nombre de usuario",
    password: "Contraseña",
    confirmPassword: "Confirmar contraseña",
    email: "Correo electrónico",
    firstName: "Nombre",
    lastName: "Apellido",
    taxId: "ID Fiscal",
    phoneNumber: "Número de teléfono",
    address: "Dirección",
    enterUsername: "Ingrese su nombre de usuario",
    enterPassword: "Ingrese su contraseña",
    chooseUsername: "Elija un nombre de usuario",
    choosePassword: "Elija una contraseña",
    confirmYourPassword: "Confirme su contraseña",
    enterEmail: "Ingrese su correo electrónico",
    enterFirstName: "Ingrese su nombre",
    enterLastName: "Ingrese su apellido",
    enterTaxId: "Ingrese su ID fiscal",
    enterPhoneNumber: "Ingrese su número de teléfono",
    enterAddress: "Ingrese su dirección",
    loginSuccessful: "Inicio de sesión exitoso",
    welcomeBack: "¡Bienvenido de nuevo, {{name}}!",
    loginFailed: "Error de inicio de sesión",
    registrationSuccessful: "Registro exitoso",
    accountCreated: "Su cuenta ha sido creada exitosamente",
    registrationFailed: "Error en el registro",
    logoutSuccessful: "Cierre de sesión exitoso",
    loggedOut: "Ha cerrado sesión",
    logoutFailed: "Error al cerrar sesión",
    loginError: "Nombre de usuario o contraseña inválidos",
    registrationError: "No se pudo registrar su cuenta",
    loggingIn: "Iniciando sesión...",
    registering: "Registrando...",

    // Navigation
    dashboard: "Panel",
    taxDocuments: "Documentos fiscales",
    payments: "Pagos",
    inquiries: "Consultas",
    notifications: "Notificaciones",
    resources: "Recursos",
    faqs: "Preguntas frecuentes",
    taxEducation: "Educación fiscal",
    support: "Soporte",
    settings: "Configuración",
    profile: "Perfil",
    
    // Dashboard
    welcome: "Bienvenido de nuevo, {{name}}",
    taxOverview: "Aquí está su resumen fiscal y actividad reciente",
    importantTaxDeadline: "Fecha límite fiscal importante",
    taxDeadlineMessage: "Su declaración anual de impuestos vence en",
    fileNow: "Presentar ahora",
    outstandingBalance: "Saldo pendiente",
    lastPayment: "Último pago",
    yearToDateTaxesPaid: "Impuestos pagados en el año hasta la fecha",
    dueBy: "Vence el {{date}}",
    processedOn: "Procesado el {{date}}",
    acrossTaxCategories: "En todas las categorías fiscales",
    payNow: "Pagar ahora",
    viewReceipt: "Ver recibo",
    viewDetails: "Ver detalles",
    dueSoon: "Vence pronto",
    processed: "Procesado",
    taxOverviewTab: "Resumen fiscal",
    paymentHistoryTab: "Historial de pagos",
    documentsTab: "Documentos",
    taxBreakdownByCategory: "Desglose de impuestos por categoría",
    recentActivities: "Actividades recientes",
    viewAll: "Ver todo",
    upcomingDeadlines: "Próximas fechas límite",
    dueOn: "Vence el",
    daysLeft: "días restantes",
    viewAllDeadlines: "Ver todas las fechas límite",
    quickAccess: "Acceso rápido",
    needHelp: "¿Necesita ayuda?",
    contactTaxSupport: "Contactar soporte fiscal",
    days: "días",
    amount: "Cantidad",
    
    // Tax Categories
    "taxCategory.income": "Impuesto sobre la renta",
    "taxCategory.property": "Impuesto a la propiedad",
    "taxCategory.vehicle": "Impuesto vehicular",
    "taxCategory.other": "Otros impuestos",
    
    // Document types
    documentTypes: {
      tax_return: "Declaración de impuestos",
      receipt: "Recibo",
      assessment: "Evaluación",
      statement: "Estado de cuenta"
    },
    
    // Footer
    footerCopyright: "Servicio Nacional de Impuestos. Todos los derechos reservados.",
    privacyPolicy: "Política de privacidad",
    termsOfService: "Términos de servicio",
    accessibility: "Accesibilidad",
    
    // Page specific content
    noTaxDataAvailable: "No hay datos fiscales disponibles",
    noRecentActivities: "No hay actividades recientes",
    noUpcomingDeadlines: "No hay fechas límite próximas",
    
    // Misc
    uploadSupportingDocuments: "Subir documentos de respaldo",
    maxFileSize: "Tamaño máximo de archivo: 5MB",
    allowedFileTypes: "Tipos de archivo permitidos: PDF, DOC, DOCX, JPG, PNG"
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources: {
      ru: ruResources,
      en: enResources,
      es: esResources
    },
    lng: "ru", // Default language is Russian
    fallbackLng: "ru",
    interpolation: {
      escapeValue: false // React already protects from XSS
    }
  });

export default i18n;
