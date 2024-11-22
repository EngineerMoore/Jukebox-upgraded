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