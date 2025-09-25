import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Users, Eye, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600">Métricas y estadísticas del sitio</p>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visitas Totales</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,345</div>
            <p className="text-xs text-muted-foreground">
              +20% desde el mes pasado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuarios Únicos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8,901</div>
            <p className="text-xs text-muted-foreground">
              +15% desde el mes pasado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tiempo Promedio</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2m 34s</div>
            <p className="text-xs text-muted-foreground">
              +5% desde el mes pasado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasa de Rebote</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45.2%</div>
            <p className="text-xs text-muted-foreground">
              -3% desde el mes pasado
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos y métricas detalladas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Páginas Más Visitadas</CardTitle>
            <CardDescription>
              Top 10 páginas con más tráfico
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { page: "Inicio", visits: 2345, change: "+12%" },
                { page: "Restaurantes Madrid", visits: 1890, change: "+8%" },
                { page: "Café Central", visits: 1456, change: "+15%" },
                { page: "Blog - Guía Gastronómica", visits: 1234, change: "+5%" },
                { page: "Restaurantes Barcelona", visits: 987, change: "+3%" },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-500 w-6">{index + 1}</span>
                    <span className="text-sm font-medium">{item.page}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">{item.visits.toLocaleString()}</span>
                    <span className="text-xs text-green-600">{item.change}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tráfico por Dispositivo</CardTitle>
            <CardDescription>
              Distribución del tráfico por tipo de dispositivo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { device: "Desktop", percentage: 45, visits: 5560 },
                { device: "Mobile", percentage: 42, visits: 5186 },
                { device: "Tablet", percentage: 13, visits: 1599 },
              ].map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{item.device}</span>
                    <span className="text-sm text-gray-600">{item.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {item.visits.toLocaleString()} visitas
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Configuración de Analytics */}
      <Card>
        <CardHeader>
          <CardTitle>Configuración de Analytics</CardTitle>
          <CardDescription>
            Configuración para Google Analytics y otras herramientas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h4 className="font-medium">Google Analytics 4</h4>
                <p className="text-sm text-gray-600">ID: G-XXXXXXXXXX</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-green-600">Activo</span>
                <Button variant="outline" size="sm">
                  Configurar
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h4 className="font-medium">Google Search Console</h4>
                <p className="text-sm text-gray-600">Verificación pendiente</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-yellow-600">Pendiente</span>
                <Button variant="outline" size="sm">
                  Verificar
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
