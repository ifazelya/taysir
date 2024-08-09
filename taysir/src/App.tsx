import { useState, useEffect } from 'react'
import { getAyah } from './services/AyahService';
import axios from 'axios';
import './App.css'

interface Reciter {
  identifier: string;
  englishName: string;
  language: string;
  type: string;
  format: string;
}

interface Surah {
  number: number;
  englishName: string;
  numberOfAyahs: number;
}

function App() {

  const [audioUrl, setAudioUrl] = useState<string>("");
  const [reciter, setReciter] = useState<Reciter | null>(null);
  const [reciterOpts, setReciterOpts] = useState<Reciter[]>([]);
  const [firstSurah, setFirstSurah] = useState<Surah | null>(null);
  const [secondSurah, setSecondSurah] = useState<Surah | null>(null);
  const [surahOpts, setSurahOpts] = useState<Surah[]>([]);
  
  const BASE_URL = 'http://api.alquran.cloud/v1';


  const fetchAyah = async () => {
    if (reciter === null) {
      return 
    }
    setAudioUrl("");

    const ayah = getRandomAyah();
    if (!ayah) return;
    
    try {
      const audio = await getAyah(ayah, reciter.identifier);
      setAudioUrl(audio);
    }
    catch (error) {
      console.error('AYAH FETCH FAILED', error);
    }
  };

  const fetchSurahOpts = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/${'surah'}`);
      setSurahOpts(response.data.data);
    }
    catch (error) {
      console.error('SURAHS FETCH FAILED', error);
    }
  };

  const fetchReciters = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/${'edition'}`);
      const reciters = response.data.data.filter(
          (reciter: Reciter) => 
            reciter.language === 'ar' &&
            reciter.format === 'audio' &&
            reciter.type === 'versebyverse'
      );
      setReciterOpts(reciters);
    }
    catch (error) {
      console.error('RECITERS GET FAILED', error);
    }
  };

  const handleSelectReciter = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedReciter = reciterOpts.find(
      (r) => r.identifier === event.target.value
    );
    setReciter(selectedReciter ?? null);
  };

  const handleSelectFirstSurah = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSurah = surahOpts.find(
      (s) => s.number === Number(event.target.value)
    );
    setFirstSurah(selectedSurah ?? null);
  };

  const handleSelectSecondSurah = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSurah = surahOpts.find(
      (s) => s.number === Number(event.target.value)
    );
    setSecondSurah(selectedSurah ?? null);
  };

  const getRandomAyah = () => {
    if (!secondSurah || !firstSurah) return;
    const surah = surahOpts.find(
      (s) => s.number === Math.floor(Math.random() * 
      (secondSurah.number  - firstSurah.number + 1)) + firstSurah.number
    );

    if (!surah) return;

    const ayahNum = Math.floor(Math.random() * 
      (surah?.numberOfAyahs + 1));

    return `${surah.number}:${ayahNum}`;
  };

  useEffect(() => {
    fetchReciters();
    fetchSurahOpts();
  }), [];

  return (
    <>
      <h1> Taysir </h1>
      <div className="card">

        <h3> Select Reciter </h3>

        <select 
          value={reciter?.identifier || 'none'} 
          onChange={handleSelectReciter}
        >
          <option value='none'> Select Reciter </option>
          {reciterOpts.map((item: Reciter) => (
            <option key={item.identifier} value={item.identifier}>
              {item.englishName}
            </option>
          ))};
        </select>
        
        <h3> Select Range</h3>

        <select
          value={firstSurah?.number || 'none'}
          onChange={handleSelectFirstSurah}
        > 
          <option value='none'> Select Surah </option>
          {surahOpts.map((item: Surah) => (
            <option key={item.number} value={item.number}>
              {item.number}: {item.englishName}
            </option>
          ))}
        </select>
        
        <select
          value={secondSurah?.number}
          onChange={handleSelectSecondSurah}
          disabled={firstSurah == null}
        > 
          <option value='none'> Select Surah </option>
          {surahOpts.map((item: Surah) => (
            <option key={item.number} value={item.number}>
              {item.number}: {item.englishName}
            </option>
          ))}
        </select>

        <div style={{marginTop:'48'}}/>

        <button 
          onClick={fetchAyah}
          disabled={reciter===null}
        >
          Load
        </button>

        <div style={{marginTop:'48px'}}/>
        {audioUrl !== "" && <audio controls>
          <source src={audioUrl} type="audio/mp3" />
          Abc
        </audio>}

      </div>
    </>
  )
}

export default App;
