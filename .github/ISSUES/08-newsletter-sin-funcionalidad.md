# Newsletter CTA sin funcionalidad backend

**Tipo:** 🔵 Menor
**Componente:** Newsletter / Engagement
**Archivos afectados:** `components/HomeSaborLocal.tsx`

## Descripción

El formulario de suscripción al newsletter en la homepage está completamente implementado en el frontend pero no tiene funcionalidad backend conectada. Los usuarios pueden introducir su email y hacer clic en "Suscribirse" pero no pasa nada.

## Problema

**Código actual (líneas 227-235):**

```tsx
<div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mt-6">
  <input
    type="email"
    placeholder="Tu email"
    className="flex-1 px-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-saffron-500 focus:border-transparent"
  />
  <Button className="bg-saffron-500 hover:bg-saffron-600 text-white px-6 py-3">
    Suscribirse
  </Button>
</div>
<p className="text-sm text-muted-foreground">
  Sin spam. Cancela cuando quieras.
</p>
```

**Problemas identificados:**
- ❌ No hay `onChange` handler para capturar el email
- ❌ No hay `onSubmit` handler en el formulario
- ❌ No hay validación de email
- ❌ No hay feedback al usuario (loading, success, error)
- ❌ No hay endpoint API para procesar suscripciones
- ❌ No está conectado a servicio de email marketing

## Impacto

### Negocio
- ❌ **Pérdida de leads** - Usuarios intentan suscribirse pero no se guardan
- ❌ **Pérdida de engagement** - No se puede construir audiencia
- ❌ **Oportunidad perdida** - Newsletter es canal de marketing clave
- ❌ **Mala experiencia** - Usuario confundido al no recibir confirmación

### UX
- ❌ Click en botón no produce ninguna respuesta
- ❌ No hay feedback visual (loading, éxito, error)
- ❌ Formulario aparenta funcionar pero no hace nada

### Credibilidad
- ⚠️ Formularios que no funcionan reducen confianza en el sitio
- ⚠️ Parece un sitio "demo" o incompleto

## Solución propuesta

### Fase 1: Implementar funcionalidad básica (Mínimo viable)

#### 1. Crear componente NewsletterForm

```tsx
// components/NewsletterForm.tsx
"use client";

import { useState } from "react";
import { Button } from "./ui/button";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      setStatus("error");
      setMessage("Por favor introduce un email válido");
      return;
    }

    setStatus("loading");

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) throw new Error("Error al suscribirse");

      setStatus("success");
      setMessage("¡Gracias! Revisa tu email para confirmar la suscripción.");
      setEmail("");
    } catch (error) {
      setStatus("error");
      setMessage("Hubo un error. Por favor intenta de nuevo.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Tu email"
          disabled={status === "loading" || status === "success"}
          required
          className="flex-1 px-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-saffron-500 focus:border-transparent disabled:opacity-50"
        />
        <Button
          type="submit"
          disabled={status === "loading" || status === "success"}
          className="bg-saffron-500 hover:bg-saffron-600 text-white px-6 py-3 disabled:opacity-50"
        >
          {status === "loading" ? "Suscribiendo..." : status === "success" ? "¡Suscrito!" : "Suscribirse"}
        </Button>
      </div>

      {message && (
        <p className={`text-sm text-center ${
          status === "error" ? "text-red-600" : "text-green-600"
        }`}>
          {message}
        </p>
      )}

      {status === "idle" && (
        <p className="text-sm text-muted-foreground text-center">
          Sin spam. Cancela cuando quieras.
        </p>
      )}
    </form>
  );
}
```

#### 2. Crear API endpoint

