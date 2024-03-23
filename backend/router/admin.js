const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Yorum = require('../models/yorum');
const admin = require('../services/admin');

router.get('/user/all', admin.isAdmin, (req, res) => {
    User.find({}, 'userid name email admin owner ban date')
      .then(users => {
        res.json({ users });
      })
      .catch(err => res.json({ message: 'Hata' }));
  });

  router.patch('/user/:userId/ban', admin.isAdmin, (req, res) => {
    const userId = req.params.userId;
    const banDurumu = req.body.banDurumu;
    User.findByIdAndUpdate(userId, { ban: banDurumu })
      .then(user => {
        if(user.admin == true || user.owner == true) return res.status(403).json({ message: 'admin ve ownlerlar banlanamaz' });
        res.json({ message: 'İşlem tamamlandı' });
      })
      .catch(err => res.status(400).json({ message: 'Ban işlemi gerçekleştirilemedi' }));
  });
  
  router.delete('/user/:id', (req, res) => {
    const userId = req.params.id;
  
    User.findById(userId)
      .then(user => {
        if (!user) return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
  
        if (user.admin) return res.status(403).json({ message: 'adminler silinemez silemez.' });

        if(user.owner) return res.status(403).json({ message: '?DdD' });

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

  router.get('/yorum/all', admin.isAdmin, (req, res) => {
    Yorum.find({}, 'userName icerik filmId durum date').then(yorumlar => {
     res.json({yorumlar}); 
    })
  })

  router.delete('/yorum/:id', admin.isAdmin, (req, res) => {
    const yorumId = req.params.id

    Yorum.findById(yorumId)
    .then(comments => {
      if (!comments) return res.status(404).json({ message: 'yorum bulunamadı.' });

      Yorum.findByIdAndRemove(yorumId)
        .then(() => {
          res.json({ message: 'Yorum başarıyla silindi.' });
        })
        .catch(err => {
          res.status(500).json({ message: 'yorum silinirken hata oluştu.' });
        });
    })
    .catch(err => {
      res.status(500).json({ message: 'yorumu sorgularken hata oluştu.' });
    });    

  })
  
  router.patch('/yorum/:id', admin.isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { durum } = req.body;

        const yorum = await Yorum.findById(id);

        if (!yorum) return res.status(404).json({ message: 'Yorum bulunamadı.' });
      
        yorum.durum = durum;

        await yorum.save();

        res.json({ message: 'Yorum başarıyla güncellendi.' });
    } catch (error) {
        console.error('Hata oluştu:', error);
        res.status(500).json({ message: 'Yorum güncellenirken hata oluştu.' });
    }
});



module.exports = router;
