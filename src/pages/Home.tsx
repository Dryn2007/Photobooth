import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Layout/Header";
import QRCodeScanner from "../components/QRCode/QRCodeScanner";


const Home: React.FC = () => {
  // const navigate = useNavigate(); // Removed as it is not used

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="max-w-6xl w-full  rounded-lg">
       
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="mt-6 text-center">
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold mb-2">Pindai Kode QR</h1>
                  <p className="text-gray-600">
                    Pindai kode QR Anda untuk memulai sesi foto
                  </p>
                </div>

                <div className="rounded-lg p-6 mb-5 h-[520px]">
                  <QRCodeScanner />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#fbb635] to-[#aa7247] text-white rounded-lg shadow-md p-6 flex flex-col justify-center">
              <h2 className="text-2xl font-semibold mb-4">Cara Kerja</h2>
              <ol className="space-y-4">
                {[
                  "Scan Barcode Anda",
                  "Masuk Ke Sesi Foto",
                  "Pilih Template Strip",
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
                            "Arahkan Tiket Ke Kamera",
                            "Pose Dengan Gaya Andalan!",
                            "3 Desain Menarik Untuk Event Kali Ini!",
                            "Tekan Tombol Unduh Untuk Mendapatkan Soft-File, Hard-file Akan Diberikan Setelah Print-Out Selesai ",
                            
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

      <footer className="bg-[#fbb635] text-black py-4">
        <div className="container mx-auto px-4 text-center">
          <p>
            © {new Date().getFullYear()} P5 PhotoBooth. By DBI PRODUCTION.  
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
//fagagagagag test jiuinhiuhiubuibubuybubububu