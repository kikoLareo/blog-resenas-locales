"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { adminSanityClient } from "@/lib/admin-sanity";
import { qrCodesListQuery } from "@/sanity/lib/queries";
import { generateUniqueCode, generateQRCode, generateQRAccessURL } from "@/lib/qr-utils";
import Link from "next/link";
import QRCodeComponent from "react-qr-code";

interface QRCode {
  _id: string;
  title: string;
  code: string;
  isActive: boolean;
  expiresAt?: string;
  maxUses?: number;
  currentUses: number;
  lastUsedAt?: string;
  description?: string;
  venue: {
    _id: string;
    title: string;
    slug: { current: string };
  };
}

export default function QRCodesPage() {
  const [qrCodes, setQrCodes] = useState<QRCode[]>([]);
  const [filteredQrCodes, setFilteredQrCodes] = useState<QRCode[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [showQRModal, setShowQRModal] = useState<string | null>(null);

  useEffect(() => {
    const fetchQRCodes = async () => {
      try {
        const data = await adminSanityClient.fetch<QRCode[]>(qrCodesListQuery);
        setQrCodes(data);
        setFilteredQrCodes(data);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchQRCodes();
  }, []);

  useEffect(() => {
    let filtered = qrCodes;

    // Filtrar por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(qrCode =>
        qrCode.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        qrCode.venue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        qrCode.code.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por estado
    if (statusFilter !== "all") {
      filtered = filtered.filter(qrCode => 
        statusFilter === "active" ? qrCode.isActive : !qrCode.isActive
      );
    }

    setFilteredQrCodes(filtered);
  }, [qrCodes, searchTerm, statusFilter]);

  const handleCreateQR = async () => {
    // Redirigir a la página de creación
    window.location.href = '/dashboard/qr-codes/new';
  };

  const handleToggleStatus = async (qrCodeId: string, currentStatus: boolean) => {
    try {
      await adminSanityClient
        .patch(qrCodeId)
        .set({ isActive: !currentStatus })
        .commit();

      // Actualizar el estado local
      setQrCodes(prev => prev.map(qr => 
        qr._id === qrCodeId ? { ...qr, isActive: !currentStatus } : qr
      ));
    } catch (error) {
    }
  };

  const handleShowQR = (code: string) => {
    setShowQRModal(code);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Códigos QR</h1>
            <p className="text-gray-600">Gestiona los códigos QR para acceso a locales</p>
          </div>
          <Button onClick={handleCreateQR} disabled>
            Crear QR
          </Button>
        </div>
        <div className="text-center py-8">
          <p className="text-gray-500">Cargando códigos QR...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Códigos QR</h1>
          <p className="text-gray-600">Gestiona los códigos QR para acceso a locales</p>
        </div>
        <Button onClick={handleCreateQR}>
          Crear QR
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Códigos QR ({filteredQrCodes.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filtros */}
          <div className="mb-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                  Buscar
                </label>
                <Input
                  id="search"
                  placeholder="Buscar por título, local o código..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                  Estado
                </label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Filtrar por estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los estados</SelectItem>
                    <SelectItem value="active">Activos</SelectItem>
                    <SelectItem value="inactive">Inactivos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {filteredQrCodes.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  {searchTerm || statusFilter !== "all" 
                    ? "No se encontraron códigos QR con los filtros aplicados" 
                    : "No hay códigos QR disponibles"}
                </p>
              </div>
            ) : (
              filteredQrCodes.map((qrCode) => (
                <div
                  key={qrCode._id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {qrCode.title}
                      </h3>
                      <span
                        className={`px-2 py-0.5 text-xs rounded-full ${
                          qrCode.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {qrCode.isActive ? "Activo" : "Inactivo"}
                      </span>
                    </div>
                    <div className="mt-0.5 text-sm text-gray-500">
                      {qrCode.venue.title} • Código: {qrCode.code}
                    </div>
                    <div className="mt-0.5 text-xs text-gray-400">
                      {qrCode.maxUses ? `${qrCode.currentUses}/${qrCode.maxUses} usos` : `${qrCode.currentUses} usos`}
                      {qrCode.lastUsedAt && ` • Último uso: ${new Date(qrCode.lastUsedAt).toLocaleDateString()}`}
                    </div>
                  </div>
                  <div className="ml-4 flex items-center space-x-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleShowQR(qrCode.code)}
                    >
                      Ver QR
                    </Button>
                    <Button
                      variant={qrCode.isActive ? "destructive" : "default"}
                      size="sm"
                      onClick={() => handleToggleStatus(qrCode._id, qrCode.isActive)}
                    >
                      {qrCode.isActive ? "Desactivar" : "Activar"}
                    </Button>
                    <Link
                      href={`/dashboard/qr-codes/${qrCode._id}`}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Editar
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modal para mostrar QR */}
      {showQRModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Código QR</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowQRModal(null)}
              >
                ✕
              </Button>
            </div>
            <div className="flex justify-center mb-4">
                              <QRCodeComponent
                value={generateQRAccessURL(showQRModal)}
                size={200}
                level="H"
              />
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">
                Escanea este código para acceder al local
              </p>
              <p className="text-xs text-gray-500 font-mono">
                {generateQRAccessURL(showQRModal)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

