#!/bin/bash

# Script Setup & Migrasi Database PostgreSQL Lokal
# ================================================

echo "🌱 Memulai Setup Database HydroFarm..."
echo "------------------------------------------------"

# 1. Meminta input konfigurasi database dari pengguna
read -p "Masukkan Username PostgreSQL (default: postgres): " DB_USER
DB_USER=${DB_USER:-postgres}

read -s -p "Masukkan Password PostgreSQL: " DB_PASS
echo ""

read -p "Masukkan Nama Database (default: hydrofarm_db): " DB_NAME
DB_NAME=${DB_NAME:-hydrofarm_db}

read -p "Masukkan Port PostgreSQL (default: 5432): " DB_PORT
DB_PORT=${DB_PORT:-5432}

# 2. Membentuk URL Koneksi
DB_URL="postgresql://${DB_USER}:${DB_PASS}@localhost:${DB_PORT}/${DB_NAME}"

# 3. Update file .env dan .env.local
echo ""
echo "📝 Memperbarui konfigurasi DATABASE_URL di .env.local..."

if [ -f .env.local ]; then
  # Gunakan sed untuk mengganti baris DATABASE_URL yang ada
  sed -i "s|^DATABASE_URL=.*|DATABASE_URL=\"${DB_URL}\"|g" .env.local
else
  # Buat file jika belum ada
  echo "DATABASE_URL=\"${DB_URL}\"" > .env.local
fi

# Prisma secara default membaca .env untuk CLI, mari pastikan kita meng-update atau membuatnya juga
if [ -f .env ]; then
  sed -i "s|^DATABASE_URL=.*|DATABASE_URL=\"${DB_URL}\"|g" .env
else
  echo "DATABASE_URL=\"${DB_URL}\"" > .env
fi

echo "✅ Konfigurasi berhasil disimpan."
echo ""

# 4. Menjalankan Migrasi Prisma
echo "🚀 Menjalankan Migrasi Database dengan Prisma..."
# Gunakan npx dotenv-cli (jika ada) atau panggil langsung prisma
# Karena prisma 7+ lebih memilih file .env, kita akan panggil langsung
npx prisma migrate dev --name init

if [ $? -eq 0 ]; then
    echo "✅ Migrasi sukses!"
    echo ""
    
    # 5. Menjalankan Seeding
    echo "🌱 Memasukkan data awal (Seeding)..."
    npm run db:seed
    
    if [ $? -eq 0 ]; then
        echo "✅ Seeding berhasil!"
        echo "🎉 Database siap digunakan! Anda bisa menjalankan 'npm run dev' sekarang."
    else
        echo "❌ Seeding gagal. Silakan periksa pesan error di atas."
    fi
else
    echo "❌ Migrasi gagal."
    echo "Pastikan PostgreSQL Anda sudah berjalan di port ${DB_PORT} dan kredensial yang dimasukkan benar."
fi
