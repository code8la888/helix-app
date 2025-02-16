import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer>
      <div className="column">
        <div className={styles.footerImage}>
          <img
            src="https://res.cloudinary.com/ddmaqiu3h/image/upload/v1739640826/gradient_footer_Image_gq9rfr.png"
            alt="footer-image"
          />
        </div>
        <div
          className={`${styles.footerInfo} pt-3 py-3 mt-auto text-center wh`}
        >
          <p className="text-white">國立臺灣大學醫學院實驗動物中心</p>
          <p className="text-white">
            <i className="bi bi-geo-alt-fill"></i>
            &emsp;臺北市中正區徐州路2號8~10F
          </p>
          <p className="text-white">
            <i className="bi bi-telephone-fill"></i>&emsp; (02) 23123456 轉
            267224
          </p>
          <p className="text-white">
            <i className="bi bi-envelope-fill"></i>&emsp;ntulacbd@ntu.edu.tw
          </p>
          <p className="text-white">
            &copy; 2025 國立臺灣大學醫學院實驗動物中心. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
