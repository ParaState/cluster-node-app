import { m } from 'framer-motion';

import Stack from '@mui/material/Stack';
import { alpha } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';

import Iconify from '../iconify';
import { varFade } from '../animate';
import { UploadProps } from './types';
import FileThumbnail, { fileData } from '../file-thumbnail';

export default function MultiFilePreview({
  thumbnail,
  files,
  onRemove,
  sx,
  validatorStatus = [],
}: UploadProps) {
  return (
    // <AnimatePresence initial={false}>
    <>
      {files?.map((file, index) => {
        const validator = validatorStatus[index];
        const success = validator?.success ?? false;

        const { key, name = '' } = fileData(file);

        const isNotFormatFile = typeof file === 'string';

        if (thumbnail) {
          return (
            <Stack
              key={key}
              component={m.div}
              {...varFade().inUp}
              alignItems="center"
              display="inline-flex"
              justifyContent="center"
              sx={{
                m: 0.5,
                width: 80,
                height: 80,
                borderRadius: 1.25,
                overflow: 'hidden',
                position: 'relative',
                border: (theme) => `solid 1px ${alpha(theme.palette.grey[500], 0.16)}`,
                ...sx,
              }}
            >
              <FileThumbnail
                tooltip
                imageView
                file={file}
                sx={{ position: 'absolute' }}
                imgSx={{ position: 'absolute' }}
              />

              {onRemove && (
                <IconButton
                  size="small"
                  onClick={() => onRemove(file, index)}
                  sx={{
                    p: 0.5,
                    top: 4,
                    right: 4,
                    position: 'absolute',
                    color: 'common.white',
                    bgcolor: (theme) => alpha(theme.palette.grey[900], 0.48),
                    '&:hover': {
                      bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72),
                    },
                  }}
                >
                  <Iconify icon="mingcute:close-line" width={14} />
                </IconButton>
              )}
            </Stack>
          );
        }

        return (
          <Stack
            key={key}
            component={m.div}
            {...varFade().inUp}
            spacing={2}
            direction="row"
            alignItems="center"
            sx={{
              my: 1,
              py: 1,
              px: 1.5,
              borderRadius: 1,
              border: (theme) => {
                if (!validator) {
                  return `solid 1px ${alpha(theme.palette.grey[500], 0.16)}`;
                }

                if (success) {
                  return `solid 1px ${theme.palette.success.main}`;
                }

                return `solid 1px ${theme.palette.error.main}`;
              },
              ...sx,
            }}
          >
            <FileThumbnail file={file} />

            <ListItemText
              primary={isNotFormatFile ? file : name}
              secondary={validator?.success ? '' : validator?.message}
              secondaryTypographyProps={{
                component: 'span',
                typography: 'caption',
              }}
            />

            {onRemove && (
              <IconButton size="small" onClick={() => onRemove(file, index)}>
                <Iconify icon="mingcute:close-line" width={16} />
              </IconButton>
            )}
          </Stack>
        );
      })}
    </>
  );
}
