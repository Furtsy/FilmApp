const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Yorum = require('../models/yorum');
const IzlemeListesi = require('../models/izlemeListesi');
const User = require('../models/user');
const Puan = require('../models/puan');
const verifyToken = require('../services/verify');
const auth = require('../services/auth');

router.get('/', (req, res) => {
  res.status(200);
  res.json({
    message: 'İşlem Sistemi Aktif',
    status: 200,
  });
});

router.get('/yorumlar/:filmId', async (req, res) => {
  try {
    const filmId = req.params.filmId;

    if (!filmId) return res.status(400).json({ message: 'Geçersiz filmId' });

    const yorumlar = await Yorum.find({ filmId });
    res.json(yorumlar);
  } catch (error) {
    console.error('Yorumları getirirken hata oluştu: ', error);
    res.status(500).json({ message: 'Yorumları listelerken hata oluştu' });
  }
});

router.post('/yorum', verifyToken, async (req, res) => {
  try {
    if(!req.token) return res.status(401).json({ message: 'Yorum yapman için giriş yapman gerek' });
    const user = await auth.decode(req.token);
    const userinfo = await User.findOne({ email: user.email })

    if(userinfo && userinfo.ban == true) return res.json({ message: 'Banlısın yorum yapamazsın', ban: true });

    const { filmId, icerik } = req.body;

    if (!icerik || !filmId) return res.status(400).json({ message: 'İçerik veya filmid eksik' });

    const newComment = new Yorum({
      userName: user.name,
      filmId: filmId,
      icerik,
    });

    const savedComment = await newComment.save();
    res.json(savedComment);
  } catch (error) {
    console.error('Yorum eklerken hata oluştu: ', error);
    res.status(500).json({ message: 'Yorum eklerken hata oluştu' });
  }
});

router.post('/izleme-listesi/ekle', verifyToken, async (req, res) => {
    try {
      if(!req.token) return res.status(401).json({ message: 'İzleme listesine ekleme/çıkarma yapmak için giriş yapman gerek' });
      const user = await auth.decode(req.token);
      const { filmId, tur } = req.body;
  
      if (!filmId || !tur) return res.status(400).json({ message: 'Geçersiz filmId veya tür' });

      const existingEntry = await IzlemeListesi.findOneAndDelete({ filmId, tur, user: user.name });
  
      if (existingEntry) {
        return res.status(200).json({message: 'Başarılı şekilde izleme listesinde kaldırıldı'});
      }
  
      const newIzlemeListesi = new IzlemeListesi({
        filmId,
        tur,
        user: user.name,
      });
  
      const savedIzlemeListesi = await newIzlemeListesi.save();
  
      res.status(200).json(savedIzlemeListesi);
    } catch (error) {
      console.error('İzleme listesine eklerken hata oluştu: ', error);
      res.status(500).json({ message: 'İzleme listesine eklerken hata oluştu' });
    }
  });
  
  router.get('/izleme-listesi/liste', verifyToken, async (req, res) => {
    try {
      if(!req.token) return res.status(200).json([]);
      const user = await auth.decode(req.token);
      const izlemeListesi = await IzlemeListesi.find({ user: user.name });
  
      res.status(200).json(izlemeListesi);
    } catch (error) {
      console.error('İzleme listesini getirirken hata oluştu: ', error);
      res.status(500).json({ message: 'İzleme listesini getirirken hata oluştu' });
    }
  });

  router.post('/puanla', verifyToken, async(req, res) => {

    try {
      if(!req.token) return res.status(401).json({ message: 'Puanlamak için giriş yapman gerek' });
      const { filmId, tur, puan } = req.body;
      const user = await auth.decode(req.token)
      const existingPuan = await Puan.findOne({ filmId, tur, user: user.name });
  
      if (existingPuan) {
        existingPuan.puan = puan;
        const updatedPuan = await existingPuan.save();
        res.status(200).json(updatedPuan);
      } else {
        const newPuan = new Puan({ filmId, tur, user: user.name, puan });
        const savedPuan = await newPuan.save();
        res.status(200).json(savedPuan);
      }
    } catch (error) {
      console.error('Puan eklerken hata oluştu: ', error);
      res.status(500).json({ message: 'Puan eklerken hata oluştu' });
    }
  });
  
  router.delete('/sil/:filmId/:tur', verifyToken, async (req, res) => {
    try {
      if(!req.token) return res.status(401).json({ message: 'Puanlamak için giriş yapman gerek' });
      const { filmId, tur } = req.params;
      const user = await auth.decode(req.token);
      const existingPuan = await Puan.findOne({ filmId, tur, user: user.name });
  
      if (!existingPuan) {
        return res.status(404).json({ message: 'Bu film için değerlendirme bulunamadı' });
      }
  
      await Puan.deleteOne({ filmId, tur, user: user.name });
  
      res.status(200).json({ message: 'Değerlendirme başarıyla silindi' });
    } catch (error) {
      console.error('Değerlendirme silinirken hata oluştu: ', error);
      res.status(500).json({ message: 'Değerlendirme silinirken hata oluştu' });
    }
  });

  router.get('/tum-puanlarim', verifyToken,async (req, res) => {
    try {
      if(!req.token) return res.status(200).json([])
      const user = await auth.decode(req.token);
      const tumPuanlar = await Puan.find({ user: user.name });
      res.status(200).json(tumPuanlar);
    } catch (error) {
      console.error('Tüm puanları getirirken hata oluştu: ', error);
      res.status(500).json({ message: 'Tüm puanları getirirken hata oluştu' });
    }
  });

module.exports = router;