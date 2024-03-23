const express = require('express');
const router = express.Router();
const cheerio = require('cheerio');
const axios = require('axios');
const İcerik = require('../models/icerik');
const Puan = require('../models/puan');
const IzlemeListesi = require('../models/izlemeListesi');

router.get('/', (req, res) => {
    res.status(200);
    res.json({
        message: 'Kayıt/Giriş Sistemi Aktif',
        status: 200
    });
});

router.get('/vizyon', async (req, res) => {
    try {
        const vizyonData = await fetchVizyon();
        res.status(200).json(vizyonData);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

router.get('/populer', async (req, res) => {
    try {
        const populerData = await fetchPopuler();
        res.status(200).json(populerData);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

router.get('/yakinda', async (req, res) => {
    try {
        const yakindaData = await fetchYakinda();
        res.status(200).json(yakindaData);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

router.get('/ara', async (req, res) => {
    const {
        query,
        tur
    } = req.query;
    try {
        if (!query) {
            return res.status(400).json({
                error: 'Arama sorgusu eksik.'
            });
        }
        if (tur === 'tv') {
            const aramaData = await fetchAra(query, tur);
            res.status(200).json(aramaData);
        } else if (tur === 'movie') {
            const aramaData = await fetchAra(query, tur);
            res.status(200).json(aramaData);
        } else {
            res.status(400).json({
                error: 'Arama türü eksik.'
            });
        }

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

router.get('/bilgi', async (req, res) => {
    const {
        id,
        tur
    } = req.query;
    try {
        if (!id) {
            return res.status(400).json({
                error: 'id belirtmen gerek'
            });
        } else if (!tur) {
            return res.status(400).json({
                error: 'tür belirtmen gerek'
            });
        } if (tur === 'tv') {
            const bilgiData = await fetchBilgi(id, tur);
            res.status(200).json(bilgiData);
        } else if (tur === 'movie') {
            const bilgiData = await fetchBilgi(id, tur);
            res.status(200).json(bilgiData);
        } else if(tur === 'local') {
            const bilgiData = await İcerik.find({ filmId: id });
            const puanlar = await Puan.find({ filmId: id });
            const ortalamaPuan = puanlar.length > 0 ? puanlar.reduce((acc, puan) => acc + puan.puan, 0) / puanlar.length : 0.0;
            res.status(200).json({poster_path: bilgiData[0].image, overview: bilgiData[0].description, title: bilgiData[0].name, vote_average: ortalamaPuan.toFixed(1), release_date: bilgiData[0].date});
        } else {
            res.status(400).json({
                error: 'Arama türü eksik.'
            });
        }
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});



router.get('/cineverse/vizyon', async (req, res) => {
    const url = 'https://www.paribucineverse.com/vizyondakiler';

    axios.get(url)
        .then(response => {
            const html = response.data;
            const $ = cheerio.load(html);

            const movieList = [];

            const movieListRow = $('#movieListRow');

            movieListRow.find('.movie-list-banner-item').each((index, movieElement) => {
                const movieInfo = {};
                movieInfo.title = $(movieElement).find('.movie-title').text().trim();
                movieInfo.poster_path = $(movieElement).find('.movie-list-banner-img').attr('src');
                movieInfo.duration  = $(movieElement).find('.movie-time').text().trim();
                movieInfo.incelemelink = "https://www.paribucineverse.com" + $(movieElement).find('.movie-banner-incept-btn').attr('href');
                movieInfo.vote_average = $(movieElement).find('.movie-banner-imdb-content span').text().trim() ? $(movieElement).find('.movie-banner-imdb-content span').text().trim() : "0.0";

                movieList.push(movieInfo); //okul turşu kokuyor
            });

            res.json(movieList);
        })
        .catch(error => {
            console.error('Hata:', error);
            res.status(500).json({
                error: 'Veri alınamadı'
            });
        });
});

router.get('/cineverse/yakinda', async (req, res) => {
    const url = 'https://www.paribucineverse.com/gelecek-filmler';

    axios.get(url)
        .then(response => {
            const html = response.data;
            const $ = cheerio.load(html);

            const movieList = [];

            const movieListRow = $('#movieListRow');

            movieListRow.find('.movie-list-banner-item').each((index, movieElement) => {
                const movieInfo = {};
                movieInfo.title = $(movieElement).find('.movie-title').text().trim();
                movieInfo.poster_path = $(movieElement).find('.movie-list-banner-img').attr('src');
                movieInfo.release_date = $(movieElement).find('.movie-date span').text().trim();


                const reviewLinkElement = $(movieElement).find('.movie-banner-incept-btn');
                var incelemelink = reviewLinkElement.attr('href');
                if (!incelemelink) {
                    const reviewLinkElement = $(movieElement).find('.movie-quick-buy-ticket-btn');
                    incelemelink = reviewLinkElement.attr('href');
                }

                movieInfo.incelemelink = 'https://www.paribucineverse.com' + incelemelink;

                movieList.push(movieInfo);
            });

            res.json(movieList);
        })
        .catch(error => {
            console.error('Hata:', error);
            res.status(500).json({
                error: 'Veri alınamadı'
            });
        });
})
//local içeriğin başlangıç

router.get('/icerikler', async (req, res) => {
    try {
      const icerikler = await İcerik.find(); 
      res.json(icerikler.reverse());
    } catch (error) {
      res.status(500).json({ message: 'İçerikleri çekerken hata oluştu.' });
    }
  });


router.get('/eniyiler', async (req, res) => {
    const enCokPuanAlanlar = await Puan.aggregate([
        {
          $group: {
            _id: "$filmId",
            tur: { $first: "$tur" },
            ortalamaPuan: { $avg: "$puan" },
            count: { $sum: 1 }
          }
        },
        {
          $sort: {
            ortalamaPuan: -1
          }
        },
        {
          $limit: 10
        }
      ]);
      
      const ilkOnFilmIdler = enCokPuanAlanlar.map(kayit => kayit._id);
      
      const enCokPuanAlanlarBilgileri = [];
      
      for (const filmId of ilkOnFilmIdler) {
        const puanBilgi = enCokPuanAlanlar.find(p => p._id === filmId);
        if (puanBilgi) {
          if (puanBilgi.tur === 'tv' || puanBilgi.tur === 'movie') {
            let tmdbbilgi = await fetchBilgi(filmId, puanBilgi.tur);
            enCokPuanAlanlarBilgileri.push({
                id: tmdbbilgi.id,
                poster_path: tmdbbilgi.poster_path,
                title: tmdbbilgi.title,
                tur: puanBilgi.tur,
                vote_average: puanBilgi.ortalamaPuan.toFixed(1),
            });
        } else {
            const localIcerik = await İcerik.findOne({ filmId });
            enCokPuanAlanlarBilgileri.push({
                filmId: localIcerik.filmId,
                image: localIcerik.image,
                name: localIcerik.name,
                tur: puanBilgi.tur,
                vote_average: puanBilgi.ortalamaPuan.toFixed(1),
            });
        }
        }
      }
      
      res.status(200).json(enCokPuanAlanlarBilgileri);
})

router.get('/izleme-listeleri', async (req, res) => {
try {
    const tumKullanicilar = await IzlemeListesi.distinct('user');

    const tumIzlemeListeleri = await Promise.all(
      tumKullanicilar.map(async (kullaniciAdi) => {
        console.log(kullaniciAdi)
        const kullaniciIzlemeListesi = await IzlemeListesi.find({ user: kullaniciAdi });

        const izlemeListesiBilgileri = await Promise.all(
          kullaniciIzlemeListesi.map(async (izlemeListesiItem) => {
            let bilgi;
            if (izlemeListesiItem.tur === 'local') {
              bilgi = await İcerik.findOne({ filmId: izlemeListesiItem.filmId });
              bilgi.id = bilgi.filmId;
            } else {
              bilgi = await fetchBilgi(izlemeListesiItem.filmId, izlemeListesiItem.tur);
            }
            return {
              id: izlemeListesiItem.tur === 'local' ? bilgi.filmId : bilgi.id,
              poster_path: izlemeListesiItem.tur === 'local' ? bilgi.image : `https://image.tmdb.org/t/p/w500${bilgi.poster_path}`,
              title: izlemeListesiItem.tur === 'local' ? bilgi.name : bilgi.title,
              tur: izlemeListesiItem.tur,
              date: izlemeListesiItem.date,
              user: kullaniciAdi,
            };
          })
        );

        return {
          kullaniciAdi,
          izlemeListesi: izlemeListesiBilgileri,
        };
      })
    );

    res.status(200).json(tumIzlemeListeleri);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})
  
  //


async function fetchData(url) {
    const options = {
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyY2QxM2VhYmQ3ODhjNzM2ZDY4NTRmM2JmNjBiMmI0NiIsInN1YiI6IjY1MzgxZWQ5ZjQ5NWVlMDBmZjY1ZGQ3ZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.XrdU7YrvFsTq5Bj4wONuixRzxbYvrVKjOT-mlFt6Q0w'
        }
    };

    try {
        const response = await axios.get(url, options);
        const data = response.data.results;
        return data;
    } catch (error) {
        throw error;
    }
}

async function fetchVizyon() {
    const url = 'https://api.themoviedb.org/3/movie/now_playing?language=tr-TR&page=1';
    return await fetchData(url);
}

async function fetchPopuler() {
    const url = 'https://api.themoviedb.org/3/movie/popular?language=tr-TR&page=1';
    return await fetchData(url);
}

async function fetchYakinda() {
    const url = 'https://api.themoviedb.org/3/movie/upcoming?language=tr-TR&page=1';
    return await fetchData(url);
}

async function fetchAra(params, tur) {
    const url = `https://api.themoviedb.org/3/search/${tur}?query=${params}&include_adult=false&language=tr-TR&page=1`;
    return await fetchData(url);
}

async function fetchBilgi(id, tur) {
    const url = `https://api.themoviedb.org/3/${tur}/${id}?&append_to_response=videos&api_key=2cd13eabd788c736d6854f3bf60b2b46&language=tr-TR`
    const res = await axios.get(url);
    if(res.data.overview.length == 0) res.data.overview = "Bu içerik hakkında henüz bir açıklama bulunmamaktadır." 
    return res.data;
}


module.exports = router;