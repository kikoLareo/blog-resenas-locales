import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

/**
 * GET /api/admin/settings
 * Obtiene todas las configuraciones del sitio
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const settings = await prisma.siteSetting.findMany({
      orderBy: [
        { category: 'asc' },
        { key: 'asc' }
      ]
    });

    // Agrupar settings por categoría
    const grouped = settings.reduce((acc, setting) => {
      if (!acc[setting.category]) {
        acc[setting.category] = [];
      }
      acc[setting.category].push({
        key: setting.key,
        value: setting.value,
        label: setting.label,
        type: setting.type
      });
      return acc;
    }, {} as Record<string, any[]>);

    return NextResponse.json({ settings: grouped }, { status: 200 });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: 'Error al obtener configuraciones' }, { status: 500 });
  }
}

/**
 * PUT /api/admin/settings
 * Actualiza las configuraciones del sitio
 */
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await req.json();
    const { settings } = body;

    if (!settings || typeof settings !== 'object') {
      return NextResponse.json({ error: 'Formato de datos inválido' }, { status: 400 });
    }

    // Actualizar cada configuración
    const updates = [];
    for (const [key, value] of Object.entries(settings)) {
      updates.push(
        prisma.siteSetting.upsert({
          where: { key },
          update: { 
            value: value !== null && value !== undefined ? String(value) : null,
            updatedAt: new Date()
          },
          create: {
            key,
            value: value !== null && value !== undefined ? String(value) : null,
            category: getCategoryFromKey(key),
            label: getLabelFromKey(key),
            type: getTypeFromKey(key)
          }
        })
      );
    }

    await Promise.all(updates);

    return NextResponse.json({ 
      success: true,
      message: 'Configuraciones actualizadas exitosamente' 
    }, { status: 200 });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: 'Error al actualizar configuraciones' }, { status: 500 });
  }
}

/**
 * POST /api/admin/settings/init
 * Inicializa las configuraciones por defecto
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const defaultSettings = [
      // Site
      { key: 'site.name', value: 'Blog de Reseñas Locales', category: 'site', label: 'Nombre del Sitio', type: 'string' },
      { key: 'site.url', value: 'https://example.com', category: 'site', label: 'URL del Sitio', type: 'url' },
      { key: 'site.description', value: 'Descubre los mejores restaurantes y locales', category: 'site', label: 'Descripción', type: 'string' },
      
      // SEO
      { key: 'seo.googleAnalytics', value: '', category: 'seo', label: 'Google Analytics ID', type: 'string' },
      { key: 'seo.googleVerification', value: '', category: 'seo', label: 'Google Verification', type: 'string' },
      { key: 'seo.sitemap', value: 'true', category: 'seo', label: 'Generar Sitemap', type: 'boolean' },
      { key: 'seo.robots', value: 'true', category: 'seo', label: 'Generar Robots.txt', type: 'boolean' },
      
      // Ads
      { key: 'ads.enabled', value: 'false', category: 'ads', label: 'Habilitar Anuncios', type: 'boolean' },
      { key: 'ads.provider', value: 'gam', category: 'ads', label: 'Proveedor de Anuncios', type: 'string' },
      { key: 'ads.script', value: 'https://securepubads.g.doubleclick.net/tag/js/gpt.js', category: 'ads', label: 'Script de Anuncios', type: 'url' },
      
      // Sanity
      { key: 'sanity.projectId', value: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '', category: 'sanity', label: 'Sanity Project ID', type: 'string' },
      { key: 'sanity.dataset', value: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production', category: 'sanity', label: 'Sanity Dataset', type: 'string' },
      { key: 'sanity.apiVersion', value: '2024-01-01', category: 'sanity', label: 'Sanity API Version', type: 'string' },
    ];

    const creates = defaultSettings.map(setting =>
      prisma.siteSetting.upsert({
        where: { key: setting.key },
        update: {},
        create: setting
      })
    );

    await Promise.all(creates);

    return NextResponse.json({ 
      success: true,
      message: 'Configuraciones inicializadas exitosamente' 
    }, { status: 200 });
  } catch (error) {
    console.error('Error initializing settings:', error);
    return NextResponse.json({ error: 'Error al inicializar configuraciones' }, { status: 500 });
  }
}

// Helper functions
function getCategoryFromKey(key: string): string {
  const parts = key.split('.');
  return parts[0] || 'general';
}

function getLabelFromKey(key: string): string {
  const parts = key.split('.');
  const label = parts[parts.length - 1];
  return label.charAt(0).toUpperCase() + label.slice(1);
}

function getTypeFromKey(key: string): string {
  if (key.includes('enabled') || key.includes('sitemap') || key.includes('robots')) {
    return 'boolean';
  }
  if (key.includes('url') || key.includes('script')) {
    return 'url';
  }
  return 'string';
}
