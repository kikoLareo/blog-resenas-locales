"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { adminSanityClient, adminSanityWriteClient } from "@/lib/admin-sanity";
import { venueSubmissionsListQuery } from "@/sanity/lib/queries";
import type { VenueSubmission } from "@/types/sanity";
import { revalidatePath, revalidateTag } from "next/cache";

interface SubmissionWithDetails extends Omit<VenueSubmission, 'city' | 'categories' | 'qrCode' | 'createdVenue'> {
  city: { _id: string; title: string; slug: { current: string } };
  categories: { _id: string; title: string; slug: { current: string } }[];
  qrCode: { _id: string; code: string; title: string };
  createdVenue?: { _id: string; title: string; slug: { current: string } };
}

export default function VenueSubmissionsPage() {
  const [submissions, setSubmissions] = useState<SubmissionWithDetails[]>([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState<SubmissionWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<SubmissionWithDetails | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [internalNotes, setInternalNotes] = useState("");

  useEffect(() => {
    fetchSubmissions();
  }, []);

  useEffect(() => {
    let filtered = submissions;

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(s => s.status === statusFilter);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(s =>
        s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.submittedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.city?.title?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredSubmissions(filtered);
  }, [submissions, statusFilter, searchTerm]);

  const fetchSubmissions = async () => {
    try {
      const data = await adminSanityClient.fetch<SubmissionWithDetails[]>(venueSubmissionsListQuery);
      setSubmissions(data);
      setFilteredSubmissions(data);
    } catch (error) {
      alert("Error al cargar las solicitudes");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (submission: SubmissionWithDetails) => {
    setSelectedSubmission(submission);
    setInternalNotes(submission.internalNotes || "");
    setRejectionReason("");
    setShowModal(true);
  };

  const handleApprove = async () => {
    if (!selectedSubmission) return;

    const confirmed = confirm(
      `¿Aprobar la solicitud de "${selectedSubmission.title}"? Se creará un local público en el blog.`
    );

    if (!confirmed) return;

    setProcessing(true);

    try {
      // Create venue document
      const venueData = {
        _type: 'venue',
        title: selectedSubmission.title,
        slug: selectedSubmission.slug,
        description: selectedSubmission.description,
        address: selectedSubmission.address,
        postalCode: selectedSubmission.postalCode,
        city: {
          _type: 'reference',
          _ref: selectedSubmission.city._id,
        },
        categories: selectedSubmission.categories.map(cat => ({
          _type: 'reference',
          _ref: cat._id,
        })),
        phone: selectedSubmission.phone,
        email: selectedSubmission.email,
        website: selectedSubmission.website,
        priceRange: selectedSubmission.priceRange,
        openingHours: selectedSubmission.openingHours,
        geo: selectedSubmission.geo,
        images: selectedSubmission.images,
        featured: false,
      };

      const venue = await adminSanityWriteClient.create(venueData);

      // Update submission
      await adminSanityWriteClient
        .patch(selectedSubmission._id)
        .set({
          status: 'approved',
          approvedAt: new Date().toISOString(),
          approvedBy: 'admin', // TODO: Get actual user from session
          createdVenue: {
            _type: 'reference',
            _ref: venue._id,
          },
          internalNotes: internalNotes || undefined,
        })
        .commit();

      alert(`¡Local "${selectedSubmission.title}" aprobado y publicado!`);
      setShowModal(false);
      await fetchSubmissions();
    } catch (error) {
      alert("Error al aprobar la solicitud");
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!selectedSubmission) return;

    if (!rejectionReason.trim()) {
      alert("Por favor, indica la razón del rechazo");
      return;
    }

    const confirmed = confirm(
      `¿Rechazar la solicitud de "${selectedSubmission.title}"?`
    );

    if (!confirmed) return;

    setProcessing(true);

    try {
      await adminSanityWriteClient
        .patch(selectedSubmission._id)
        .set({
          status: 'rejected',
          rejectionReason,
          internalNotes: internalNotes || undefined,
        })
        .commit();

      alert(`Solicitud de "${selectedSubmission.title}" rechazada`);
      setShowModal(false);
      await fetchSubmissions();
    } catch (error) {
      alert("Error al rechazar la solicitud");
    } finally {
      setProcessing(false);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedSubmission) return;

    setProcessing(true);

    try {
      await adminSanityWriteClient
        .patch(selectedSubmission._id)
        .set({
          internalNotes: internalNotes || undefined,
        })
        .commit();

      alert("Notas guardadas correctamente");
      await fetchSubmissions();
    } catch (error) {
      alert("Error al guardar las notas");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Solicitudes de Locales</h1>
          <p className="text-gray-600">Cargando solicitudes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Solicitudes de Locales</h1>
        <p className="text-gray-600">Revisa y aprueba las solicitudes de registro</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-gray-900">
              {submissions.length}
            </div>
            <div className="text-sm text-gray-600">Total</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-yellow-600">
              {submissions.filter(s => s.status === 'pending').length}
            </div>
            <div className="text-sm text-gray-600">Pendientes</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">
              {submissions.filter(s => s.status === 'approved').length}
            </div>
            <div className="text-sm text-gray-600">Aprobadas</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600">
              {submissions.filter(s => s.status === 'rejected').length}
            </div>
            <div className="text-sm text-gray-600">Rechazadas</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="search">Buscar</Label>
              <Input
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Nombre, email, ciudad..."
              />
            </div>
            <div>
              <Label htmlFor="status">Estado</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="pending">Pendientes</SelectItem>
                  <SelectItem value="approved">Aprobadas</SelectItem>
                  <SelectItem value="rejected">Rechazadas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* List */}
      <Card>
        <CardHeader>
          <CardTitle>Solicitudes ({filteredSubmissions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredSubmissions.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              No hay solicitudes que mostrar
            </p>
          ) : (
            <div className="space-y-4">
              {filteredSubmissions.map((submission) => (
                <div
                  key={submission._id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-2xl ${
                          submission.status === 'pending' ? '⏳' :
                          submission.status === 'approved' ? '✅' : '❌'
                        }`}>
                          {submission.status === 'pending' ? '⏳' :
                           submission.status === 'approved' ? '✅' : '❌'}
                        </span>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {submission.title}
                        </h3>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Ciudad:</span> {submission.city?.title || 'N/A'}
                        </div>
                        <div>
                          <span className="font-medium">Enviado por:</span> {submission.submittedBy}
                        </div>
                        <div>
                          <span className="font-medium">Email:</span> {submission.email}
                        </div>
                        <div>
                          <span className="font-medium">Fecha:</span>{' '}
                          {new Date(submission.submittedAt).toLocaleDateString('es-ES')}
                        </div>
                      </div>
                      {submission.categories && submission.categories.length > 0 && (
                        <div className="flex gap-2 mt-2">
                          {submission.categories.map((cat) => (
                            <span
                              key={cat._id}
                              className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded"
                            >
                              {cat.title}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <Button
                      onClick={() => handleViewDetails(submission)}
                      variant="outline"
                      size="sm"
                    >
                      Ver Detalles
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal */}
      {showModal && selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-6 z-10">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedSubmission.title}
                  </h2>
                  <p className="text-gray-600">
                    Estado:{' '}
                    {selectedSubmission.status === 'pending' && '⏳ Pendiente'}
                    {selectedSubmission.status === 'approved' && '✅ Aprobada'}
                    {selectedSubmission.status === 'rejected' && '❌ Rechazada'}
                  </p>
                </div>
                <Button
                  onClick={() => setShowModal(false)}
                  variant="ghost"
                  size="sm"
                >
                  ✕ Cerrar
                </Button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Información Básica</h3>
                <dl className="grid grid-cols-2 gap-4">
                  <div>
                    <dt className="font-medium text-gray-700">Enviado por:</dt>
                    <dd className="text-gray-900">{selectedSubmission.submittedBy}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-gray-700">Fecha de envío:</dt>
                    <dd className="text-gray-900">
                      {new Date(selectedSubmission.submittedAt).toLocaleString('es-ES')}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-medium text-gray-700">Ciudad:</dt>
                    <dd className="text-gray-900">{selectedSubmission.city?.title}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-gray-700">Rango de precios:</dt>
                    <dd className="text-gray-900">{selectedSubmission.priceRange}</dd>
                  </div>
                  <div className="col-span-2">
                    <dt className="font-medium text-gray-700">Descripción:</dt>
                    <dd className="text-gray-900 mt-1">{selectedSubmission.description}</dd>
                  </div>
                </dl>
              </div>

              {/* Location */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Ubicación</h3>
                <dl className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <dt className="font-medium text-gray-700">Dirección:</dt>
                    <dd className="text-gray-900">{selectedSubmission.address}</dd>
                  </div>
                  {selectedSubmission.postalCode && (
                    <div>
                      <dt className="font-medium text-gray-700">Código Postal:</dt>
                      <dd className="text-gray-900">{selectedSubmission.postalCode}</dd>
                    </div>
                  )}
                  {selectedSubmission.geo && (
                    <div>
                      <dt className="font-medium text-gray-700">Coordenadas:</dt>
                      <dd className="text-gray-900">
                        {selectedSubmission.geo.lat}, {selectedSubmission.geo.lng}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>

              {/* Contact */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Contacto</h3>
                <dl className="grid grid-cols-2 gap-4">
                  <div>
                    <dt className="font-medium text-gray-700">Teléfono:</dt>
                    <dd className="text-gray-900">{selectedSubmission.phone}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-gray-700">Email:</dt>
                    <dd className="text-gray-900">{selectedSubmission.email}</dd>
                  </div>
                  {selectedSubmission.website && (
                    <div className="col-span-2">
                      <dt className="font-medium text-gray-700">Sitio web:</dt>
                      <dd className="text-gray-900">
                        <a
                          href={selectedSubmission.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {selectedSubmission.website}
                        </a>
                      </dd>
                    </div>
                  )}
                </dl>
              </div>

              {/* Categories */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Categorías</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedSubmission.categories?.map((cat) => (
                    <span
                      key={cat._id}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                    >
                      {cat.title}
                    </span>
                  ))}
                </div>
              </div>

              {/* Opening Hours */}
              {selectedSubmission.openingHours && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Horarios</h3>
                  <dl className="space-y-1">
                    {Object.entries(selectedSubmission.openingHours).map(([day, hours]) => (
                      hours && (
                        <div key={day} className="flex justify-between">
                          <dt className="font-medium text-gray-700 capitalize">{day}:</dt>
                          <dd className="text-gray-900">{hours}</dd>
                        </div>
                      )
                    ))}
                  </dl>
                </div>
              )}

              {/* Images */}
              <div>
                <h3 className="text-lg font-semibold mb-3">
                  Imágenes ({selectedSubmission.images?.length || 0})
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {selectedSubmission.images?.map((image, index) => (
                    <div key={index} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`https://cdn.sanity.io/images/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/${process.env.NEXT_PUBLIC_SANITY_DATASET}/${image.asset._ref.split('-')[1]}-${image.asset._ref.split('-')[2]}.${image.asset._ref.split('-')[3]}`}
                        alt={image.alt || `Imagen ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Internal Notes */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Notas Internas</h3>
                <Textarea
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                  placeholder="Notas solo visibles para administradores..."
                  rows={3}
                />
                <Button
                  onClick={handleSaveNotes}
                  disabled={processing}
                  variant="outline"
                  className="mt-2"
                >
                  Guardar Notas
                </Button>
              </div>

              {/* Rejection Reason (if applicable) */}
              {selectedSubmission.status === 'pending' && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Razón de Rechazo</h3>
                  <Textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Explica por qué se rechaza esta solicitud..."
                    rows={3}
                  />
                </div>
              )}

              {selectedSubmission.rejectionReason && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Razón de Rechazo</h3>
                  <p className="text-gray-900 bg-red-50 p-3 rounded">
                    {selectedSubmission.rejectionReason}
                  </p>
                </div>
              )}

              {/* Actions */}
              {selectedSubmission.status === 'pending' && (
                <div className="flex gap-4 pt-4 border-t">
                  <Button
                    onClick={handleApprove}
                    disabled={processing}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    {processing ? "Procesando..." : "✅ Aprobar y Publicar"}
                  </Button>
                  <Button
                    onClick={handleReject}
                    disabled={processing}
                    variant="destructive"
                    className="flex-1"
                  >
                    {processing ? "Procesando..." : "❌ Rechazar"}
                  </Button>
                </div>
              )}

              {selectedSubmission.status === 'approved' && selectedSubmission.createdVenue && (
                <div className="bg-green-50 border border-green-200 p-4 rounded">
                  <p className="text-green-800">
                    ✅ Local aprobado y publicado
                  </p>
                  <a
                    href={`/dashboard/venues/${selectedSubmission.createdVenue._id}`}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Ver local creado →
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
