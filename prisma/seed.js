const prisma = require(`../prisma`);
const { faker } = require(`@faker-js/faker`)

const seed = async (numUsers = 3, numTracks = 20, numPlaylists = 7) => {
  // seed w/ 3 users, 7 playlists, 20 tracks

  const users = Array.from({ length: numUsers }, () => ({
    username: faker.internet.username(),
  }));
  await prisma.user.createMany({ data: users })

  const tracks = Array.from({ length: numTracks }, () => ({
    name: faker.music.songName(),
  }));
  await prisma.track.createMany({ data: tracks });

  for (let i = 0; i < numPlaylists; i++) {
    const randomIntAboveZero = (amount) => Math.ceil(Math.random()*amount);
    const playlistTracks = Array.from({ length: 3 }, () =>  ({ id: randomIntAboveZero(numTracks) }) );
    await prisma.playlist.create({
      data: {
        name: faker.music.album(),
        description: faker.lorem.paragraph(2),
        ownerId: randomIntAboveZero(numUsers),
        tracks: { connect: playlistTracks }
      }  
    })
  };
}
seed()
  .then( async () => await prisma.$disconnect() )
  .catch( async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  })