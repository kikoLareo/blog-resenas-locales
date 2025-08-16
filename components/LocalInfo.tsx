import { 
  MapPinIcon, 
  PhoneIcon, 
  ClockIcon, 
  GlobeAltIcon
} from '@heroicons/react/24/outline';
import { Venue } from '@/lib/types';
import { MAPS_CONFIG, PRICE_RANGES } from '@/lib/constants';

interface LocalInfoProps {
  venue: Venue;
  className?: string;
  showMap?: boolean;
  compact?: boolean;
}

export default function LocalInfo({
  venue,
  className = '',
  showMap = true,
  compact = false,
}: LocalInfoProps) {
  // Format opening hours for display
  const formatOpeningHours = (hours: string[]): { [key: string]: string } => {
    const daysMap: { [key: string]: string } = {
      'Monday': 'Lunes',
      'Tuesday': 'Martes', 
      'Wednesday': 'Miércoles',
      'Thursday': 'Jueves',
      'Friday': 'Viernes',
      'Saturday': 'Sábado',
      'Sunday': 'Domingo',
    };

    const formatted: { [key: string]: string } = {};
    
    hours.forEach(hour => {
      const [day, time] = hour.split(' ');
      formatted[daysMap[day] || day] = time || 'Cerrado';
    });

    return formatted;
  };

  // Get current day status
  const getCurrentDayStatus = (): { isOpen: boolean; nextChange?: string } => {
    // const now = new Date();

    // This is a simplified version - in production you'd want more robust logic
    return { isOpen: true }; // Placeholder
  };

  const { isOpen } = getCurrentDayStatus();

  // Generate Local Business JSON-LD
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': venue.schemaType,
    name: venue.title,
    address: {
      '@type': 'PostalAddress',
      streetAddress: venue.address,
      postalCode: venue.postalCode,
      addressLocality: venue.city.title,
      addressRegion: venue.city.region,
      addressCountry: 'ES',
    },
    ...(venue.phone && { telephone: venue.phone }),
    ...(venue.website && { url: venue.website }),
    ...(venue.geo && {
      geo: {
        '@type': 'GeoCoordinates',
        latitude: venue.geo.lat,
        longitude: venue.geo.lng,
      },
    }),
    ...(venue.openingHours && {
      openingHours: venue.openingHours,
    }),
    priceRange: venue.priceRange,
    ...(venue.social && {
      sameAs: Object.values(venue.social).filter(Boolean),
    }),
  };

  // Generate Google Maps embed URL
  const getMapEmbedUrl = () => {
    if (!venue.geo) return null;
    
    const { lat, lng } = venue.geo;
    const encodedName = encodeURIComponent(venue.title);
    const encodedAddress = encodeURIComponent(venue.address);
    
    return `https://www.google.com/maps/embed/v1/place?key=${MAPS_CONFIG.googleMapsKey}&q=${encodedName},${encodedAddress}&center=${lat},${lng}&zoom=15`;
  };

  const mapUrl = getMapEmbedUrl();

  if (compact) {
    return (
      <div className={`local-info-compact ${className}`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        
        <div className="space-y-3">
          {/* Address */}
          <div className="flex items-start space-x-2">
            <MapPinIcon className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="text-gray-900 font-medium">{venue.address}</p>
              <p className="text-gray-600">{venue.city.title}</p>
            </div>
          </div>

          {/* Phone */}
          {venue.phone && (
            <div className="flex items-center space-x-2">
              <PhoneIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <a
                href={`tel:${venue.phone}`}
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                {venue.phone}
              </a>
            </div>
          )}

          {/* Status */}
          <div className="flex items-center space-x-2">
            <ClockIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span className={`text-sm font-medium ${
              isOpen ? 'text-green-600' : 'text-red-600'
            }`}>
              {isOpen ? 'Abierto ahora' : 'Cerrado'}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className={`local-info ${className}`} itemScope itemType={`https://schema.org/${venue.schemaType}`}>
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Información del Local
            </h2>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              isOpen 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {isOpen ? '🟢 Abierto' : '🔴 Cerrado'}
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Address */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-900 flex items-center">
                <MapPinIcon className="w-4 h-4 mr-2 text-gray-400" />
                Dirección
              </h3>
              <div className="pl-6">
                <p className="text-gray-900 font-medium" itemProp="streetAddress">
                  {venue.address}
                </p>
                <p className="text-gray-600">
                  <span itemProp="postalCode">{venue.postalCode}</span>{' '}
                  <span itemProp="addressLocality">{venue.city.title}</span>
                </p>
                
                {/* Directions Link */}
                {venue.geo && (
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${venue.geo.lat},${venue.geo.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center mt-2 text-sm text-primary-600 hover:text-primary-700"
                  >
                    Cómo llegar
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                )}
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-900">Contacto</h3>
              <div className="space-y-2">
                {/* Phone */}
                {venue.phone && (
                  <div className="flex items-center space-x-2">
                    <PhoneIcon className="w-4 h-4 text-gray-400" />
                    <a
                      href={`tel:${venue.phone}`}
                      className="text-primary-600 hover:text-primary-700"
                      itemProp="telephone"
                    >
                      {venue.phone}
                    </a>
                  </div>
                )}

                {/* Website */}
                {venue.website && (
                  <div className="flex items-center space-x-2">
                    <GlobeAltIcon className="w-4 h-4 text-gray-400" />
                    <a
                      href={venue.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-700"
                      itemProp="url"
                    >
                      Sitio web
                      <svg className="w-3 h-3 ml-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                )}

                {/* Price Range */}
                <div className="flex items-center space-x-2">
                  <span className="text-gray-400">💰</span>
                  <span className="text-gray-900" itemProp="priceRange">
                    {PRICE_RANGES[venue.priceRange]}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Opening Hours */}
          {venue.openingHours && venue.openingHours.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-900 flex items-center">
                <ClockIcon className="w-4 h-4 mr-2 text-gray-400" />
                Horarios
              </h3>
              <div className="pl-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {Object.entries(formatOpeningHours(venue.openingHours)).map(([day, hours]) => (
                    <div key={day} className="flex justify-between items-center py-1">
                      <span className="text-gray-600 text-sm">{day}</span>
                      <span className="text-gray-900 text-sm font-medium">{hours}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Social Media */}
          {venue.social && Object.keys(venue.social).length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-900">Redes Sociales</h3>
              <div className="flex space-x-4">
                {venue.social.instagram && (
                  <a
                    href={venue.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-pink-600 hover:text-pink-700"
                    aria-label="Instagram"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.004 5.367 18.637.001 12.017.001zm0 21.986c-5.523 0-9.999-4.476-9.999-9.999 0-5.523 4.476-9.999 9.999-9.999s9.999 4.476 9.999 9.999c0 5.523-4.476 9.999-9.999 9.999z"/>
                    </svg>
                  </a>
                )}
                {venue.social.facebook && (
                  <a
                    href={venue.social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700"
                    aria-label="Facebook"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Map */}
          {showMap && mapUrl && MAPS_CONFIG.googleMapsKey && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-900">Ubicación</h3>
              <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
                <iframe
                  src={mapUrl}
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`Mapa de ${venue.title}`}
                  className="rounded-lg"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// Quick info card for venue listings
export function QuickLocalInfo({ venue, className = '' }: { venue: Venue; className?: string }) {
  return (
    <div className={`quick-local-info bg-gray-50 rounded-lg p-4 ${className}`}>
      <div className="space-y-2">
        {/* Address */}
        <div className="flex items-start space-x-2">
          <MapPinIcon className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-gray-700">
            {venue.address}, {venue.city.title}
          </div>
        </div>

        {/* Price & Phone */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-900 font-medium">
            {PRICE_RANGES[venue.priceRange]}
          </span>
          {venue.phone && (
            <a
              href={`tel:${venue.phone}`}
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              Llamar
            </a>
          )}
        </div>
      </div>
    </div>
  );
}