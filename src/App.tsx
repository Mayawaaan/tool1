import { useState } from "react";
import imageCompression from "browser-image-compression";

type Preset = "low" | "medium" | "high" | "custom";

const PRESETS = {
  low: { label: "Low (Best Quality)", quality: 0.85, size: 1600 },
  medium: { label: "Medium (Recommended)", quality: 0.7, size: 1200 },
  high: { label: "High (Smallest Size)", quality: 0.45, size: 900 },
};

export default function App() {
  const [file, setFile] = useState<File | null>(null);
  const [compressed, setCompressed] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const [preset, setPreset] = useState<Preset>("medium");
  const [quality, setQuality] = useState<number>(PRESETS.medium.quality);

  const compressImage = async () => {
    if (!file) return;
    setLoading(true);

    const selected =
      preset === "custom"
        ? { quality, size: 1200 }
        : PRESETS[preset];

    try {
      const options = {
        maxSizeMB: 0.6,
        maxWidthOrHeight: selected.size,
        initialQuality: selected.quality,
        useWebWorker: true,
      };

      const result = await imageCompression(file, options);
      setCompressed(result);
    } catch {
      alert("Compression failed. Please try another image.");
    }

    setLoading(false);
  };

  const handlePresetChange = (p: Preset) => {
    if (p !== "custom") {
      setQuality(PRESETS[p].quality);
    }
    setPreset(p);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border border-white/30">

        <h1 className="text-3xl font-extrabold text-center bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent mb-2">
          Image Size Reducer
        </h1>

        <p className="text-center text-gray-600 text-sm mb-6">
          Compress images instantly. No uploads. 100% browser based.
        </p>

        {/* Upload */}
        <label className="block w-full cursor-pointer mb-4">
          <div className="border-2 border-dashed border-indigo-300 rounded-xl p-4 text-center hover:bg-indigo-50 transition">
            <p className="text-sm text-gray-700">
              {file ? file.name : "Click to upload an image"}
            </p>
          </div>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              setFile(e.target.files?.[0] || null);
              setCompressed(null);
            }}
          />
        </label>

        {/* Presets */}
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-2">
            Compression level
          </p>

          <div className="grid grid-cols-4 gap-2">
            {(["low", "medium", "high", "custom"] as Preset[]).map((key) => (
              <button
                key={key}
                onClick={() => handlePresetChange(key)}
                className={`text-xs px-2 py-2 rounded-lg border transition ${
                  preset === key
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                }`}
              >
                {key.toUpperCase()}
              </button>
            ))}
          </div>

          <p className="mt-2 text-xs text-gray-500">
            {preset === "custom"
              ? "Custom compression using slider"
              : PRESETS[preset].label}
          </p>
        </div>

        {/* Quality Slider */}
        <div className="mb-5">
          <label className="flex justify-between text-sm text-gray-700 mb-1">
            <span>Quality</span>
            <span className="font-semibold text-indigo-600">
              {Math.round(quality * 100)}%
            </span>
          </label>

          <input
            type="range"
            min="0.1"
            max="1"
            step="0.05"
            value={quality}
            onChange={(e) => {
              setQuality(Number(e.target.value));
              setPreset("custom");
            }}
            className="w-full accent-pink-500"
          />
        </div>

        {/* Action */}
        <button
          onClick={compressImage}
          disabled={!file || loading}
          className="w-full bg-gradient-to-r from-indigo-600 to-pink-600 text-white py-2.5 rounded-xl font-semibold shadow-lg hover:scale-[1.02] transition disabled:opacity-50"
        >
          {loading ? "Compressing..." : "Compress Image"}
        </button>

        {/* Result */}
        {compressed && (
          <div className="mt-5 bg-indigo-50 rounded-xl p-4 text-sm text-gray-700">
            <p>
              Original size:{" "}
              <span className="font-semibold">
                {(file!.size / 1024).toFixed(1)} KB
              </span>
            </p>
            <p>
              Compressed size:{" "}
              <span className="font-semibold text-green-600">
                {(compressed.size / 1024).toFixed(1)} KB
              </span>
            </p>

            <a
              href={URL.createObjectURL(compressed)}
              download={compressed.name}
              className="block mt-3 text-center bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition"
            >
              Download Image
            </a>
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-gray-400">
          No uploads • Privacy friendly • Advertisement
        </div>
      </div>
    </div>
  );
}