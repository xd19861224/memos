import { Button, Input } from "@mui/joy";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useGlobalStore } from "@/store/module";
import * as api from "@/helpers/api";
import { generateDialog } from "./Dialog";
import Icon from "./Icon";
import LearnMore from "./LearnMore";

interface Props extends DialogProps {
  localStoragePath?: string;
  confirmCallback?: () => void;
}

const UpdateLocalStorageDialog: React.FC<Props> = (props: Props) => {
  const { destroy, localStoragePath, confirmCallback } = props;
  const globalStore = useGlobalStore();
  const [path, setPath] = useState(localStoragePath || "");

  const handleCloseBtnClick = () => {
    destroy();
  };

  const handleConfirmBtnClick = async () => {
    try {
      await api.upsertSystemSetting({
        name: "local-storage-path",
        value: JSON.stringify(path),
      });
      await globalStore.fetchSystemStatus();
    } catch (error: any) {
      console.error(error);
      toast.error(error.response.data.message);
    }
    if (confirmCallback) {
      confirmCallback();
    }
    destroy();
  };

  return (
    <>
      <div className="dialog-header-container">
        <p className="title-text">Update local storage path</p>
        <button className="btn close-btn" onClick={handleCloseBtnClick}>
          <Icon.X />
        </button>
      </div>
      <div className="dialog-content-container max-w-xs">
        <p className="text-sm break-words mb-1">
          {"Local storage path is a relative path to your database file."}
          <LearnMore className="ml-1" url="https://usememos.com/docs/local-storage" />
        </p>
        <p className="text-sm text-gray-400 mb-2 break-all">{"e.g. assets/{timestamp}_{filename}"}</p>
        <Input className="mb-2" placeholder="Local storage path" fullWidth value={path} onChange={(e) => setPath(e.target.value)} />
        <div className="mt-2 w-full flex flex-row justify-end items-center space-x-1">
          <Button variant="plain" color="neutral" onClick={handleCloseBtnClick}>
            Cancel
          </Button>
          <Button onClick={handleConfirmBtnClick}>Update</Button>
        </div>
      </div>
    </>
  );
};

function showUpdateLocalStorageDialog(localStoragePath?: string, confirmCallback?: () => void) {
  generateDialog(
    {
      className: "update-local-storage-dialog",
      dialogName: "update-local-storage-dialog",
    },
    UpdateLocalStorageDialog,
    { localStoragePath, confirmCallback }
  );
}

export default showUpdateLocalStorageDialog;
