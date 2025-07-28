import { PrismaClient } from '../generated/prisma'; 

const prisma = new PrismaClient();

async function main() {
  await prisma.user.create({
    data: {
        username: "haconghau2004",
        email:"haconghau2004@gmail.com",
        password: "12345678",
        phone: "08190972313",
        status: 'ACTIVE',
        roles: {
          create: [{
            assignBy:'Hau',
            role: {
              connect: {
                id : 1
              }
            }
          }]
        }
    }
  });
  console.log('✅ Seeded roles!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
