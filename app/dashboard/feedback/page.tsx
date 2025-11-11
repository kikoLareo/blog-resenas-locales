"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { adminSanityClient, adminSanityWriteClient } from "@/lib/admin-sanity";
import { qrFeedbackListQuery } from "@/sanity/lib/queries";

interface Feedback {
  _id: string;
  _createdAt: string;
  venue: {
    _id: string;
    title: string;
    slug: { current: string };
    city: { title: string; slug: { current: string } };
  };
  qrCode: string;
  name: string;
  email?: string;
  phone?: string;
  visitDate: string;
  visitTime?: string;
  partySize: number;
  occasion?: string;
  specialRequests?: string;
  rating?: string; // Tipo de visitante (first-time, occasional, regular, frequent)
  feedback?: string;
  submittedAt: string;
  status: 'pending' | 'processed' | 'archived';
}

export default function FeedbackPage() {
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      const data = await adminSanityClient.fetch<Feedback[]>(qrFeedbackListQuery);
      setFeedbackList(data);
    } catch (error) {
      console.error("Error fetching feedback:", error);
      alert("Error al cargar el feedback");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (feedbackId: string, newStatus: string) => {
    try {
      await adminSanityWriteClient
        .patch(feedbackId)
        .set({ status: newStatus })
        .commit();

      // Actualizar lista local
      setFeedbackList(prevList =>
        prevList.map(item =>
          item._id === feedbackId ? { ...item, status: newStatus as Feedback['status'] } : item
        )
      );

      alert("Estado actualizado correctamente");
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Error al actualizar el estado");
    }
  };

  const handleDelete = async (feedbackId: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este feedback?")) {
      return;
    }

    try {
      await adminSanityWriteClient.delete(feedbackId);
      setFeedbackList(prevList => prevList.filter(item => item._id !== feedbackId));
      alert("Feedback eliminado correctamente");
    } catch (error) {
      console.error("Error deleting feedback:", error);
      alert("Error al eliminar el feedback");
    }
  };

  const handleExportCSV = async () => {
    try {
      const response = await fetch('/api/admin/feedback/export', {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Error al exportar');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `feedback-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting CSV:", error);
      alert("Error al exportar el feedback");
    }
  };

  const filteredFeedback = feedbackList.filter((item) => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.venue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.qrCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.email && item.email.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === "all" || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-800",
      processed: "bg-green-100 text-green-800",
      archived: "bg-gray-100 text-gray-800"
    };
    const labels = {
      pending: "Pendiente",
      processed: "Procesado",
      archived: "Archivado"
    };
    return (
      <span className={`px-2 py-0.5 text-xs rounded-full ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const getRatingStars = (rating?: string) => {
    if (!rating) return "N/A";
    const ratingLabels: Record<string, string> = {
      'first-time': '🆕 Primera vez',
      'occasional': '👤 Ocasional',
      'regular': '⭐ Regular',
      'frequent': '🌟 Frecuente'
    };
    return ratingLabels[rating] || rating;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Feedback de QR</h1>
          <p className="text-gray-600">Gestiona el feedback recibido de códigos QR</p>
        </div>
        <div className="text-center py-8">
          <p className="text-gray-500">Cargando feedback...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Feedback de QR</h1>
          <p className="text-gray-600">Gestiona el feedback recibido de códigos QR</p>
        </div>
        <Button onClick={handleExportCSV}>
          Exportar CSV
        </Button>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-gray-900">
              {feedbackList.length}
            </div>
            <p className="text-sm text-gray-600">Total Feedback</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-yellow-600">
              {feedbackList.filter(f => f.status === 'pending').length}
            </div>
            <p className="text-sm text-gray-600">Pendientes</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">
              {feedbackList.filter(f => f.status === 'processed').length}
            </div>
            <p className="text-sm text-gray-600">Procesados</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">
              {feedbackList.filter(f => f.rating).length > 0
                ? `${Math.round((feedbackList.filter(f => f.rating === 'frequent' || f.rating === 'regular').length / feedbackList.filter(f => f.rating).length) * 100)}%`
                : "N/A"}
            </div>
            <p className="text-sm text-gray-600">Clientes Recurrentes</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Feedback Recibido ({filteredFeedback.length})</CardTitle>
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
                  placeholder="Buscar por nombre, local, email o código..."
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
                    <SelectItem value="pending">Pendientes</SelectItem>
                    <SelectItem value="processed">Procesados</SelectItem>
                    <SelectItem value="archived">Archivados</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Lista de feedback */}
          <div className="space-y-4">
            {filteredFeedback.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  {searchTerm || statusFilter !== "all"
                    ? "No se encontró feedback con los filtros aplicados"
                    : "No hay feedback disponible"}
                </p>
              </div>
            ) : (
              filteredFeedback.map((item) => (
                <div
                  key={item._id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-sm font-medium text-gray-900">
                          {item.name}
                        </h3>
                        {getStatusBadge(item.status)}
                        {item.rating && (
                          <span className="text-sm">{getRatingStars(item.rating)}</span>
                        )}
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div>
                          <span className="font-medium">Local:</span> {item.venue.title} ({item.venue.city.title})
                        </div>
                        <div>
                          <span className="font-medium">Fecha visita:</span> {new Date(item.visitDate).toLocaleDateString()}
                          {item.visitTime && ` a las ${item.visitTime}`}
                        </div>
                        <div>
                          <span className="font-medium">Personas:</span> {item.partySize}
                          {item.occasion && ` • ${item.occasion}`}
                        </div>
                        {item.email && (
                          <div>
                            <span className="font-medium">Email:</span> {item.email}
                          </div>
                        )}
                        {item.phone && (
                          <div>
                            <span className="font-medium">Teléfono:</span> {item.phone}
                          </div>
                        )}
                        {item.feedback && (
                          <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                            <span className="font-medium">Comentarios:</span> {item.feedback}
                          </div>
                        )}
                      </div>
                      <div className="mt-2 text-xs text-gray-400">
                        Recibido: {new Date(item.submittedAt).toLocaleString()}
                      </div>
                    </div>
                    
                    <div className="ml-4 flex flex-col space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedFeedback(item);
                          setShowDetailModal(true);
                        }}
                      >
                        Ver detalles
                      </Button>
                      
                      <Select
                        value={item.status}
                        onValueChange={(value) => handleStatusChange(item._id, value)}
                      >
                        <SelectTrigger className="w-32 h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pendiente</SelectItem>
                          <SelectItem value="processed">Procesado</SelectItem>
                          <SelectItem value="archived">Archivado</SelectItem>
                        </SelectContent>
                      </Select>

                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(item._id)}
                      >
                        Eliminar
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modal de detalles */}
      {showDetailModal && selectedFeedback && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Detalles del Feedback</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDetailModal(false)}
              >
                ✕
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Nombre</label>
                  <p className="text-gray-900">{selectedFeedback.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Estado</label>
                  <div className="mt-1">{getStatusBadge(selectedFeedback.status)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Local</label>
                  <p className="text-gray-900">{selectedFeedback.venue.title}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Ciudad</label>
                  <p className="text-gray-900">{selectedFeedback.venue.city.title}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Fecha de visita</label>
                  <p className="text-gray-900">{new Date(selectedFeedback.visitDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Hora</label>
                  <p className="text-gray-900">{selectedFeedback.visitTime || "No especificada"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Personas</label>
                  <p className="text-gray-900">{selectedFeedback.partySize}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Tipo de Cliente</label>
                  <p className="text-gray-900">{selectedFeedback.rating ? getRatingStars(selectedFeedback.rating) : "N/A"}</p>
                </div>
                {selectedFeedback.email && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <p className="text-gray-900">{selectedFeedback.email}</p>
                  </div>
                )}
                {selectedFeedback.phone && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Teléfono</label>
                    <p className="text-gray-900">{selectedFeedback.phone}</p>
                  </div>
                )}
                {selectedFeedback.occasion && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Ocasión</label>
                    <p className="text-gray-900">{selectedFeedback.occasion}</p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-gray-700">Código QR</label>
                  <p className="text-gray-900 font-mono text-sm">{selectedFeedback.qrCode}</p>
                </div>
              </div>

              {selectedFeedback.specialRequests && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Solicitudes especiales</label>
                  <p className="text-gray-900 mt-1 p-3 bg-gray-50 rounded">{selectedFeedback.specialRequests}</p>
                </div>
              )}

              {selectedFeedback.feedback && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Comentarios</label>
                  <p className="text-gray-900 mt-1 p-3 bg-gray-50 rounded">{selectedFeedback.feedback}</p>
                </div>
              )}

              <div className="pt-4 border-t">
                <p className="text-xs text-gray-500">
                  Recibido: {new Date(selectedFeedback.submittedAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
