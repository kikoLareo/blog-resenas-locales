'use client';

import { useState, useEffect } from 'react';
import { shouldShowConsentBanner, setConsent, type ConsentPreferences } from '@/lib/consent';

export default function ConsentBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    setShowBanner(shouldShowConsentBanner());
  }, []);

  const handleAcceptAll = () => {
    setConsent({
      analytics: true,
      advertising: true,
      functional: true,
    });
    setShowBanner(false);
  };

  const handleAcceptNecessary = () => {
    setConsent({
      analytics: false,
      advertising: false,
      functional: false,
    });
    setShowBanner(false);
  };

  const handleCustomize = (preferences: Partial<ConsentPreferences>) => {
    setConsent(preferences);
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="container-wide py-4">
        {!showDetails ? (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2">🍪 Configuración de Cookies</h3>
              <p className="text-sm text-gray-600">
                Utilizamos cookies para mejorar tu experiencia, mostrar anuncios personalizados y analizar el tráfico. 
                Puedes elegir qué tipos de cookies aceptar.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setShowDetails(true)}
                className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Personalizar
              </button>
              <button
                onClick={handleAcceptNecessary}
                className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Solo necesarias
              </button>
              <button
                onClick={handleAcceptAll}
                className="px-4 py-2 text-sm bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
              >
                Aceptar todas
              </button>
            </div>
          </div>
        ) : (
          <ConsentDetails 
            onSave={handleCustomize}
            onCancel={() => setShowDetails(false)}
          />
        )}
      </div>
    </div>
  );
}

interface ConsentDetailsProps {
  onSave: (preferences: Partial<ConsentPreferences>) => void;
  onCancel: () => void;
}

function ConsentDetails({ onSave, onCancel }: ConsentDetailsProps) {
  const [preferences, setPreferences] = useState({
    analytics: false,
    advertising: false,
    functional: false,
  });

  const handleSave = () => {
    onSave(preferences);
  };

  const togglePreference = (key: keyof typeof preferences) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-900">Personalizar Cookies</h3>
      
      <div className="space-y-3">
        {/* Necessary cookies */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
          <div>
            <h4 className="font-medium text-gray-900">Cookies Necesarias</h4>
            <p className="text-sm text-gray-600">Esenciales para el funcionamiento del sitio</p>
          </div>
          <div className="text-sm text-gray-500">Siempre activas</div>
        </div>

        {/* Analytics cookies */}
        <div className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
          <div>
            <h4 className="font-medium text-gray-900">Cookies de Análisis</h4>
            <p className="text-sm text-gray-600">Nos ayudan a entender cómo usas el sitio</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={preferences.analytics}
              onChange={() => togglePreference('analytics')}
              className="sr-only"
            />
            <div className={`w-11 h-6 rounded-full transition-colors ${preferences.analytics ? 'bg-primary-600' : 'bg-gray-300'}`}>
              <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${preferences.analytics ? 'translate-x-5' : 'translate-x-0'} mt-0.5 ml-0.5`} />
            </div>
          </label>
        </div>

        {/* Advertising cookies */}
        <div className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
          <div>
            <h4 className="font-medium text-gray-900">Cookies Publicitarias</h4>
            <p className="text-sm text-gray-600">Para mostrar anuncios relevantes</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={preferences.advertising}
              onChange={() => togglePreference('advertising')}
              className="sr-only"
            />
            <div className={`w-11 h-6 rounded-full transition-colors ${preferences.advertising ? 'bg-primary-600' : 'bg-gray-300'}`}>
              <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${preferences.advertising ? 'translate-x-5' : 'translate-x-0'} mt-0.5 ml-0.5`} />
            </div>
          </label>
        </div>

        {/* Functional cookies */}
        <div className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
          <div>
            <h4 className="font-medium text-gray-900">Cookies Funcionales</h4>
            <p className="text-sm text-gray-600">Mejoran la funcionalidad del sitio</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={preferences.functional}
              onChange={() => togglePreference('functional')}
              className="sr-only"
            />
            <div className={`w-11 h-6 rounded-full transition-colors ${preferences.functional ? 'bg-primary-600' : 'bg-gray-300'}`}>
              <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${preferences.functional ? 'translate-x-5' : 'translate-x-0'} mt-0.5 ml-0.5`} />
            </div>
          </label>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 text-sm bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
        >
          Guardar preferencias
        </button>
      </div>
    </div>
  );
}