```typescript
// app/api/newsletter/subscribe/route.ts
import { NextRequest, NextResponse } from "next/server";

// Opción A: Guardar en base de datos local
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Email inválido" },
        { status: 400 }
      );
    }

    // TODO: Guardar en base de datos
    // await db.newsletter.create({ data: { email } });

    // TODO: Enviar email de confirmación
    // await sendConfirmationEmail(email);

    // Por ahora, solo log
    console.log("Nueva suscripción:", email);

    return NextResponse.json({
      success: true,
      message: "Suscripción registrada"
    });
  } catch (error) {
    console.error("Error en suscripción newsletter:", error);
    return NextResponse.json(
      { error: "Error al procesar suscripción" },
      { status: 500 }
    );
  }
}
```

### Fase 2: Integración con servicio de email marketing (Recomendado)

#### Opciones de servicios:

**1. Mailchimp** (Popular, free tier generoso)
```bash
npm install @mailchimp/mailchimp_marketing
```

```typescript
// app/api/newsletter/subscribe/route.ts
import mailchimp from "@mailchimp/mailchimp_marketing";

mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: process.env.MAILCHIMP_SERVER_PREFIX,
});

export async function POST(request: NextRequest) {
  const { email } = await request.json();

  try {
    const response = await mailchimp.lists.addListMember(
      process.env.MAILCHIMP_AUDIENCE_ID!,
      {
        email_address: email,
        status: "pending", // Double opt-in
      }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
```

**2. SendGrid** (Alternativa popular)
```bash
npm install @sendgrid/mail
```

**3. ConvertKit** (Para creators/bloggers)

**4. Buttondown** (Simple, markdown-friendly)

**5. Resend** (Moderno, developer-friendly)

### Fase 3: Features avanzados (Opcional)

- [ ] Double opt-in con email de confirmación
- [ ] Tags/segmentación de suscriptores
- [ ] Preferencias de contenido
- [ ] Análisis de conversión
- [ ] A/B testing de CTAs
- [ ] Integración con analytics

## Base de datos (si se usa local)

```prisma
// prisma/schema.prisma
model NewsletterSubscriber {
  id            String   @id @default(cuid())
  email         String   @unique
  subscribedAt  DateTime @default(now())
  confirmed     Boolean  @default(false)
  unsubscribed  Boolean  @default(false)
  source        String?  // "homepage", "footer", etc.
}
```

## Validaciones necesarias

- ✅ Email válido (regex)
- ✅ No duplicados
- ✅ Rate limiting (prevenir spam)
- ✅ GDPR compliance (checkbox de consentimiento)
- ✅ Opción de unsubscribe

## Cumplimiento legal (GDPR)

Agregar checkbox de consentimiento:

```tsx
<label className="flex items-start gap-2 text-sm text-muted-foreground">
  <input
    type="checkbox"
    required
    className="mt-1"
  />
  <span>
    Acepto recibir el newsletter y he leído la{" "}
    <Link href="/politica-privacidad" className="underline">
      política de privacidad
    </Link>
  </span>
</label>
```

## Prioridad

**Baja-Media** - Funcionalidad de engagement, no crítica

## Labels sugeridos

`enhancement`, `feature`, `newsletter`, `engagement`, `needs-backend`

## Decisiones necesarias

Antes de implementar, decidir:
- [ ] ¿Qué servicio de email marketing usar?
- [ ] ¿Guardar suscriptores en DB local o solo en servicio externo?
- [ ] ¿Single opt-in o double opt-in?
- [ ] ¿Qué contenido se enviará en el newsletter?
- [ ] ¿Con qué frecuencia?
- [ ] ¿Quién gestionará el contenido?

## Estimación de esfuerzo

- **MVP (Fase 1):** 2-3 horas
- **Integración servicio (Fase 2):** 4-6 horas
- **Features avanzados (Fase 3):** 8-12 horas

## Recursos

- [Mailchimp API Docs](https://mailchimp.com/developer/)
- [SendGrid Next.js Guide](https://docs.sendgrid.com/for-developers/sending-email/nextjs)
- [Resend React Email](https://resend.com/docs/send-with-nextjs)
