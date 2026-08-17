export const translations = {
  ru: {
    location: {
      share: 'Поделиться геолокацией',
      requesting: 'Определяем местоположение...',
      sending: 'Отправляем геолокацию оператору...',
      success: 'Геолокация отправлена',
      error: 'Не удалось отправить геолокацию. Попробуйте ещё раз.',
      shared: 'Вы делитесь геолокацией с оператором',
      open2gis: 'Открыть местоположение в 2GIS',
    },

    photo: {
      select: 'Выбрать фотографию',
      send: 'Отправить фото',
      sending: 'Отправляем...',
      success: 'Фотография успешно отправлена.',
      error: 'Не удалось отправить фотографию.',
      uploaded: 'Загруженная фотография',
      preview: 'Предпросмотр фотографии',
    },

    request: {
      expired: 'Запрос истёк',
      remaining: 'Время действия',
    },

    operator: {
      request: 'Заявка',
      locationReceived: 'Геоданные получены',
      locationWaiting: 'Ожидание геоданных',
      shareData: 'Поделиться данными',
      copyLink: 'Копировать ссылку',
      photos: 'Фоторепортаж пострадавшего',
      photosWaiting: 'В ожидании загрузки фото ...',
},
  },

  kk: {
    location: {
      share: 'Геолокациямен бөлісу',
      requesting: 'Орналасқан жеріңіз анықталуда...',
      sending: 'Геолокация операторға жіберілуде...',
      success: 'Геолокация жіберілді',
      error: 'Геолокацияны жіберу мүмкін болмады. Қайталап көріңіз.',
      shared: 'Сіз операторға геолокацияңызды жіберіп жатырсыз',
      open2gis: '2GIS-та орналасқан жерді ашу',
    },

    photo: {
      select: 'Фотосуретті таңдау',
      send: 'Фотосуретті жіберу',
      sending: 'Жіберілуде...',
      success: 'Фотосурет сәтті жіберілді.',
      error: 'Фотосуретті жіберу мүмкін болмады.',
      uploaded: 'Жүктелген фотосурет',
      preview: 'Фотосуретті алдын ала қарау',
    },

    request: {
      expired: 'Сұраныс мерзімі аяқталды',
      remaining: 'Қолданылу уақыты',
    },

    operator: {
      request: 'Сұраныс',
      locationReceived: 'Геодеректер алынды',
      locationWaiting: 'Геодеректер күтілуде',
      shareData: 'Деректермен бөлісу',
      copyLink: 'Сілтемені көшіру',
      photos: 'Зардап шегушінің фотосуреттері',
      photosWaiting: 'Фотосуреттерді жүктеу күтілуде ...',
},
  },

  en: {
    location: {
      share: 'Share location',
      requesting: 'Detecting your location...',
      sending: 'Sending location to the operator...',
      success: 'Location sent',
      error: 'Failed to send location. Please try again.',
      shared: 'You are sharing your location with the operator',
      open2gis: 'Open location in 2GIS',
    },

    photo: {
      select: 'Choose a photo',
      send: 'Send photo',
      sending: 'Uploading...',
      success: 'Photo uploaded successfully.',
      error: 'Failed to upload photo.',
      uploaded: 'Uploaded photo',
      preview: 'Photo preview',
    },

    request: {
      expired: 'Request expired',
      remaining: 'Time remaining',
    },

    operator: {
      request: 'Request',
      locationReceived: 'Location data received',
      locationWaiting: 'Waiting for location data',
      shareData: 'Share data',
      copyLink: 'Copy link',
      photos: 'Victim photo report',
      photosWaiting: 'Waiting for photo upload ...',
},
  },
} as const;

export type Locale = keyof typeof translations;