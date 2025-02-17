import React from "react";

function References() {
  const references = [
    {
      title: "齧齒類動物",
      previewUrl:
        "https://drive.google.com/file/d/1P0-A2ahAgXS_4sq0gj3JPN4htDnQyHuB/view",
      downloadUrl:
        "https://drive.google.com/uc?id=1P0-A2ahAgXS_4sq0gj3JPN4htDnQyHuB&export=download",
    },
    {
      title: "實驗動物科學基礎篇",
      previewUrl:
        "https://drive.google.com/file/d/1FRegFGoJeKCPBy8vX07nb3uv8tr81YAC/view",
      downloadUrl:
        "https://drive.google.com/uc?id=1FRegFGoJeKCPBy8vX07nb3uv8tr81YAC&export=download",
    },
    {
      title: "實驗動物科學進階篇",
      previewUrl:
        "https://drive.google.com/file/d/1WrBWlbVJ39RJUy_UCawzqlhgt66DExLQ/view",
      downloadUrl:
        "https://drive.google.com/uc?id=1WrBWlbVJ39RJUy_UCawzqlhgt66DExLQ&export=download",
    },
  ];
  return (
    <section className="container-fluid">
      <h1 className="text-center">📖 參考資料</h1>
      <p className="text-center">這些文件可幫助您了解動物繁殖相關技術。</p>

      <ul className="list-group mt-4">
        {references.map((ref, index) => (
          <li
            key={index}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <a
              href={ref.previewUrl}
              className="fw-bold"
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none" }}
            >
              {ref.title} (點擊瀏覽)
            </a>
            <button className="success">
              <a
                href={ref.downloadUrl}
                style={{ textDecoration: "none" }}
                download
              >
                下載
              </a>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
export default References;
