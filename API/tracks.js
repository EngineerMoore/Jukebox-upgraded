const prisma = require(`../prisma`);

const express = require(`express`);
const { authenticate } = require("./auth");
const router = express.Router();
module.exports = router;


router.get("/", async (req, res, next) => {
  try {
    const tracks = await prisma.track.findMany();
    res.json(tracks);
  } catch(e) {
    next(e);
  }
});

router.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  const includePlaylists = req.user
    ? { where: { ownerId: req.user.id } }
    : false;

  try {
    const track = await prisma.track.findUniqueOrThrow({
      where: { id: +id },
      include: { playlists: includePlaylists },
    });
    if (!track) {
      next({status: 404});
    }
    res.json(track);
  } catch(e) {
    next(e);
  }
});