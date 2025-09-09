import { FAQ } from './types';

/**
 * Voice Search Optimized FAQ Data for Answer Engine Optimization
 * Optimized for conversational queries, featured snippets, and "People Also Ask" sections
 */

// General Restaurant FAQs - Voice Search Optimized
export const generalRestaurantFAQs: FAQ[] = [
  {
    question: '¿Cómo puedo hacer una reserva en un restaurante?',
    answer: 'Para hacer una reserva, puedes llamar directamente al restaurante, usar su página web si tienen sistema de reservas online, o utilizar aplicaciones como OpenTable o ElTenedor. Te recomendamos reservar con antelación, especialmente los fines de semana.',
  },
  {
    question: '¿Qué significa cada símbolo de precio en los restaurantes?',
    answer: 'Los símbolos de precio indican el rango de precios: € (económico, menos de 20€ por persona), €€ (moderado, 20-40€), €€€ (caro, 40-80€), y €€€€ (muy caro, más de 80€ por persona). Estos precios incluyen entrante, plato principal y postre.',
  },
  {
    question: '¿Cuáles son los horarios típicos de los restaurantes en España?',
    answer: 'Los restaurantes en España suelen abrir para el almuerzo de 13:30 a 16:00 y para la cena de 20:30 a 23:30. Los horarios pueden variar según la región y el tipo de establecimiento. Los domingos muchos restaurantes cierran por la noche.',
  },
  {
    question: '¿Cómo saber si un restaurante es apto para vegetarianos o veganos?',
    answer: 'Busca en la descripción del restaurante menciones de opciones vegetarianas o veganas. Muchos restaurantes indican claramente en su carta los platos aptos para estas dietas. También puedes llamar con antelación para confirmar las opciones disponibles.',
  },
  {
    question: '¿Qué debo hacer si tengo alergias alimentarias?',
    answer: 'Informa siempre de tus alergias al hacer la reserva y recuerda mencionarlo nuevamente al camarero. Por ley, los restaurantes deben proporcionar información sobre los 14 alérgenos principales. No dudes en preguntar sobre los ingredientes de cualquier plato.',
  },
];

// Location-based FAQs for "near me" queries
export const nearMeFAQs: FAQ[] = [
  {
    question: '¿Cómo encontrar buenos restaurantes cerca de mi ubicación?',
    answer: 'Usa aplicaciones como Google Maps, TripAdvisor o nuestra web para buscar restaurantes por ubicación. Activa la geolocalización para ver opciones cercanas con valoraciones y reseñas de otros usuarios.',
  },
  {
    question: '¿Qué restaurantes están abiertos ahora cerca de mí?',
    answer: 'Consulta Google Maps o llama directamente a los restaurantes para confirmar horarios actuales. Los horarios pueden cambiar por festivos, vacaciones o circunstancias especiales.',
  },
  {
    question: '¿Hay restaurantes con terraza cerca de mi zona?',
    answer: 'Busca en las descripciones de los restaurantes menciones de "terraza" o "patio". También puedes filtrar por esta característica en aplicaciones de búsqueda de restaurantes o preguntar al hacer la reserva.',
  },
  {
    question: '¿Qué restaurantes cerca de mí ofrecen servicio a domicilio?',
    answer: 'Consulta aplicaciones como Uber Eats, Glovo, Just Eat o Deliveroo para ver qué restaurantes entregan en tu zona. También puedes llamar directamente a los restaurantes para preguntar por su servicio de delivery.',
  },
];

// Accessibility and Special Needs FAQs
export const accessibilityFAQs: FAQ[] = [
  {
    question: '¿Cómo saber si un restaurante es accesible para sillas de ruedas?',
    answer: 'Busca información sobre accesibilidad en la descripción del restaurante o llama para preguntar sobre entrada sin escalones, puertas anchas, baños adaptados y mesas accesibles. La ley exige que los locales cumplan ciertos requisitos de accesibilidad.',
  },
  {
    question: '¿Qué restaurantes admiten mascotas?',
    answer: 'Busca establecimientos que mencionen específicamente que admiten mascotas o tienen terraza pet-friendly. Siempre confirma al hacer la reserva, ya que las políticas pueden variar según el área del restaurante (interior vs terraza).',
  },
  {
    question: '¿Hay restaurantes con opciones para niños?',
    answer: 'Muchos restaurantes familiares ofrecen menús infantiles, tronas y cambiadores. Busca menciones de "family-friendly" en las reseñas o pregunta al hacer la reserva sobre las facilidades para familias con niños.',
  },
];

