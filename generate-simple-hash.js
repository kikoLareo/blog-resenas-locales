const bcrypt = require('bcrypt');

const password = 'admin123';

bcrypt.hash(password, 10).then(hash => {
  console.log('🔐 Hash generado para:', password);
  console.log('📋 Hash completo:', hash);
  console.log('📋 Longitud:', hash.length);
  
  // Verificar que funciona
  bcrypt.compare(password, hash).then(isValid => {
    console.log('✅ Verificación:', isValid ? 'Correcta' : 'Incorrecta');
  });
});
