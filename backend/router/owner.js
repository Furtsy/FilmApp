const express = require('express');
const router = express.Router();
const User = require('../models/user');
const owner = require('../services/owner');
const yorum = require('../models/yorum');
const IzlemeListesi = require('../models/izlemeListesi');
const Puan = require('../models/puan');
const İcerik = require('../models/icerik');
const auth = require('../services/auth');

router.get('/user/all', owner.isOwner, (req, res) => {
    User.find({}, 'userid name email admin owner ban date')
      .then(users => {
        res.json({ users });
      })
      .catch(err => res.json({ message: 'Hata' }));
  });

  router.patch('/user/:userId/ban', owner.isOwner, (req, res) => {
    const userId = req.params.userId;
    const banDurumu = req.body.banDurumu;
    User.findByIdAndUpdate(userId, { ban: banDurumu })
      .then(() => {
        res.json({ message: 'İşlem tamamlandı' });
      })
      .catch(err => res.status(400).json({ message: 'Ban işlemi gerçekleştirilemedi' }));
  });
  
router.patch('/user/:userId/admin', owner.isOwner, (req, res) => {
const userId = req.params.userId;
const adminDurumu = req.body.adminDurumu;
User.findByIdAndUpdate(userId, { admin: adminDurumu })
  .then(() => {
    res.json({ message: 'İşlem tamamlandı' });
  })
  .catch(err => res.status(400).json({ message: 'Admin işlemi gerçekleştirilemedi' }));

})

  router.delete('/user/:id', owner.isOwner, (req, res) => {
    const userId = req.params.id;
  
    User.findById(userId)
      .then(user => {
        if (!user) {
          return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
        }
  
        User.findByIdAndRemove(userId)
          .then(() => {
            res.json({ message: 'Kullanıcı başarıyla silindi.' });
          })
          .catch(err => {
            res.status(500).json({ message: 'Kullanıcı silinirken hata oluştu.' });
          });
      })
      .catch(err => {
        res.status(500).json({ message: 'Kullanıcı sorgulanırken hata oluştu.' });
      });
  });

  router.post('/icerik/ekle', owner.isOwner, async (req, res) => {
    try {
      const { name, description, tur, image } = req.body;
      const user = await auth.decode(req.token);
  
      if (!image) {
        return res.status(400).json({ message: 'Resim eksik.' });
      }
  
      const newIcerik = new İcerik({
        name,
        description,
        tur,
        createdby: user.userid,
        image,
      });
  
      newIcerik
        .save()
        .then((icerik) => {
          res.json({ message: 'İçerik başarıyla oluşturuldu.' });
        })
        .catch((err) => {
          console.error(err);
          res.status(500).json({ message: 'İçerik oluşturulurken hata oluştu.' });
        });
    } catch (error) {
      console.error('Hata oluştu:', error);
      res.status(500).json({ message: 'İçerik oluşturulurken hata oluştu.' });
    }
  });

  router.patch('/icerik/duzenle/:id', owner.isOwner, async (req, res) => {
    try {
      const { name, description } = req.body;
      const { id } = req.params;
  
      const updatedIcerik = await İcerik.findByIdAndUpdate(
        id,
        { name, description },
        { new: true } 
      );
  
      if (!updatedIcerik) {
        return res.status(404).json({ message: 'İçerik bulunamadı.' });
      }
  
      res.json({ message: 'İçerik başarıyla güncellendi.', updatedIcerik });
    } catch (error) {
      console.error('Hata oluştu:', error);
      res.status(500).json({ message: 'İçerik güncellenirken hata oluştu.' });
    }
  });
  router.delete('/icerik/sil/:id', owner.isOwner, async (req, res) => {
    try {
        const { id } = req.params;

        const icerik = await İcerik.findById(id);

        if (!icerik) return res.status(404).json({ message: 'İçerik bulunamadı.' });
      

        const filmId = icerik.filmId;

        const deletedIcerik = await İcerik.findByIdAndDelete(id);

        await IzlemeListesi.deleteMany({ filmId: filmId });
        await Puan.deleteMany({ filmId: filmId });
        await yorum.deleteMany({ filmId: filmId });

        res.json({ message: 'İçerik başarıyla silindi.', deletedIcerik });
    } catch (error) {
        console.error('Hata oluştu:', error);
        res.status(500).json({ message: 'İçerik silinirken hata oluştu.' });
    }
});

  

module.exports = router;