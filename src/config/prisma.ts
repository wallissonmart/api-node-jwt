import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function initializeDatabase() {
  try {
    const existingTags = await prisma.tag.findMany();
    
    if (existingTags.length === 0) {
      await createTags();
    }

    console.log('Banco de dados inicializado com sucesso!');
  } catch (error) {
    console.error('Erro ao inicializar o banco de dados:', error);
  }
}

async function createTags() {
  const tagsData = [
    { name: 'Tecnologia' },
    { name: 'Esportes' },
    { name: 'Arte e Cultura' },
    { name: 'Ciência' },
    { name: 'Música' },
    { name: 'Viagens' },
    { name: 'Culinária' },
    { name: 'Saúde' },
    { name: 'Negócios' },
    { name: 'Filmes e TV' },
  ];

  await prisma.tag.createMany({
    data: tagsData,
  });

  console.log('Tags criadas com sucesso!');
}

export default prisma;

export async function startDB() {
  try {
    await initializeDatabase();
  } catch (error) {
    console.error('Erro ao iniciar o aplicativo:', error);
  } finally {
    await prisma.$disconnect();
  }
}


