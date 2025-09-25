#!/usr/bin/env node

const crypto = require('crypto');

// Generar un secret aleatorio de 32 bytes (256 bits)
const secret = crypto.randomBytes(32).toString('hex');

console.log('🔐 NEXTAUTH_SECRET generado:');
console.log('');
console.log(secret);
console.log('');
console.log('📋 Copia este valor y agrégalo a tus variables de entorno:');
console.log('');
console.log('NEXTAUTH_SECRET=' + secret);
console.log('');
console.log('🌐 Para Vercel, ve a:');
console.log('   Dashboard > Tu Proyecto > Settings > Environment Variables');
console.log('');
console.log('🔒 Para desarrollo local, agrégalo a tu archivo .env.local');
