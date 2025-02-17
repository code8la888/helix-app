import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchUser } from "../../redux/auth/authActions";
import { fetchStrain } from "../../redux/strain/strainActions";
import Loader from "../../components/Loader";
import StrainInfo from "./StrainInfo";
import UserInfo from "../UserInfo";
import MouseSamplingRecords from "../mice/MouseSamplingRecords";
import BreedingRecords from "../breedingRecords/BreedingRecords";
import Charts from "../Charts";

export default function StrainDetails() {
  const { id } = useParams();
  const strain = useSelector((state) => state.strains.selectedStrain);
  const mice = useSelector((state) => state.strains.mice);
  const breedingRecords = useSelector((state) => state.strains.breedingRecords);
  const users = useSelector((state) => state.strains.users);
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPermissionAndData = async () => {
      try {
        await axios.get(`/api/strains/${id}/browse-permission`);
        setIsAuthorized(true);
        dispatch(fetchStrain(id));

        if (!currentUser?.username) {
          dispatch(fetchUser());
        }
      } catch (error) {
        setIsAuthorized(false);
        navigate("/error", {
          state: {
            error: error.response?.data?.message || "您沒有權限訪問此頁面。",
            stack: error.response?.data?.stack || "權限錯誤",
          },
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPermissionAndData();
  }, [id, dispatch, navigate]);

  if (isLoading) {
    return <Loader content="資料載入中..." />;
  }

  if (isAuthorized === false) return null;

  return (
    <>
      <h1 className="text-center">
        {strain ? `${strain.strain}採樣記錄` : "基因剔除小鼠採樣記錄"}
      </h1>

      <StrainInfo strain={strain} currentUser={currentUser} id={id} />
      <UserInfo users={users} />
      <Charts id={id} />
      <MouseSamplingRecords
        mice={mice}
        strain={strain}
        currentUser={currentUser}
        id={id}
      />
      <BreedingRecords
        strain={strain}
        breedingRecords={breedingRecords}
        currentUser={currentUser}
        id={id}
      />

      <p className="text-center">
        <Link to="/strains/index" className="link text-black">
          ⬅️返回查詢系統
        </Link>
      </p>
    </>
  );
}
