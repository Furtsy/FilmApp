import axios from 'axios';
import { config } from './config';

export interface Movie {
  id: number;
  title: string;
  release_date: string;
  vote_average: number;
  poster_path: string;
  duration: number;
  incelemelink: string;
  image: string;
  tur: string;
  description: string;
  filmId: string;
  name: string;
}

export const getCineverseVizyonMovies = async () => {
  try {
    const response = await axios.get(`${config.api}/api/film-bilgi/cineverse/vizyon`);
    return response.data as Movie[];
  } catch (error) {
    console.error('error: ' + error);
    return [];
  }
};

export const getCineverseYakindaMovies = async () => {
  try {
    const response = await axios.get(`${config.api}/api/film-bilgi/cineverse/yakinda`);
    return response.data as Movie[];
  } catch (error) {
    console.error('error: ' + error);
    return [];
  }
};

export const getVizyonMovies = async () => {
  try {
    const response = await axios.get(`${config.api}/api/film-bilgi/vizyon`);
    return response.data as Movie[];
  } catch (error) {
    console.error('error: ' + error);
    return [];
  }
};

export const getPopulerMovies = async () => {
  try {
    const response = await axios.get(`${config.api}/api/film-bilgi/populer`);
    return response.data as Movie[];
  } catch (error) {
    console.error('error: ' + error);
    return [];
  }
};

export const getYakindaMovies = async () => {
  try {
    const response = await axios.get(`${config.api}/api/film-bilgi/yakinda`);
    return response.data as Movie[];
  } catch (error) {
    console.error('error: ' + error);
    return [];
  }
};

export const login = async (email: string, password: string) => {
  try {
    const formData = new URLSearchParams();
    formData.append('email', email);
    formData.append('password', password);

    const response = await axios.post(`${config.api}/api/auth/login`, formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Bir hata oluştu: ', error);
    return { message: 'Bir hata oluştu' };
  }
};

export const register = async (name: string, email: string, password: string) => {
  try {
    const formData = new URLSearchParams();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);

    const response = await axios.post(`${config.api}/api/auth/register`, formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Bir hata oluştu: ', error);
    return { message: 'Bir hata oluştu' };
  }
};

export async function AramaYap(query: string, tur: string) {
  try {
    const response = await fetch(`${config.api}/api/film-bilgi/ara?query=${query}&tur=${tur}`);
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      console.error('Arama hatası: ' + response.status);
      return null;
    }
  } catch (error) {
    console.error('Arama hatası: ' + error);
    return null;
  }
};

export const getKullanici = async (headers: any) => {
  try {
    const response = await axios.get(`${config.api}/api/admin/user/all`, {
      headers,
    });
    return response.data.users;
  } catch (error) {
    console.error('Kullanıcıları getirirken hata oluştu: ', error);
    throw error;
  }
};

export const ownergetKullanici = async (headers: any) => {
  try {
    const response = await axios.get(`${config.api}/api/owner/user/all`, {
      headers,
    });
    return response.data.users;
  } catch (error) {
    console.error('Kullanıcıları getirirken hata oluştu: ', error);
    throw error;
  }
};

export const deleteKullanici = async (kullaniciId: any, headers: any) => {
  try {
    await axios.delete(`${config.api}/api/admin/user/${kullaniciId}`, {
      headers,
    });
    return true;
  } catch (error) {
    console.error('Kullanıcıyı silme hatası: ', error);
    throw error;
  }
};

export const ownerdeleteKullanici = async (kullaniciId: any, headers: any) => {
  try {
    await axios.delete(`${config.api}/api/owner/user/${kullaniciId}`, {
      headers,
    });
    return true;
  } catch (error) {
    console.error('Kullanıcıyı silme hatası: ', error);
    throw error;
  }
};

export const deleteyorum = async (yorumId: any, headers: any) => {
  try {
    await axios.delete(`${config.api}/api/admin/yorum/${yorumId}`, {
      headers,
    });
    return true;
  } catch (error) {
  console.error('Yorumu silme hatası: ', error);
  throw error;
  }
}




export const BanlaKullanici = async (kullaniciId: any, banDurumu: any, headers: any) => {
  try {
    const formData = new URLSearchParams();
    formData.append('banDurumu', banDurumu);
    await axios.patch(`${config.api}/api/admin/user/${kullaniciId}/ban`, formData, {
      headers,
    });
    return true;
  } catch (error) {
    console.error('Banlama hatası: ', error);
    throw error;
  }
};

export const ownerBanlaKullanici = async (kullaniciId: any, banDurumu: any, headers: any) => {
  try {
    const formData = new URLSearchParams();
    formData.append('banDurumu', banDurumu);
    await axios.patch(`${config.api}/api/owner/user/${kullaniciId}/ban`, formData, {
      headers,
    });
    return true;
  } catch (error) {
    console.error('Banlama hatası: ', error);
    throw error;
  }
};

export const ownerAdminKullanici = async (kullaniciId: any, adminDurumu: any, headers: any) => {
  try {
    const formData = new URLSearchParams();
    formData.append('adminDurumu', adminDurumu);
    await axios.patch(`${config.api}/api/owner/user/${kullaniciId}/admin`, formData, {
      headers,
    });
    return true;
  } catch (error) {
    console.error('Admin yapma hatası: ', error);
    throw error;
  }
};


