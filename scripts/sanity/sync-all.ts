import { syncSingleClient } from './sync-client';

interface ClientToSync {
  username: string;
  caseStudyId: string;
  category: string;
}

const CLIENTS: ClientToSync[] = [
  { username: 'happystore.mx', caseStudyId: 'case-happy-store', category: 'Tienda de Regalos & Retail' },
  { username: 'zapaterialapeninsula', caseStudyId: 'case-zapateria-la-peninsula', category: 'Calzado & Retail' },
  { username: 'peninsulaproject.mx', caseStudyId: 'case-peninsula-project', category: 'Bienes Raíces & Arquitectura' },
  { username: 'enfoque21fotografia', caseStudyId: 'case-enfoque-21', category: 'Fotografía & Audiovisual' },
  { username: 'residencialesmerida', caseStudyId: 'case-residenciales-merida', category: 'Bienes Raíces & Terrenos' },
  { username: 'restauradental', caseStudyId: 'case-restaura', category: 'Laboratorio Dental & Salud' },
  { username: 'passyourtoefl', caseStudyId: 'case-pass-your-toefl', category: 'Educación & Certificaciones' },
  { username: 'avant_rentacar', caseStudyId: 'case-avant-rent-a-car', category: 'Renta de Autos & Turismo' },
  { username: 'diazarcontrol', caseStudyId: 'case-diazar', category: 'Construcción & Acabados' },
  { username: 'industrialbasanlo', caseStudyId: 'case-industrial-basanlo', category: 'Ingeniería & B2B Industrial' },
];

async function main() {
  console.log(`Iniciando sincronización por lotes de ${CLIENTS.length} clientes...`);
  const results: Array<{ username: string; success: boolean; posts?: number; error?: string }> = [];

  for (let i = 0; i < CLIENTS.length; i++) {
    const item = CLIENTS[i];
    console.log(`\n------------------------------------------------------------`);
    console.log(`[${i + 1}/${CLIENTS.length}] Cliente: @${item.username}`);
    console.log(`------------------------------------------------------------`);

    try {
      const res = await syncSingleClient(item.username, item.caseStudyId, item.category);
      results.push({ username: item.username, success: true, posts: res.postsCount });
    } catch (err: any) {
      console.error(`❌ Error sincronizando @${item.username}:`, err.message);
      results.push({ username: item.username, success: false, error: err.message });
    }

    // Pequeña pausa entre solicitudes para no saturar
    if (i < CLIENTS.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }

  console.log(`\n============================================================`);
  console.log(`RESUMEN DE SINCRONIZACIÓN`);
  console.log(`============================================================`);
  console.table(results);
}

main().catch(console.error);
