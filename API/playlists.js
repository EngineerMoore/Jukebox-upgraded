const prisma = require(`../prisma`)

const express = require(`express`);
const router = express.Router();
module.exports = router;

const { authenticate } = require("./auth")


router.get("/", authenticate, async (req, res, next) => {
  try{
   const playlists = await prisma.playlist.findMany({
    where: { ownerId: req.user.id},
   });
   res.json(playlists);
  } catch(e) {
    next(e);
  }
});

router.post("/", authenticate, async (req, res, next) => {
  const { name, description, ownerId } = req.body;

  const inputValidation = (field, dataType) => {
    if (!field) { 
      next({
        status: 400,
        message: `Attention, ${field} (${field}: ${dataType}) required`
      });
    }
  }

  inputValidation(`name`, 'String');
  inputValidation(`description`, 'String');
  inputValidation(`ownerId`, `Int`);

  // const addedSongs = trackIds.map((id) => ({ id }))

  try {
   const newPlaylist = await prisma.playlist.create({
     data: {
       name,
       description,
       ownerId: req.user.id,
      //  tracks: { connect: addedSongs }
     }
   });
   res.status(201).json(newPlaylist)
  } catch (e) {
   next(e);
  }
})


router.get("/:id", authenticate, async (req, res, next) => {
  const { id } = req.params;

  try{
    const playlist = await prisma.playlist.findUnique({
      where: { id: +id, ownerId: req.user.id }, include: { tracks: true }
    });

    if (!playlist){
      next({ status: 403, message: `Access denied. Please login with the correct credentials.`})
    };

    res.json(playlist);
  } catch (e) {
    next(e);
  }

})