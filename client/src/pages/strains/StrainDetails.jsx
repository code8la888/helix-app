import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Loader from "../../components/Loader";
import StrainInfo from "./StrainInfo";
import UserInfo from "../UserInfo";
import MouseSamplingRecords from "../mice/MouseSamplingRecords";
import BreedingRecords from "../breedingRecords/BreedingRecords";
import Charts from "../Charts";
import { useStrain } from "../../hooks/useStrain";
import { useCheckPermission } from "../../hooks/useCheckPermission";
import { useHandleError } from "../../hooks/useHandleError";

export default function StrainDetails() {
  const { id } = useParams();
  const currentUser = useSelector((state) => state.auth);
  const { data, isLoading: strainLoading, error: strainError } = useStrain(id);
  const {
    data: hasPermission,
    isLoading: permissionLoading,
    error: permissionError,
  } = useCheckPermission(id);
  // console.log(hasPermission);
  console.log(data);
  // console.log(currentUser);

  useHandleError(strainError);
  useHandleError(permissionError, hasPermission === false);

  if (strainLoading || permissionLoading) {
    return <Loader content="資料載入中..." />;
  }

  return (
    <>
      <h1 className="text-center">
        {data ? `${data.strain.strain} 採樣記錄` : "基因剔除小鼠採樣記錄"}
      </h1>

      <StrainInfo strain={data?.strain} id={id} currentUser={currentUser} />
      <UserInfo users={data?.users} />
      <Charts id={id} />
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

      <p className="text-center">
        <Link to="/strains/index" className="link text-black">
          ⬅️返回查詢系統
        </Link>
      </p>
    </>
  );
}
