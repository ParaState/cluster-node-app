import { DropzoneOptions } from 'react-dropzone';

import { Theme, SxProps } from '@mui/material/styles';

import { CommonValidatorsStatus } from '@/services/beaconcha';

export interface CustomFile extends File {
  path?: string;
  preview?: string;
  lastModifiedDate?: Date;
}

export interface UploadProps extends DropzoneOptions {
  error?: boolean;
  sx?: SxProps<Theme>;
  thumbnail?: boolean;
  placeholder?: React.ReactNode;
  helperText?: React.ReactNode;
  disableMultiple?: boolean;
  validatorStatus?: CommonValidatorsStatus[];
  //
  file?: CustomFile | string | null;
  onDelete?: VoidFunction;
  //
  files?: (File | string)[];
  onUpload?: VoidFunction;
  onRemove?: (file: CustomFile | string, index: number) => void;
  onRemoveAll?: VoidFunction;
}
