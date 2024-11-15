import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 기존 데이터 삭제
  await prisma.rent.deleteMany();
  await prisma.book.deleteMany();
  await prisma.shelf.deleteMany();
  await prisma.user.deleteMany();

  // users 테이블에 더미 데이터 삽입
  const user = await prisma.user.create({
    data: {
      name: '장세환',
      student_num: 20190101,
      email: 'sehwan1023@example.com',
      phone: '010-1234-5678'
    },
  });

  // shelves 테이블에 더미 데이터 삽입
  const shelf1 = await prisma.shelf.create({ data: { location: 'A-3' } });
  const shelf2 = await prisma.shelf.create({ data: { location: 'B-2' } });
  const shelf3 = await prisma.shelf.create({ data: { location: 'C-4' } });

  // books 테이블에 더미 데이터 삽입
  const book1 = await prisma.book.create({
    data: { title: 'Programming 101', author: 'John Doe', genre: 'Computer Science', published_date: new Date('2020-01-01'), status: 'BOGAN', shelf_id: shelf1.shelf_id }
  });
  const book2 = await prisma.book.create({
    data: { title: 'Database Systems', author: 'Jane Smith', genre: 'Computer Science', published_date: new Date('2019-05-15'), status: 'DAEYONG', shelf_id: shelf2.shelf_id }
  });
  const book3 = await prisma.book.create({
    data: { title: 'Advanced Networking', author: 'James Brown', genre: 'Networking', published_date: new Date('2021-09-10'), status: 'DONAN', shelf_id: shelf3.shelf_id }
  });

  // rent 테이블에 더미 데이터 삽입
  await prisma.rent.create({
    data: {
      user_id: user.user_id,  // 생성된 user의 ID 사용
      book_id: book1.book_id,  // 생성된 book의 ID 사용
      rent_date: new Date('2023-11-01'),
      return_date: new Date('2023-11-15')
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
