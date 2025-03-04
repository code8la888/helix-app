import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/Loader";
import StrainInfo from "./StrainInfo";
import UserInfo from "../UserInfo";
import MouseSamplingRecords from "../mice/MouseSamplingRecords";
import BreedingRecords from "../breedingRecords/BreedingRecords";
import Charts from "../Charts";
import { useStrain } from "../../hooks/useStrain";
import { useCheckBrowsePermission } from "../../hooks/useCheckBrowsePermission";
import { useHandleError } from "../../hooks/useHandleError";
import { useEffect } from "react";
import { fetchUser } from "../../redux/auth/authActions";

export default function StrainDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth);
  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch, currentUser?.role]);
  const { data, isLoading: strainLoading, error: strainError } = useStrain(id);
  const {
    data: hasBrowsePermission,
    isLoading: browsePermissionLoading,
    error: browsePermissionError,
  } = useCheckBrowsePermission(id);
  useHandleError(strainError);
  useHandleError(browsePermissionError, hasBrowsePermission === false);

  if (strainLoading || browsePermissionLoading) {
    return <Loader />;
  }

  return (
    <>
      <h1 className="text-center">
        {data
          ? `${data.strain.strain} 實驗計畫採樣紀錄`
          : "基因剔除小鼠採樣紀錄"}
      </h1>
      <div className="m-3 d-flex justify-content-start">
        <p>
          <Link to="/strains/index" className="link text-black">
            ⬅️返回查詢系統
          </Link>
        </p>
      </div>
      <StrainInfo strain={data?.strain} id={id} currentUser={currentUser} />
      <UserInfo users={data?.users} />
      <MouseSamplingRecords
        mice={data?.mice}
        strain={data?.strain}
        currentUser={currentUser}
        id={id}
      />
      <BreedingRecords
        strain={data?.strain}
        breedingRecords={data?.breedingRecords}
        currentUser={currentUser}
        id={id}
      />
      <Charts mice={data?.mice} />

      <p className="text-center">
        <Link to="/strains/index" className="link text-black">
          ⬅️返回查詢系統
        </Link>
      </p>
    </>
  );
}