// Seasonal and Temporal FAQs
export const seasonalFAQs: FAQ[] = [
  {
    question: '¿Qué restaurantes tienen menú de temporada?',
    answer: 'Los restaurantes de cocina de temporada actualizan sus cartas según los productos estacionales disponibles. Busca establecimientos que mencionen "cocina de mercado" o "productos de temporada" en su descripción.',
  },
  {
    question: '¿Qué restaurantes ofrecen menús especiales para celebraciones?',
    answer: 'Muchos restaurantes preparan menús especiales para Navidad, San Valentín, Día de la Madre y otras celebraciones. Consulta sus webs o redes sociales durante estas fechas, o llama para preguntar por opciones especiales.',
  },
  {
    question: '¿Hay restaurantes abiertos los días festivos?',
    answer: 'Los horarios de festivos varían mucho entre restaurantes. Te recomendamos llamar con antelación para confirmar si estarán abiertos en días como Navidad, Año Nuevo, o festivos locales.',
  },
];

// Comparison and Decision FAQs
export const comparisonFAQs: FAQ[] = [
  {
    question: '¿Cómo elegir entre varios restaurantes similares?',
    answer: 'Compara las reseñas recientes, puntuaciones por categorías (comida, servicio, ambiente), rango de precios, y especialidades. Lee comentarios específicos sobre los platos que te interesan y considera la ubicación y facilidad de aparcamiento.',
  },
  {
    question: '¿Qué diferencia hay entre un restaurante de tapas y un bar de pinchos?',
    answer: 'Los bares de tapas suelen ofrecer raciones más variadas para compartir, mientras que los bares de pinchos se especializan en pequeñas porciones individuales servidas sobre pan. Ambos son perfectos para probar diferentes sabores.',
  },
  {
    question: '¿Cuál es la diferencia entre un menú del día y una carta?',
    answer: 'El menú del día es una opción fija con precio cerrado (generalmente más económica) que incluye primer plato, segundo plato, postre y bebida. La carta permite elegir platos individuales con precios separados y mayor variedad.',
  },
];

// Technical and Payment FAQs
export const paymentFAQs: FAQ[] = [
  {
    question: '¿Todos los restaurantes aceptan tarjeta de crédito?',
    answer: 'La mayoría de restaurantes aceptan tarjetas, pero algunos establecimientos pequeños o tradicionales pueden ser solo efectivo. Siempre es recomendable preguntar al hacer la reserva o llevar efectivo como respaldo.',
  },
  {
    question: '¿Cuánta propina se debe dejar en un restaurante?',
    answer: 'En España, la propina no es obligatoria pero se aprecia. Lo habitual es dejar entre 5-10% de la cuenta si el servicio ha sido bueno. En bares de tapas es común redondear la cuenta o dejar el cambio pequeño.',
  },
  {
    question: '¿Los restaurantes aceptan pagos móviles como Apple Pay o Google Pay?',
    answer: 'Cada vez más restaurantes aceptan pagos móviles, especialmente en ciudades grandes. Sin embargo, no es universal, por lo que es recomendable preguntar o tener alternativas de pago disponibles.',
  },
];

// City-specific FAQ generator
export function getCityFAQs(cityName: string): FAQ[] {
  return [
    {
      question: `¿Cuáles son los mejores restaurantes en ${cityName}?`,
      answer: `Los mejores restaurantes en ${cityName} varían según tus preferencias culinarias. Te recomendamos consultar nuestras reseñas más recientes, que incluyen valoraciones detalladas de comida, servicio, ambiente y relación calidad-precio para cada establecimiento.`,
    },
    {
      question: `¿Dónde comer barato en ${cityName}?`,
      answer: `En ${cityName} encontrarás opciones económicas (€) en nuestras reseñas. Busca restaurantes con menú del día, bares de tapas, o establecimientos familiares que suelen ofrecer mejor relación calidad-precio.`,
    },
    {
      question: `¿Qué restaurantes en ${cityName} tienen buenas vistas?`,
      answer: `Para restaurantes con vistas en ${cityName}, busca en nuestras reseñas menciones de "terraza", "vistas" o "panorámica". También puedes filtrar por restaurantes en zonas altas o cerca del mar si aplica a la ciudad.`,
    },
    {
      question: `¿Hay restaurantes típicos de la región en ${cityName}?`,
      answer: `Sí, en ${cityName} encontrarás restaurantes especializados en cocina local y regional. Busca en nuestras categorías por tipo de cocina o lee las reseñas que destacan platos tradicionales de la zona.`,
    },
  ];
}

