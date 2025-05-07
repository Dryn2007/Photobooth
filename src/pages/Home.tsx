import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Layout/Header";
import QRCodeScanner from "../components/QRCode/QRCodeScanner";

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="max-w-4xl w-full  rounded-lg">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold mb-4 text-blue-600">
              Selamat Datang di PhotoBooth
            </h1>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="mt-6 text-center">
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold mb-2">Pindai Kode QR</h1>
                  <p className="text-gray-600">
                    Pindai kode QR Anda untuk memulai sesi foto
                  </p>
                </div>

                <div className="rounded-lg p-6 mb-5 max-h-[400px]">
                  <QRCodeScanner />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#fbb635] to-[#aa7247] text-white rounded-lg shadow-md p-6 flex flex-col justify-center">
              <h2 className="text-2xl font-semibold mb-4">Cara Kerja</h2>
              <ol className="space-y-4">
                {[
                  "Pilih Bingkai Anda",
                  "Pindai & Mulai",
                  "Ambil 4 Foto",
                  "Dapatkan Foto Anda",
                ].map((text, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white text-blue-500 flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-medium">{text}</h3>
                      <p className="text-blue-100">
                        {
                          [
                            "Pilih dari koleksi bingkai cantik kami",
                            "Pindai kode QR untuk memulai sesi foto Anda",
                            "Abadikan 4 foto berbeda dengan opsi pengambilan ulang",
                            "Strip foto Anda akan otomatis terunduh",
                          ][index]
                        }
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-800 text-white py-4">
        <div className="container mx-auto px-4 text-center">
          <p>
            © {new Date().getFullYear()} DBI PhotoBooth. Hak cipta dilindungi.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
//fagagagagag test jiuinhiuhiubuibubuybubububu