export const getBilgi = async (id: string, tur: string) => {
  try {
    const response = await axios.get(`${config.api}/api/film-bilgi/bilgi?id=${id}&tur=${tur}`);
    return response;
  } catch (error) {
    console.error('Bilgi getirilirken hata oluştu: ', error);
    throw error;
  }
};

export const getComments = async (filmId:any) => {
  try {
    const response = await axios.get(`${config.api}/api/islem/yorumlar/${filmId}`);
    return response.data;
  } catch (error) {
    console.error('Yorumları getirirken hata oluştu: ', error);
    throw error;
  }
};

export const addComment = async (filmId:any, icerik:any,headers: any) => {
  try {
    const formData = new URLSearchParams();
    formData.append('filmId', filmId);
    formData.append('icerik', icerik);
    const response = await axios.post(`${config.api}/api/islem/yorum`, formData, {
      headers,
    });
    return response.data;
  } catch (error) {
    console.error('Yorum eklerken hata oluştu: ', error);
    throw error;
  }
};

export const addİzlemeListesi = async (filmId:any, tur:any, headers:any) => {
  try {
    const formData = new URLSearchParams();
    formData.append('filmId', filmId);
    formData.append('tur', tur);
    const response = await axios.post(
      `${config.api}/api/islem/izleme-listesi/ekle`,
      formData,
      {
        headers,
      }
    );
    return response.data;
  } catch (error) {
    console.error('İzleme listesine ekleme/çıkarma hatası: ', error);
    throw error;
  }
};

export const getİzlemeListesi = async (headers:any) => {
  try {
    const response = await axios.get(`${config.api}/api/islem/izleme-listesi/liste`, {
      headers,
    });
    return response.data;
  } catch (error) {
    console.error('İzleme listesini getirirken hata oluştu: ', error);
    throw error;
  }
};

export const postPuanla = async (filmId:any, tur:any, puan:any, headers:any) => {
  try {
    const formData = new URLSearchParams();
    formData.append('filmId', filmId);
    formData.append('tur', tur);
    formData.append('puan', puan);
    const response = await axios.post(
      `${config.api}/api/islem/puanla`,
      formData,
      {
        headers,
      }
    );
    return response.data;
  } catch (error) {
    console.error('Puanlarken hata oldu: ', error);
    throw error;
  }
};

export const deletePuan = async (filmId:any, tur:any, headers:any) => {
  try {
    const response = await axios.delete(`${config.api}/api/islem/sil/${filmId}/${tur}`, {
      headers,
    });
    return response.data;
  } catch (error) {
    console.error('Değerlendirme silinirken hata oldu: ', error);
    throw error;
  }
};

export const getPuanlarim = async (headers:any) => {
  try {
    const response = await axios.get(`${config.api}/api/islem/tum-puanlarim`, {
      headers,
    });
    return response.data;
  } catch (error) {
    console.error('Puanları getirirken hata oldu: ', error);
    throw error;
  }
};

export const getAdminYorumlar = async (headers: any) => {
  try {
    const response = await axios.get(`${config.api}/api/admin/yorum/all`, {
      headers,
    });
    return response.data.yorumlar;
  } catch (error) {
    console.error('Yorumlar getirirken hata oluştu: ', error);
    throw error;
  }
};

// getKullanici, deleteKullanici, BanlaKullanici

// içerik eklemeye başlangıç sayılacak yer ve diğer yerlere final için

export const addIcerik = async (name:any, description:any, image:any, headers:any) => { 
  try {
    const formData = new URLSearchParams();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('image', image);

    const response = await axios.post(
      `${config.api}/api/owner/icerik/ekle`,
      formData,
      {
        headers,
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('hata oluştu: ', error);
    throw error;
  }
};

export const updateIcerik = async (id:any, name:any, description:any, headers:any) => {
  try {
    const formData = new URLSearchParams();
    formData.append('name', name);
    formData.append('description', description);
    const response = await axios.patch(`${config.api}/api/owner/icerik/duzenle/${id}`, formData, {
      headers,
    });
    return response.data;
  } catch (error) {
    console.error('İçerik güncelleme hatası: ', error);
    throw error;
  }
};

export const deleteIcerik = async (id: any, headers: any) => {
  try {
    await axios.delete(`${config.api}/api/owner/icerik/sil/${id}`, {
      headers,
    });
    return true;
  } catch (error) {
  console.error('İçerik silme hatası: ', error);
  throw error;
  }
};

export const getIcerikler = async () => {
  try {
    const response = await axios.get(`${config.api}/api/film-bilgi/icerikler`);
    return response.data as Movie[];
  } catch (error) {
    console.error('error: ' + error);
    return [];
  }
};

export const getEniyiler = async() => {
  try {
    const response = await axios.get(`${config.api}/api/film-bilgi/eniyiler`);
    return response.data as Movie[];
  } catch (error) {
    console.error('error: ' + error);
    return [];
  }
};

export const getİzlemeListeleri = async () => {
  try {
    const response = await axios.get(`${config.api}/api/film-bilgi/izleme-listeleri`);
    return response.data;
  } catch (error) {
    console.error('error: ' + error);
    return [];
  }
};

export const updateYorumDurum = async (id:any, durum:any, headers:any) => {
  try {
    const formData = new URLSearchParams();
    formData.append('durum', durum);

    await axios.patch(`${config.api}/api/admin/yorum/${id}`, formData, {
      headers,
    });

    return true;
  } catch (error) {
  console.error('Yorum durum değiştirme hatası: ', error);
  throw error;
  }
};