// Category-specific FAQ generator
export function getCategoryFAQs(categoryName: string): FAQ[] {
  const categoryLower = categoryName.toLowerCase();
  
  return [
    {
      question: `¿Qué caracteriza a un buen restaurante de ${categoryLower}?`,
      answer: `Un buen restaurante de ${categoryLower} se distingue por la calidad de sus ingredientes, la autenticidad de sus técnicas culinarias, el conocimiento del personal sobre los platos, y el ambiente apropiado para el tipo de cocina que sirven.`,
    },
    {
      question: `¿Cuál es el rango de precios típico para restaurantes de ${categoryLower}?`,
      answer: `Los precios en restaurantes de ${categoryLower} varían ampliamente. Consulta nuestro sistema de símbolos de precio (€ a €€€€) en cada reseña para encontrar opciones que se ajusten a tu presupuesto.`,
    },
    {
      question: `¿Qué platos son imprescindibles en un restaurante de ${categoryLower}?`,
      answer: `Los platos imprescindibles varían según el establecimiento, pero en nuestras reseñas destacamos siempre las especialidades y platos más recomendables de cada restaurante de ${categoryLower}.`,
    },
  ];
}

// Venue-specific FAQ generator
export function getVenueFAQs(venueName: string, cityName: string): FAQ[] {
  return [
    {
      question: `¿Cómo llegar a ${venueName} en ${cityName}?`,
      answer: `Puedes encontrar la dirección exacta de ${venueName} en nuestra reseña, junto con información sobre transporte público cercano y opciones de aparcamiento. También puedes usar Google Maps para obtener indicaciones precisas.`,
    },
    {
      question: `¿Necesito reserva para comer en ${venueName}?`,
      answer: `Te recomendamos hacer reserva en ${venueName}, especialmente los fines de semana y días festivos. Puedes llamar al teléfono que aparece en nuestra reseña o consultar si tienen sistema de reservas online.`,
    },
    {
      question: `¿Cuáles son los horarios de ${venueName}?`,
      answer: `Los horarios de ${venueName} están incluidos en nuestra reseña. Ten en cuenta que pueden cambiar por temporadas, festivos o circunstancias especiales, por lo que recomendamos confirmar llamando antes de tu visita.`,
    },
    {
      question: `¿Qué hace especial a ${venueName} comparado con otros restaurantes?`,
      answer: `En nuestra reseña detallada de ${venueName} destacamos qué lo hace único: sus especialidades culinarias, el ambiente, el servicio, y otros aspectos que lo distinguen de otros establecimientos en ${cityName}.`,
    },
  ];
}

// Combined FAQ data export
export const voiceSearchFAQs = {
  general: generalRestaurantFAQs,
  nearMe: nearMeFAQs,
  accessibility: accessibilityFAQs,
  seasonal: seasonalFAQs,
  comparison: comparisonFAQs,
  payment: paymentFAQs,
};

/**
 * Get contextual FAQs based on page type and data
 */
export function getContextualFAQs(
  context: 'venue' | 'city' | 'category' | 'general',
  data?: { name?: string; cityName?: string }
): FAQ[] {
  switch (context) {
    case 'venue':
      if (data?.name && data?.cityName) {
        return [
          ...getVenueFAQs(data.name, data.cityName),
          ...generalRestaurantFAQs.slice(0, 3),
        ];
      }
      return generalRestaurantFAQs.slice(0, 5);
      
    case 'city':
      if (data?.name) {
        return [
          ...getCityFAQs(data.name),
          ...nearMeFAQs.slice(0, 2),
          ...accessibilityFAQs.slice(0, 2),
        ];
      }
      return [...nearMeFAQs, ...generalRestaurantFAQs.slice(0, 3)];
      
    case 'category':
      if (data?.name) {
        return [
          ...getCategoryFAQs(data.name),
          ...comparisonFAQs.slice(0, 2),
          ...generalRestaurantFAQs.slice(0, 2),
        ];
      }
      return [...comparisonFAQs, ...generalRestaurantFAQs.slice(0, 3)];
      
    case 'general':
    default:
      return [
        ...generalRestaurantFAQs,
        ...nearMeFAQs.slice(0, 2),
        ...paymentFAQs.slice(0, 2),
      ];
  }
}