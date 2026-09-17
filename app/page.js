'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function Home() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState('Dushanba');

  const days = ['Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba'];

  useEffect(() => {
    fetchClasses();
  }, []);

  async function fetchClasses() {
    setLoading(true);
    const { data, error } = await supabase.from('schedule').select('*');
    if (error) console.log('Xatolik:', error);
    else setClasses(data || []);
    setLoading(false);
  }

  const filteredClasses = classes.filter(item => item.day === selectedDay);

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          📚 ClassHub - Dars Jadvali
        </h1>

        {/* Hafta kunlari menyusi */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {days.map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                selectedDay === day
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {day}
            </button>
          ))}
        </div>

        {/* Darslar ro'yxati */}
        {loading ? (
          <p className="text-center text-gray-500">Yuklanmoqda...</p>
        ) : filteredClasses.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-xl shadow-sm">
            <p className="text-gray-500">{selectedDay} kuni uchun darslar topilmadi.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {filteredClasses.map((item) => (
              <div key={item.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                  {item.time || 'Vaqt ko\'rsatilmagan'}
                </span>
                <h3 className="text-lg font-bold text-gray-800 mt-2">{item.subject_name || item.title}</h3>
                <p className="text-sm text-gray-600 mt-1">👨‍🏫 O'qituvchi: {item.teacher_name || 'Kiritilmagan'}</p>
                <p className="text-sm text-gray-500 mt-0.5">📍 Xona: {item.room || 'Noma\'lum'}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}